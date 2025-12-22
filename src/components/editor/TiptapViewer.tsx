'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import { ResizableImage } from './ResizableImage';
import { useEffect } from 'react';

import { CustomCodeBlock } from './CustomCodeBlock';

interface TiptapViewerProps {
  content: string;
}

export function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // 기본 코드 블록 비활성화
        link: false, // StarterKit의 기본 link가 있다면 비활성화하여 중복 방지
      }),
      CustomCodeBlock, // 커스텀 코드 블록 추가
      Typography,
      Link.configure({
        openOnClick: true,
      }),
      ResizableImage.configure({
        allowBase64: true,
      }),
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-slate dark:prose-invert max-w-none focus:outline-none py-2 text-sm',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // 헤딩에 ID 추가
  useEffect(() => {
    if (!editor) return;

    const addHeadingIds = () => {
      const editorElement = document.querySelector('.tiptap-viewer');
      if (!editorElement) return;

      const headings = editorElement.querySelectorAll('h1, h2, h3');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
      });
    };

    // DOM이 업데이트된 후 실행
    setTimeout(addHeadingIds, 100);
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-viewer">
      <EditorContent editor={editor} />
    </div>
  );
}
