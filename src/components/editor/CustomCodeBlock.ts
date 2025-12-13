import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { all, createLowlight } from 'lowlight';
import CodeBlockComponent from './CodeBlockComponent';

const lowlight = createLowlight(all);

export const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ReactNodeViewRenderer(CodeBlockComponent as any);
  },
}).configure({
  lowlight,
});
