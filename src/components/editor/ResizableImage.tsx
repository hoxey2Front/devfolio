
import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { src: string, alt?: string, title?: string, width?: string }) => ReturnType,
    }
  }
}

/**
 * Resizable Image Component for NodeView
 */
const ResizableImageComponent = ({ node, updateAttributes, selected, editor, deleteNode }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);
  const [width, setWidth] = useState(node.attrs.width || '100%');

  useEffect(() => {
    setWidth(node.attrs.width || '100%');
  }, [node.attrs.width]);

  const onMouseDown = (event: React.MouseEvent) => {
    if (!editor.isEditable) return;
    event.preventDefault();
    setResizing(true);

    const startX = event.clientX;
    const startWidth = containerRef.current?.offsetWidth || 0;
    const parentWidth = containerRef.current?.parentElement?.offsetWidth || 1;
    let finalWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentWidth = startWidth + (moveEvent.clientX - startX);
      const widthInPercent = Math.min(100, Math.max(10, (currentWidth / parentWidth) * 100));

      finalWidth = `${Math.round(widthInPercent)}%`;
      setWidth(finalWidth);
    };

    const onMouseUp = () => {
      setResizing(false);
      updateAttributes({ width: finalWidth });
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <NodeViewWrapper
      className={`inline-block relative leading-none group transition-all duration-200 rounded-md ${editor.isEditable
        ? selected ? 'ring-[3px] ring-primary ring-offset-2 rounded-sm shadow-lg' : 'hover:ring-2 hover:ring-primary/50'
        : ''
        }`}
      style={{ width, maxWidth: '100%' }}
      ref={containerRef}
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        className={`w-full h-auto rounded-md block transition-opacity ${resizing ? 'opacity-40' : 'opacity-100'}`}
        draggable={editor.isEditable}
      />

      {/* Resize Handle - Bottom Right */}
      {editor.isEditable && (
        <div
          className={`absolute -bottom-3 -right-3 w-7 h-7 bg-background rounded-full cursor-nwse-resize shadow-2xl border-2 border-foreground z-30 transition-all transform hover:opacity-80 flex items-center justify-center ${selected || resizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          onMouseDown={onMouseDown}
        >
          <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
        </div>
      )}

      {/* Delete Button - Top Right */}
      {editor.isEditable && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteNode();
          }}
          className={`absolute -top-3 -right-3 w-7 h-7 bg-background text-foreground rounded-full shadow-2xl border-2 border-foreground z-30 transition-all transform flex items-center justify-center hover:opacity-80 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          title="이미지 삭제"
        >
          <X className="size-3.5" />
        </button>
      )}

      {/* Visual Overlay during resizing */}
      {editor.isEditable && resizing && (
        <>
          <div className="absolute inset-0 bg-primary/20 rounded-md pointer-events-none border-2 border-primary border-dashed animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-xs font-bold shadow-2xl z-40 backdrop-blur-sm">
            {width}
          </div>
        </>
      )}

      {/* Selected Indicator border overlay */}
      {editor.isEditable && selected && !resizing && (
        <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-md" />
      )}
    </NodeViewWrapper>
  );
};

export const ResizableImage = Node.create({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: (element) => {
          const widthAttr = element.getAttribute('width');
          const styleWidth = element.style.width;
          return widthAttr || styleWidth || '100%';
        },
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}; max-width: 100%`,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands(): any {
    return {
      setImage:
        (options: any) =>
          ({ commands }: any) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\s*(!\[(.+|)\]\((.+)\))\s*$/,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;
          return { src, alt, title };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
