
import { Extension, Editor } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { CommandList } from './CommandList';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Link2,
} from 'lucide-react';

// Define the shape of a suggestion item
interface SuggestionItem {
  title: string;
  description: string;
  searchTerms: string[];
  icon: React.ComponentType;
  command: (params: { editor: Editor; range: { from: number; to: number } }) => void;
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: any }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const getSuggestionItems = ({ query }: { query: string }) => {
  const items: SuggestionItem[] = [
    {
      title: '제목 1',
      description: '섹션 제목 (대)',
      searchTerms: ['h1', 'heading1', '제목1', '큰제목'],
      icon: Heading1,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: '제목 2',
      description: '섹션 제목 (중)',
      searchTerms: ['h2', 'heading2', '제목2', '중간제목'],
      icon: Heading2,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: '제목 3',
      description: '섹션 제목 (소)',
      searchTerms: ['h3', 'heading3', '제목3', '소제목'],
      icon: Heading3,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: '목록',
      description: '글머리 기호 목록',
      searchTerms: ['ul', 'list', '목록', '리스트'],
      icon: List,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: '번호 목록',
      description: '번호가 매겨진 목록',
      searchTerms: ['ol', 'ordered', '번호', '순서'],
      icon: ListOrdered,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: '인용',
      description: '인용구 작성',
      searchTerms: ['quote', 'blockquote', '인용'],
      icon: Quote,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: '코드 블록',
      description: '코드 스니펫 작성',
      searchTerms: ['code', 'codeblock', '코드'],
      icon: Code,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: '이미지',
      description: '이미지 업로드',
      searchTerms: ['image', 'photo', 'picture', '이미지', '사진'],
      icon: ImageIcon,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        // Trigger image upload externally
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

              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            } catch (error) {
              console.error('Error uploading image:', error);
              alert('이미지 업로드에 실패했습니다.');
            }
          }
        };
        input.click();
      },
    },
    {
      title: '링크',
      description: '링크 또는 이미지 삽입',
      searchTerms: ['link', 'url', 'href', '링크', '주소'],
      icon: Link2,
      command: ({ editor, range }) => {
        const url = window.prompt('URL을 입력하세요:');

        if (url) {
          const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

          editor.chain().focus().deleteRange(range).run();

          if (isImage) {
            editor.chain().focus().setImage({ src: url }).run();
          } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }
        }
      },
    },
  ];

  if (query && query.length > 0) {
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        (item.searchTerms && item.searchTerms.some((t) => t.includes(lower)))
    );
  }
  return items;
};

export const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: TippyInstance[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect?: (() => DOMRect | null) | null }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      popup = tippy('body', {
        getReferenceClientRect: () => props.clientRect?.() || new DOMRect(0, 0, 0, 0),
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: { clientRect?: (() => DOMRect | null) | null }) => {
      component?.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      popup?.[0].setProps({
        getReferenceClientRect: () => props.clientRect?.() || new DOMRect(0, 0, 0, 0),
      });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide();
        return true;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (component?.ref as any)?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};
