import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
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
import GapCursor from '@tiptap/extension-gapcursor';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
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
  Quote, 
  Code, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon,
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
  Merge,
  SplitSquareHorizontal,
  Trash2,
  Settings,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  CheckSquare,
  Square,
  Minus as DividerIcon,
  Layout,
  Columns,
  Grid3X3,
  Badge,
  Star,
  Award,
  Shield,
  Zap,
  Wrench,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useState, useCallback } from 'react';

interface RichTextEditorProps {
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
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' }
];

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'
];

const COLORS = [
  '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F3F7', '#FFFFFF',
  '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
  '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE',
  '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
  '#E76363', '#FF9C63', '#FFCE63', '#9CCA5A', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5',
  '#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B',
  '#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842',
  '#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031'
];

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      GapCursor,
      ListItem,
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-4 border-t-2 border-gray-200',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-fire-red hover:underline',
        },
      }),
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        lastColumnResizable: false,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-semibold border border-gray-300 p-3',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-3 min-w-[100px] vertical-align-top',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
  });

  const insertTable = useCallback((rows: number, cols: number) => {
    if (editor) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  }, [editor, imageUrl]);

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const setFontFamily = useCallback((fontFamily: string) => {
    if (editor) {
      editor.chain().focus().setFontFamily(fontFamily).run();
    }
  }, [editor]);

  const setFontSize = useCallback((fontSize: string) => {
    if (editor) {
      // Apply font size by wrapping selection in span with style
      const { from, to } = editor.state.selection;
      if (from !== to) {
        editor.chain().focus().setMark('textStyle', { fontSize }).run();
      }
    }
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    }
  }, [editor]);

  const setHighlightColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setHighlight({ color }).run();
      setShowHighlightPicker(false);
    }
  }, [editor]);

  // Advanced layout insertion functions
  const insertSpecificationTable = useCallback(() => {
    if (editor) {
      const tableContent = `
<table class="w-full border-collapse border border-gray-300 my-6">
  <thead>
    <tr class="bg-fire-red text-white">
      <th class="border border-gray-300 p-3 text-left font-semibold">Specification</th>
      <th class="border border-gray-300 p-3 text-left font-semibold">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 p-3 font-medium">Dimensions</td>
      <td class="border border-gray-300 p-3">Enter dimensions</td>
    </tr>
    <tr class="bg-gray-50">
      <td class="border border-gray-300 p-3 font-medium">Weight</td>
      <td class="border border-gray-300 p-3">Enter weight</td>
    </tr>
    <tr>
      <td class="border border-gray-300 p-3 font-medium">Capacity</td>
      <td class="border border-gray-300 p-3">Enter capacity</td>
    </tr>
  </tbody>
</table>`;
      editor.chain().focus().insertContent(tableContent).run();
    }
  }, [editor]);

  const insertFeatureGrid = useCallback(() => {
    if (editor) {
      const gridContent = `
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
    <div class="flex items-center mb-4">
      <div class="w-12 h-12 bg-fire-red rounded-full flex items-center justify-center mr-4">
        <span class="text-white text-xl">🔥</span>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">Fire Resistance</h3>
    </div>
    <p class="text-gray-600">Advanced fire-resistant materials provide superior protection in extreme conditions.</p>
  </div>
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
    <div class="flex items-center mb-4">
      <div class="w-12 h-12 bg-emergency-blue rounded-full flex items-center justify-center mr-4">
        <span class="text-white text-xl">⚡</span>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">High Performance</h3>
    </div>
    <p class="text-gray-600">Engineered for maximum efficiency and reliability in emergency situations.</p>
  </div>
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
    <div class="flex items-center mb-4">
      <div class="w-12 h-12 bg-warning-amber rounded-full flex items-center justify-center mr-4">
        <span class="text-white text-xl">🛡️</span>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">Safety Certified</h3>
    </div>
    <p class="text-gray-600">Meets all international safety standards and certifications.</p>
  </div>
</div>`;
      editor.chain().focus().insertContent(gridContent).run();
    }
  }, [editor]);

  const insertProductHeader = useCallback(() => {
    if (editor) {
      const headerContent = `
<div class="bg-gradient-to-r from-fire-red to-emergency-blue text-white p-8 rounded-lg my-6">
  <div class="flex flex-col md:flex-row items-center gap-6">
    <div class="flex-1">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">Product Name</h1>
      <p class="text-lg opacity-90 mb-4">Professional fire safety equipment designed for maximum performance and reliability.</p>
      <div class="flex flex-wrap gap-2">
        <span class="bg-white/20 px-3 py-1 rounded-full text-sm">Certified</span>
        <span class="bg-white/20 px-3 py-1 rounded-full text-sm">Professional</span>
        <span class="bg-white/20 px-3 py-1 rounded-full text-sm">High Quality</span>
      </div>
    </div>
    <div class="flex-shrink-0">
      <img src="https://via.placeholder.com/300x200/dc2626/ffffff?text=Product+Image" alt="Product" class="rounded-lg shadow-lg" />
    </div>
  </div>
</div>`;
      editor.chain().focus().insertContent(headerContent).run();
    }
  }, [editor]);

  const insertCertificationBadges = useCallback(() => {
    if (editor) {
      const badgesContent = `
<div class="flex flex-wrap justify-center gap-4 my-8 p-6 bg-gray-50 rounded-lg">
  <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow">
    <div class="w-16 h-16 bg-fire-red rounded-full flex items-center justify-center mb-2">
      <span class="text-white text-2xl">🏆</span>
    </div>
    <span class="text-sm font-medium text-gray-700">ISO 9001</span>
  </div>
  <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow">
    <div class="w-16 h-16 bg-emergency-blue rounded-full flex items-center justify-center mb-2">
      <span class="text-white text-2xl">✓</span>
    </div>
    <span class="text-sm font-medium text-gray-700">CE Certified</span>
  </div>
  <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow">
    <div class="w-16 h-16 bg-warning-amber rounded-full flex items-center justify-center mb-2">
      <span class="text-white text-2xl">🛡️</span>
    </div>
    <span class="text-sm font-medium text-gray-700">Safety Tested</span>
  </div>
  <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow">
    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
      <span class="text-white text-2xl">🌿</span>
    </div>
    <span class="text-sm font-medium text-gray-700">Eco Friendly</span>
  </div>
</div>`;
      editor.chain().focus().insertContent(badgesContent).run();
    }
  }, [editor]);

  const insertTwoColumnLayout = useCallback(() => {
    if (editor) {
      const layoutContent = `
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
  <div class="space-y-4">
    <h3 class="text-xl font-semibold text-gray-800 border-l-4 border-fire-red pl-4">Key Features</h3>
    <ul class="space-y-2">
      <li class="flex items-start">
        <span class="text-fire-red mr-2">•</span>
        <span>Advanced fire suppression technology</span>
      </li>
      <li class="flex items-start">
        <span class="text-fire-red mr-2">•</span>
        <span>Lightweight and portable design</span>
      </li>
      <li class="flex items-start">
        <span class="text-fire-red mr-2">•</span>
        <span>Professional-grade construction</span>
      </li>
    </ul>
  </div>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold text-gray-800 border-l-4 border-emergency-blue pl-4">Applications</h3>
    <ul class="space-y-2">
      <li class="flex items-start">
        <span class="text-emergency-blue mr-2">•</span>
        <span>Industrial fire protection</span>
      </li>
      <li class="flex items-start">
        <span class="text-emergency-blue mr-2">•</span>
        <span>Emergency response vehicles</span>
      </li>
      <li class="flex items-start">
        <span class="text-emergency-blue mr-2">•</span>
        <span>Commercial safety systems</span>
      </li>
    </ul>
  </div>
</div>`;
      editor.chain().focus().insertContent(layoutContent).run();
    }
  }, [editor]);

  if (!editor) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>;
  }

  return (
    <div className="border-0 rounded-md overflow-hidden shadow-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          {/* Font Family */}
          <Select onValueChange={setFontFamily} defaultValue="">
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem 
                  key={font.value} 
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Size */}
          <Select onValueChange={setFontSize} defaultValue="">
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Text Formatting */}
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Text Color */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Type className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            {showColorPicker && (
              <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2 grid grid-cols-8 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative">
            <Button
              variant={editor.isActive('highlight') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            >
              <Highlighter className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2 grid grid-cols-8 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => setHighlightColor(color)}
                  />
                ))}
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Alignment */}
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Lists */}
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Quote & Code */}
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Second Row - Headings */}
        <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-gray-200">
          {/* Headings */}
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Task Lists */}
          <Button
            variant={editor.isActive('taskList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <CheckSquare className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Horizontal Rule */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <DividerIcon className="h-4 w-4 mr-1" />
            Divider
          </Button>
        </div>

        {/* Third Row - Advanced Layouts */}
        <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-gray-200">
          {/* Professional Layout Templates */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertProductHeader}
            className="text-fire-red hover:text-fire-red"
          >
            <Layout className="h-4 w-4 mr-1" />
            Product Header
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertFeatureGrid}
            className="text-emergency-blue hover:text-emergency-blue"
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Feature Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertSpecificationTable}
            className="text-warning-amber hover:text-warning-amber"
          >
            <TableIcon className="h-4 w-4 mr-1" />
            Specs Table
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertTwoColumnLayout}
            className="text-green-600 hover:text-green-600"
          >
            <Columns className="h-4 w-4 mr-1" />
            Two Columns
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertCertificationBadges}
            className="text-purple-600 hover:text-purple-600"
          >
            <Badge className="h-4 w-4 mr-1" />
            Certifications
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />
        </div>

        {/* Fourth Row - Table and Media Tools */}
        <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-gray-200">
          {/* Table Operations */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertTable(3, 3)}
            >
              <TableIcon className="h-4 w-4 mr-1" />
              Insert Table
            </Button>
            
            {editor.isActive('table') && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                  <Plus className="h-3 w-3" />
                  <Rows3 className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                  <Plus className="h-3 w-3" />
                  <Columns3 className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                >
                  <Minus className="h-3 w-3" />
                  <Rows3 className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                  <Minus className="h-3 w-3" />
                  <Columns3 className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().mergeCells().run()}
                >
                  <Merge className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().splitCell().run()}
                >
                  <SplitSquareHorizontal className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Link */}
          <div className="flex items-center gap-1">
            {!showLinkInput ? (
              <Button
                variant={editor.isActive('link') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowLinkInput(true)}
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Link
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Input
                  type="url"
                  placeholder="Enter URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-48 h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addLink();
                    if (e.key === 'Escape') setShowLinkInput(false);
                  }}
                />
                <Button size="sm" onClick={addLink}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowLinkInput(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            {editor.isActive('link') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                Remove Link
              </Button>
            )}
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Image */}
          <div className="flex items-center gap-1">
            {!showImageInput ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageInput(true)}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Image
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Input
                  type="url"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-48 h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addImage();
                    if (e.key === 'Escape') setShowImageInput(false);
                  }}
                />
                <Button size="sm" onClick={addImage}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowImageInput(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-b-md">
        <EditorContent 
          editor={editor}
          className="min-h-[400px] max-h-[800px] overflow-y-auto p-4 focus-within:ring-2 focus-within:ring-fire-red focus-within:border-fire-red"
          placeholder={placeholder || "Start writing your content..."}
        />
      </div>
    </div>
  );
}