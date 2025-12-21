import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function for timeout fetch with optional retries and exponential backoff
// Focused on 502 resilience: 30s timeout, 3 retries with exponential backoff
async function fetchWithTimeout(url: string, options: any = {}, timeout = 30000, maxRetries = 3) {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      if (attempt > 0) {
        // Exponential backoff: 2s, 4s, 8s
        const backoffDelay = Math.pow(2, attempt) * 1000;
        console.log(`[ImageGen] 502 Recovery: Retry attempt ${attempt}/${maxRetries} for: ${url} (Backoff ${backoffDelay}ms)`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);

      // RETRY on 5xx errors (like 502 Bad Gateway)
      if (response.status >= 500 && attempt < maxRetries) {
        console.warn(`[ImageGen] Attempt ${attempt} returned status ${response.status}, retrying...`);
        continue;
      }

      return response;
    } catch (error: any) {
      clearTimeout(id);
      lastError = error;
      
      if (error.name === 'AbortError') {
        console.error(`[ImageGen] Attempt ${attempt} timed out after ${timeout}ms`);
      } else {
        console.error(`[ImageGen] Attempt ${attempt} failed: ${error.message}`);
      }
      
      if (attempt === maxRetries) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timed out after ${timeout}ms (Attempt ${attempt + 1}/${maxRetries + 1})`);
        }
        throw error;
      }
    }
  }
  throw lastError;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[ImageGen] Starting generation process...');
  
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    let finalPrompt = prompt.trim();

    // 1. Gemini Translation Step (Extreme Precision Mode)
    if (apiKey) {
      const geminiStart = Date.now();
      try {
        console.log('[ImageGen] Gemini Translation Start:', finalPrompt);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const translationPrompt = `You are an Extreme Precision AI Image Prompt Engineer. 
        Your task is to transform the user's request into a hyper-detailed English prompt that ensures 99% match accuracy.

        STRICT RULES:
        1. SEMANTIC ANALYSIS: Every single object, action, color, and detail in the original request MUST be included.
        2. VISUAL MAPPING: Map abstract concepts into concrete, high-fidelity visual descriptions.
        3. LAYERED STRUCTURE: Follow this hierarchy: 
           - [PRIMARY SUBJECTS & CORE ACTIONS]
           - [DETAILED TEXTURES, MATERIALS, & EXPRESSIONS]
           - [SPECIFIC ENVIRONMENT & BACKGROUND ELEMENTS]
           - [ATMOSPHERIC LIGHTING & COLOR PALETTE]
           - [STUDIO GHIBLI ANIME AESTHETIC FRAME]
        4. NO SEMANTIC DRIFT: Technically specific terms (like "Frontend Developer") must be grounded visually (e.g., "sitting at a desk with code on screens").
        5. GHIBLI AESTHETIC: Maintain the hand-painted, soft-lit, whimsical Ghibli style throughout.
        6. OUTPUT: Return ONLY the final English prompt string. No conversational filler.

        Original User Request: "${finalPrompt}"`;
        
        const result = await model.generateContent(translationPrompt);
        const translatedText = result.response.text().trim();
        
        if (translatedText) {
          console.log('[ImageGen] Gemini High-Fidelity Translation Success:', translatedText);
          finalPrompt = translatedText;
        }
      } catch (geminiError) {
        console.error('[ImageGen] Gemini translation failed:', geminiError);
      }
    }

    // 2. Pollinations.ai Generation Step (99% Precision Mode with Flux)
    const pollStart = Date.now();
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const seed = Math.floor(Date.now() / 1000); 
    // Re-enabled model=flux for maximum prompt adherence (99% match goal)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

    console.log('[ImageGen] Pollinations.ai Fetch Start:', imageUrl);
    
    let response;
    try {
      // 30s timeout, increased to 3 retries for 502 resilience
      response = await fetchWithTimeout(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }, 30000, 3);
    } catch (fetchErr: any) {
      console.error('[ImageGen] Pollinations fetch failed or timed out:', fetchErr.message);
      throw new Error(`AI service connection failed: ${fetchErr.message}`);
    }
    
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[ImageGen] Pollinations API returned error status:', response.status, errorText);
        throw new Error(`AI service returned error ${response.status}: ${errorText.substring(0, 100)}`);
    }

    console.log('[ImageGen] Pollinations Fetch Success (Took ' + (Date.now() - pollStart) + 'ms). Reading buffer...');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Save locally
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.error('[ImageGen] Error creating upload directory:', e);
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `ai-gen-${uniqueSuffix}.png`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const localUrl = `/uploads/${filename}`;
    console.log('[ImageGen] Total Process Success (Total ' + (Date.now() - startTime) + 'ms):', localUrl);
    
    return NextResponse.json({ url: localUrl });

  } catch (error: any) {
    console.error('[ImageGen] Fatal error in route:', error);
    return NextResponse.json({ 
      error: 'Failed to generate image', 
      details: error.message 
    }, { status: 500 });
  }
}
