import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export default function BlogEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your blog...' }),
    ],
    content: '<h2>Hello ESN 👋</h2><p>This is a sample blog editor using TipTap.</p>',
  });

  return (
    <div className="mt-10 p-6 max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>Right</button>
        <button
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          Insert Image
        </button>
      </div>
      <EditorContent editor={editor} className="border p-4 min-h-[300px] rounded bg-white shadow" />
    </div>
  );
}
