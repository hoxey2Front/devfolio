'use client';

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { Check, Copy, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/core'; // Editor 타입 추가

// Tiptap 관련 타입은 별도의 파일에 정의하는 것이 좋지만, 
// 여기서는 구체적인 타입을 interface로 선언합니다.

interface CodeBlockNode {
  attrs: {
    language: string;
  };
}

interface CodeBlockComponentProps {
  node: CodeBlockNode;
  updateAttributes: (attrs: { language: string }) => void;
  editor: Editor; // Editor 타입으로 구체화
}

export default function CodeBlockComponent({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  editor,
}: CodeBlockComponentProps) {
  const [copied, setCopied] = React.useState(false);
  const isEditable = editor.options.editable; // isEditable은 editor.options.editable을 사용하거나 editor.isEditable getter 사용
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // 프론트엔드 개발 위주로 추린 언어 목록
  const languages = [
    'html',
    'css',
    'javascript',
    'typescript',
    'json',
    'markdown',
    'bash',
    'yaml',
    'sql',
  ];

  const handleCopy = () => {
    if (wrapperRef.current) {
      // NodeViewContent 내부의 실제 코드 텍스트를 담고 있는 DOM 요소를 찾습니다.
      const codeElement = wrapperRef.current.querySelector('code');
      if (codeElement) {
        const text = codeElement.innerText;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };


  return (
    <NodeViewWrapper className="code-block relative my-4 rounded-lg overflow-hidden border border-border bg-muted/50" ref={wrapperRef}>
      <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border-b border-border">
        {/* Mac-style window controls */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              contentEditable={false}
              disabled={!isEditable}
              value={defaultLanguage || 'markdown'}
              onChange={(e) => updateAttributes({ language: e.target.value })}
              className={`h-6 pl-2 pr-4 text-xs bg-transparent border-none outline-none appearance-none rounded ${isEditable ? 'cursor-pointer hover:bg-background/50' : 'cursor-default opacity-100'
                }`}
            >
              {languages.map((lang: string) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-background/50"
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      <pre className="!m-0 !p-4 !bg-transparent">
        <NodeViewContent as="div" />
      </pre>
    </NodeViewWrapper>
  );
}