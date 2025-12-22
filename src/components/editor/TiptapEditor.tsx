'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import { ResizableImage } from './ResizableImage';
import { Button } from '@/components/ui/button';
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
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
  Link2,
  ImageIcon,
} from 'lucide-react';
import { CustomCodeBlock } from './CustomCodeBlock';
import { SlashCommand, getSuggestionItems, renderItems } from './slash-command';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export interface TiptapEditorRef {
  getEditor: () => Editor | null;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ content, onChange, placeholder = '내용을 입력하세요...' }, ref) => {
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
        Placeholder.configure({
          placeholder,
        }),
        Typography,
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: {
            class: 'text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all cursor-pointer',
          },
        }),
        ResizableImage.configure({
          allowBase64: true,
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
        handleKeyDown: (view, event) => {
          if (event.key === 'Enter') {
            const { state } = view;
            const { selection } = state;
            const { $from } = selection;

            // Only trigger if we are at the end of a paragraph
            const textBefore = $from.parent.textContent;
            const trimmedText = textBefore.trim();

            const isImageUrl = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmedText) &&
              (trimmedText.startsWith('http://') || trimmedText.startsWith('https://'));

            if (isImageUrl) {
              // Replace the current block with an image
              view.dispatch(
                state.tr
                  .delete($from.before(), $from.after())
                  .insert($from.before(), state.schema.nodes.image.create({ src: trimmedText }))
              );
              return true;
            }
          }
          return false;
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

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    const addImage = async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const formData = new FormData();
          formData.append('file', file);

          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const { url } = await response.json();

            if (url && editor) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('이미지 업로드에 실패했습니다.');
          }
        }
      };

      input.click();
    };

    const addLink = () => {
      if (!editor) return;

      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL을 입력하세요:', previousUrl);

      // cancelled
      if (url === null) return;

      // empty
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

      if (isImage) {
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        // selection이 있으면 해당 텍스트에 링크, 없으면 URL을 텍스트로 삽입
        const { from, to } = editor.state.selection;
        const hasSelection = from !== to;

        if (hasSelection) {
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        } else {
          editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
        }
      }
    };

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

          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={addLink}
            className={`h-9 px-3 ${editor.isActive('link') ? 'bg-muted' : ''}`}
            title="링크 삽입"
          >
            <Link2 className="size-3.5 sm:size-5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={addImage}
            className="h-9 px-3"
            title="이미지 삽입"
          >
            <ImageIcon className="size-3.5 sm:size-5" />
          </Button>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>
    );
  }
);

TiptapEditor.displayName = 'TiptapEditor';
