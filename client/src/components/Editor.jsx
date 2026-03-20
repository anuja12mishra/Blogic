/**
 * Tiptap Rich Text Editor with full blog-writing features
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { common, createLowlight } from 'lowlight';
import { useEffect, useRef, useCallback } from 'react';
import { getEnv } from '@/helpers/getEnv';
import {
    FaBold, FaItalic, FaUnderline, FaStrikethrough,
    FaListUl, FaListOl, FaQuoteLeft, FaCode, FaImage,
    FaLink, FaUnlink, FaTable, FaUndo, FaRedo,
    FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
    FaHighlighter, FaMinus
} from 'react-icons/fa';

const lowlight = createLowlight(common);

// ─── Toolbar Button ─────────────────────────────────────────────
function ToolbarButton({ onClick, isActive = false, disabled = false, title, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                p-2 rounded-lg text-sm transition-all duration-150 cursor-pointer
                ${isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
            `}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-6 bg-border/60 mx-1" />;
}

// ─── Toolbar ────────────────────────────────────────────────────
function Toolbar({ editor }) {
    if (!editor) return null;

    const addImage = useCallback(() => {
        // Try file upload first
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append('image', file);

                const res = await fetch(`${getEnv('VITE_API_URL')}/api/blog/upload-content-image`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                const data = await res.json();
                if (res.ok && data.url) {
                    editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
                } else {
                    // Fallback: ask for URL
                    promptImageUrl();
                }
            } catch {
                promptImageUrl();
            }
        };
        input.click();
    }, [editor]);

    const promptImageUrl = useCallback(() => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addTable = useCallback(() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);

    return (
        <div className="tiptap-toolbar flex flex-wrap items-center gap-0.5 p-2 border-b border-border/50 bg-secondary/30 rounded-t-3xl sticky top-0 z-10">
            {/* Heading Dropdown */}
            <select
                className="h-8 px-2 rounded-lg bg-secondary/50 border border-border/40 text-sm text-foreground/80 cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                value={
                    editor.isActive('heading', { level: 1 }) ? 'h1' :
                    editor.isActive('heading', { level: 2 }) ? 'h2' :
                    editor.isActive('heading', { level: 3 }) ? 'h3' :
                    editor.isActive('heading', { level: 4 }) ? 'h4' :
                    'paragraph'
                }
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'paragraph') {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        const level = parseInt(val.replace('h', ''));
                        editor.chain().focus().toggleHeading({ level }).run();
                    }
                }}
            >
                <option value="paragraph">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
            </select>

            <ToolbarDivider />

            {/* Text Formatting */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                <FaBold size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                <FaItalic size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                <FaUnderline size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
                <FaStrikethrough size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
                <FaHighlighter size={13} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text Alignment */}
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
                <FaAlignLeft size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
                <FaAlignCenter size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
                <FaAlignRight size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
                <FaAlignJustify size={13} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                <FaListUl size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                <FaListOl size={13} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Block Elements */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
                <FaQuoteLeft size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
                <FaCode size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                <FaMinus size={13} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Insert */}
            <ToolbarButton onClick={addImage} title="Insert Image">
                <FaImage size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Insert Link">
                <FaLink size={13} />
            </ToolbarButton>
            {editor.isActive('link') && (
                <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
                    <FaUnlink size={13} />
                </ToolbarButton>
            )}
            <ToolbarButton onClick={addTable} title="Insert Table">
                <FaTable size={13} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Undo/Redo */}
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                <FaUndo size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                <FaRedo size={13} />
            </ToolbarButton>
        </div>
    );
}

// ─── Editor Component ───────────────────────────────────────────
export default function Editor({
    props,
    onChange,
    generatedContent = '',
    shouldUpdateContent = false,
    onContentUpdated
}) {
    const initialContentSet = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We use lowlight version
                heading: { levels: [1, 2, 3, 4] },
            }),
            Underline,
            Image.configure({
                inline: false,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'tiptap-image',
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    class: 'tiptap-link',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Start writing your blog post...',
            }),
            Highlight.configure({ multicolor: false }),
            CodeBlockLowlight.configure({ lowlight }),
            TextStyle,
            Color,
        ],
        content: props?.initialData || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor-content prose prose-lg max-w-none dark:prose-invert focus:outline-none min-h-[400px] p-6',
            },
            // Handle image paste/drop via R2 upload
            handleDrop: (view, event, slice, moved) => {
                if (moved || !event.dataTransfer?.files?.length) return false;

                const file = event.dataTransfer.files[0];
                if (!file?.type.startsWith('image/')) return false;

                event.preventDefault();
                uploadImage(file, view, event);
                return true;
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (const item of items) {
                    if (item.type.startsWith('image/')) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) uploadImage(file, view, event);
                        return true;
                    }
                }
                return false;
            },
        },
    });

    // Upload image to R2 and insert into editor
    const uploadImage = async (file, view, event) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(`${getEnv('VITE_API_URL')}/api/blog/upload-content-image`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.url) {
                editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
            }
        } catch (error) {
            console.error('Image upload failed:', error);
        }
    };

    // Handle AI generated content updates
    useEffect(() => {
        if (shouldUpdateContent && generatedContent && editor) {
            const currentContent = editor.getHTML();
            if (currentContent !== generatedContent) {
                editor.commands.setContent(generatedContent);
                onContentUpdated?.();
            }
        }
    }, [generatedContent, shouldUpdateContent, editor, onContentUpdated]);

    // Set initial content when it changes (e.g., in EditBlog)
    useEffect(() => {
        if (editor && props?.initialData && !initialContentSet.current) {
            const currentContent = editor.getHTML();
            // Only set if the editor is empty or has default content
            if (currentContent === '<p></p>' || currentContent === '') {
                editor.commands.setContent(props.initialData);
                initialContentSet.current = true;
            }
        }
    }, [editor, props?.initialData]);

    return (
        <div className="tiptap-wrapper">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}