import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Using Pollinations.ai for image generation
    // Format: https://image.pollinations.ai/prompt/{prompt}?width=1024&height=1024&nologo=true
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    // Fetch the image to verify it's valid and to convert it to a buffer if needed
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error('Failed to generate image from AI service');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // We'll return the buffer as a base64 string or we could directly stream it.
    // However, to integrate with the existing upload API, let's return the URL first
    // Or even better, let's just return the Pollinations URL for now and handle the local save in the frontend 
    // to reuse the existing upload logic.
    
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
