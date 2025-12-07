'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
} from 'lucide-react';
import { CustomCodeBlock } from './CustomCodeBlock';
import { SlashCommand, getSuggestionItems, renderItems } from './slash-command';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = '내용을 입력하세요...' }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // 기본 코드 블록 비활성화
      }),
      CustomCodeBlock, // 커스텀 코드 블록 추가
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] px-8 py-4 text-sm',
      },
    },
    immediatelyRender: false, // SSR Hydration Mismatch 방지
  });

  // content prop이 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-9 px-3 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
          title="굵게 (Ctrl+B)"
        >
          <Bold className="size-3.5 sm:size-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-9 px-3 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
          title="기울임 (Ctrl+I)"
        >
          <Italic className="size-3.5 sm:size-5" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-9 px-3 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
          title="제목 1"
        >
          <Heading1 className="size-4.5 sm:size-6" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-9 px-3 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
          title="제목 2"
        >
          <Heading2 className="size-4.5 sm:size-6" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-9 px-3 ${editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}`}
          title="제목 3"
        >
          <Heading3 className="size-4.5 sm:size-6" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-9 px-3 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
          title="목록"
        >
          <List className="size-3.5 sm:size-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-9 px-3 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
          title="번호 목록"
        >
          <ListOrdered className="size-3.5 sm:size-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-9 px-3 ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
          title="인용"
        >
          <Quote className="size-3.5 sm:size-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`h-9 px-3 ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
          title="코드 블록"
        >
          <Code className="size-3.5 sm:size-5" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
