import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Table as TableIcon,
  Palette,
  Highlighter,
  Undo,
  Redo,
  Type,
  Plus,
  Minus,
  Columns3,
  Rows3,
  Trash2,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Minus as DividerIcon,
  Layout,
  Columns,
  Grid3X3,
  Move,
  MousePointer2,
  Settings
} from 'lucide-react';

interface AdvancedRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Calibri', label: 'Calibri' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' }
];

const FONT_SIZES = [
  '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '56px', '64px', '72px'
];

const COLORS = [
  '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F3F7', '#FFFFFF',
  '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
  '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE',
  '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
  '#DC2626', '#EA580C', '#CA8A04', '#16A34A', '#0284C7', '#2563EB', '#7C3AED', '#C026D3'
];

export function AdvancedRichTextEditor({ content, onChange, placeholder }: AdvancedRichTextEditorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'advanced-editor prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
  });

  const insertImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  }, [editor, imageUrl]);

  const insertTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const insertTemplate = useCallback((templateType: string) => {
    if (!editor) return;

    const templates = {
      productHeader: `
        <div style="text-align: center; margin: 32px 0;">
          <h1 style="color: #DC2626; font-size: 48px; font-weight: bold; margin-bottom: 16px;">Fire Equipment Model</h1>
          <p style="font-size: 20px; color: #6B7280;">Professional Grade Fire Safety Equipment</p>
        </div>
      `,
      twoColumn: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 24px 0;">
          <div>
            <h3 style="color: #DC2626; margin-bottom: 16px;">Left Column Content</h3>
            <p>Add your content here...</p>
          </div>
          <div>
            <h3 style="color: #DC2626; margin-bottom: 16px;">Right Column Content</h3>
            <p>Add your content here...</p>
          </div>
        </div>
      `,
      featureGrid: `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin: 32px 0;">
          <div style="padding: 20px; border: 2px solid #FEE2E2; border-radius: 8px; background: #FEF2F2;">
            <h4 style="color: #DC2626; margin-bottom: 8px;">🔥 Fire Suppression</h4>
            <p style="color: #374151;">Advanced fire suppression technology</p>
          </div>
          <div style="padding: 20px; border: 2px solid #DBEAFE; border-radius: 8px; background: #EFF6FF;">
            <h4 style="color: #2563EB; margin-bottom: 8px;">⚡ High Performance</h4>
            <p style="color: #374151;">Superior performance and reliability</p>
          </div>
          <div style="padding: 20px; border: 2px solid #FEF3C7; border-radius: 8px; background: #FFFBEB;">
            <h4 style="color: #D97706; margin-bottom: 8px;">🛡️ Safety Certified</h4>
            <p style="color: #374151;">Meets all safety standards</p>
          </div>
          <div style="padding: 20px; border: 2px solid #D1FAE5; border-radius: 8px; background: #ECFDF5;">
            <h4 style="color: #059669; margin-bottom: 8px;">🔧 Easy Maintenance</h4>
            <p style="color: #374151;">Low maintenance requirements</p>
          </div>
        </div>
      `,
      specifications: `
        <h2 style="color: #DC2626; margin: 32px 0 16px 0;">Technical Specifications</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <thead>
            <tr style="background: #FEE2E2;">
              <th style="padding: 12px; border: 1px solid #FCA5A5; text-align: left; color: #DC2626;">Specification</th>
              <th style="padding: 12px; border: 1px solid #FCA5A5; text-align: left; color: #DC2626;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #FCA5A5;">Flow Rate</td>
              <td style="padding: 12px; border: 1px solid #FCA5A5;">500 GPM</td>
            </tr>
            <tr style="background: #FEF2F2;">
              <td style="padding: 12px; border: 1px solid #FCA5A5;">Pressure</td>
              <td style="padding: 12px; border: 1px solid #FCA5A5;">150 PSI</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #FCA5A5;">Weight</td>
              <td style="padding: 12px; border: 1px solid #FCA5A5;">2,500 lbs</td>
            </tr>
          </tbody>
        </table>
      `
    };

    editor.chain().focus().insertContent(templates[templateType as keyof typeof templates]).run();
  }, [editor]);

  if (!editor) {
    return <div className="p-8 text-center">Loading editor...</div>;
  }

  return (
    <div className="w-full max-w-none">
      {/* Advanced Toolbar */}
      <div className="border border-gray-200 rounded-t-lg bg-white">
        {/* Row 1: Basic Formatting */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-100">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          {/* Font Controls */}
          <Select
            value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
            onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
          >
            <SelectTrigger className="w-36">
              <Type className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <select
            value="16px"
            onChange={(e) => {
              editor.chain().focus().run();
            }}
            className="px-3 py-1 text-sm border border-gray-200 rounded"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Separator orientation="vertical" className="h-8" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        {/* Row 2: Headings and Alignment */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-100">
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-8" />

          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('taskList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
        </div>

        {/* Row 3: Media and Tables */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImageInput(!showImageInput)}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={insertTable}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().insertContent('<hr>').run()}
          >
            <DividerIcon className="h-4 w-4 mr-2" />
            Divider
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Table Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Row
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Table
          </Button>

          <Separator orientation="vertical" className="h-8" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Row 4: Professional Templates */}
        <div className="flex flex-wrap items-center gap-2 p-3">
          <span className="text-sm font-medium text-gray-700 mr-2">Quick Templates:</span>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            onClick={() => insertTemplate('productHeader')}
          >
            <Layout className="h-4 w-4 mr-1" />
            Product Header
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            onClick={() => insertTemplate('twoColumn')}
          >
            <Columns className="h-4 w-4 mr-1" />
            Two Columns
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            onClick={() => insertTemplate('featureGrid')}
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Feature Grid
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            onClick={() => insertTemplate('specifications')}
          >
            <Settings className="h-4 w-4 mr-1" />
            Specifications
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button
            variant={isDragMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsDragMode(!isDragMode)}
          >
            <MousePointer2 className="h-4 w-4 mr-1" />
            Drag Mode
          </Button>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="p-4 border-t border-gray-100">
            <Label className="text-sm font-medium mb-2 block">Text Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Highlight Color Picker */}
        {showHighlightPicker && (
          <div className="p-4 border-t border-gray-100">
            <Label className="text-sm font-medium mb-2 block">Highlight Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setHighlight({ color }).run();
                    setShowHighlightPicker(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Image Input */}
        {showImageInput && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Label htmlFor="image-url" className="text-sm font-medium">
                Image URL:
              </Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={insertImage} size="sm">
                Insert
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Container - Full Width for True WYSIWYG */}
      <div 
        ref={editorRef}
        className={`border-x border-b border-gray-200 rounded-b-lg bg-white ${
          isDragMode ? 'drag-mode' : ''
        }`}
        style={{ width: '100%', maxWidth: '1200px' }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Inline CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .advanced-editor {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
          }
          
          .advanced-editor h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 1.5rem 0 1rem 0;
            color: #1f2937;
          }
          
          .advanced-editor h2 {
            font-size: 2rem;
            font-weight: 600;
            margin: 1.25rem 0 0.75rem 0;
            color: #374151;
          }
          
          .advanced-editor h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
            color: #4b5563;
          }
          
          .advanced-editor table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
          }
          
          .advanced-editor table td,
          .advanced-editor table th {
            border: 1px solid #d1d5db;
            padding: 0.75rem;
          }
          
          .advanced-editor table th {
            background-color: #f9fafb;
            font-weight: 600;
          }

          .editor-image {
            max-width: 100%;
            height: auto;
            cursor: move;
            border: 2px solid transparent;
          }

          .editor-image:hover {
            border: 2px dashed #3B82F6;
          }

          .editor-table {
            cursor: move;
            border: 2px solid transparent;
          }

          .editor-table:hover {
            border: 2px dashed #3B82F6;
          }

          .drag-mode .editor-image {
            border: 2px dashed #3B82F6;
          }

          .drag-mode .editor-table {
            border: 2px dashed #3B82F6;
          }
        `
      }} />
    </div>
  );
}