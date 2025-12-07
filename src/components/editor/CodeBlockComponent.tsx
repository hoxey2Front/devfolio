import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { Check, Copy, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockComponentProps {
  node: {
    attrs: {
      language: string;
    };
  };
  updateAttributes: (attrs: { language: string }) => void;
  extension: {
    options: {
      lowlight: any;
    };
  };
  editor: any;
}

export default function CodeBlockComponent({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
  editor,
}: CodeBlockComponentProps) {
  const [copied, setCopied] = React.useState(false);
  const isEditable = editor.isEditable;

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
    // NodeViewContent 내부의 텍스트를 가져오기 위해 DOM 접근
    // ref를 사용하는 것이 좋지만, Tiptap NodeView 구조상 직접 접근이 필요할 수 있음
    // 여기서는 간단히 클립보드 API 사용 (실제 구현 시에는 content prop을 통해 가져오는 것이 더 안전할 수 있음)
    // 하지만 NodeView에서는 content prop이 직접 제공되지 않으므로, 
    // 에디터 인스턴스를 통해 가져오거나 DOM 텍스트를 읽어야 함.
    // 여기서는 DOM 텍스트를 읽는 방식을 사용 (간단한 구현)

    // *주의*: 이 컴포넌트가 렌더링된 DOM 요소 내부의 code 태그를 찾아야 함
    // ref를 사용하여 wrapper에 접근
    if (wrapperRef.current) {
      const codeElement = wrapperRef.current.querySelector('code');
      if (codeElement) {
        const text = codeElement.innerText;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const wrapperRef = React.useRef<HTMLDivElement>(null);

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
