import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, ArrowLeft } from 'lucide-react';
// @ts-ignore
import grapesjs from 'grapesjs';
// @ts-ignore
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import gjsPresetWebpage from 'grapesjs-preset-webpage';


interface PageBuilderProps {
  pageSlug?: string;
  pageTitle?: string;
  initialData?: any;
  onBack?: () => void;
  onSave?: (data: any, html: string, css: string) => Promise<void>;
  className?: string;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ 
  pageSlug = 'new-page', 
  pageTitle = 'New Page',
  initialData,
  onBack,
  onSave,
  className = '' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [title, setTitle] = useState(pageTitle);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize GrapesJS editor with mobile-first responsive configuration
    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: false,
      height: '100%',
      width: '100%',
      plugins: [gjsPresetWebpage],
      // Mobile-first media query configuration
      mediaCondition: 'min-width',
      deviceManager: {
        devices: [
          { 
            name: 'Mobile', 
            width: '320px', 
            widthMedia: '' // Default/mobile - no media query
          },
          { 
            name: 'Tablet', 
            width: '768px', 
            widthMedia: '768px' // min-width: 768px
          },
          { 
            name: 'Desktop', 
            width: '1024px', 
            widthMedia: '1024px' // min-width: 1024px
          }
        ],
      },
      panels: {
        defaults: [
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              { 
                id: 'device-mobile', 
                label: '📱', 
                command: 'set-device-mobile',
                attributes: { title: 'Mobile View' }
              },
              { 
                id: 'device-tablet', 
                label: '📱', 
                command: 'set-device-tablet',
                attributes: { title: 'Tablet View' }
              },
              { 
                id: 'device-desktop', 
                label: '💻', 
                command: 'set-device-desktop',
                active: true,
                attributes: { title: 'Desktop View' }
              },
            ],
          },
        ],
      },
      commands: {
        defaults: {
          'set-device-mobile': {
            run: (editor: any) => editor.setDevice('Mobile')
          },
          'set-device-tablet': {
            run: (editor: any) => editor.setDevice('Tablet')
          },
          'set-device-desktop': {
            run: (editor: any) => editor.setDevice('Desktop')
          },
        }
      },
      pluginsOpts: {
        'gjs-preset-webpage': {
          blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video', 'map'],
          modalImportTitle: 'Import Template',
          modalImportButton: 'Import',
          modalImportLabel: '',
          modalImportContent: 'Paste here your HTML/CSS and click Import',
          importPlaceholder: '<table class="table"><tr><td class="cell">Cell</td></tr></table>',
          cellStyle: {
            'min-height': '75px',
            flex: '1 1 auto',
            padding: '5px',
          }
        }
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
            category: 'Basic',
          },
          {
            id: 'image',
            label: 'Image',
            content: { type: 'image' },
            category: 'Basic',
          },
          {
            id: 'table',
            label: 'Table',
            content: `
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Cell 1</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">Cell 2</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Cell 3</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">Cell 4</td>
                </tr>
              </table>
            `,
            category: 'Basic',
          },
          {
            id: 'two-columns',
            label: '2 Columns',
            content: `
              <div class="responsive-columns" style="display: flex; flex-wrap: wrap; gap: 20px;">
                <div style="flex: 1; min-width: 280px; padding: 20px; border: 1px dashed #ccc;">
                  <div data-gjs-type="text">Column 1 content</div>
                </div>
                <div style="flex: 1; min-width: 280px; padding: 20px; border: 1px dashed #ccc;">
                  <div data-gjs-type="text">Column 2 content</div>
                </div>
              </div>
            `,
            category: 'Layout',
          },
          {
            id: 'three-columns',
            label: '3 Columns',
            content: `
              <div class="responsive-columns" style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 220px; padding: 15px; border: 1px dashed #ccc;">
                  <div data-gjs-type="text">Column 1</div>
                </div>
                <div style="flex: 1; min-width: 220px; padding: 15px; border: 1px dashed #ccc;">
                  <div data-gjs-type="text">Column 2</div>
                </div>
                <div style="flex: 1; min-width: 220px; padding: 15px; border: 1px dashed #ccc;">
                  <div data-gjs-type="text">Column 3</div>
                </div>
              </div>
            `,
            category: 'Layout',
          },
          {
            id: 'hero-section',
            label: 'Hero Section',
            content: `
              <section style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 80px 20px; text-align: center;">
                <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 20px;">Hero Title</h1>
                <p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9;">Your compelling subtitle goes here</p>
                <button style="background: white; color: #dc2626; padding: 15px 30px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Call to Action</button>
              </section>
            `,
            category: 'Sections',
          },
          {
            id: 'feature-grid',
            label: 'Features Grid',
            content: `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; padding: 40px 20px;">
                <div style="text-align: center; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="width: 60px; height: 60px; background: #dc2626; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">1</div>
                  <h3 style="font-size: 1.5rem; margin-bottom: 15px;">Feature One</h3>
                  <p style="color: #666;">Description of your first feature goes here.</p>
                </div>
                <div style="text-align: center; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="width: 60px; height: 60px; background: #dc2626; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">2</div>
                  <h3 style="font-size: 1.5rem; margin-bottom: 15px;">Feature Two</h3>
                  <p style="color: #666;">Description of your second feature goes here.</p>
                </div>
                <div style="text-align: center; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="width: 60px; height: 60px; background: #dc2626; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">3</div>
                  <h3 style="font-size: 1.5rem; margin-bottom: 15px;">Feature Three</h3>
                  <p style="color: #666;">Description of your third feature goes here.</p>
                </div>
              </div>
            `,
            category: 'Sections',
          }
        ]
      },
      // Configure asset manager for image upload
      assetManager: {
        upload: '/api/upload/image',
        uploadName: 'files',
        autoAdd: true,
        addBtnText: 'Add Image'
      },
      // Configure storage manager for saving/loading page designs
      storageManager: initialData ? {
        type: 'simple',
        autosave: false,
      } : {
        type: 'remote',
        autosave: false,
        autoload: false, // We'll load manually if no initialData
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ]
      },
      styleManager: {
        sectors: [
          {
            name: 'General',
            properties: [
              'display',
              'position',
              'top',
              'right',
              'left',
              'bottom',
            ]
          },
          {
            name: 'Layout',
            properties: [
              'width',
              'height',
              'max-width',
              'min-height',
              'margin',
              'padding'
            ]
          },
          {
            name: 'Typography',
            properties: [
              'font-family',
              'font-size',
              'font-weight',
              'letter-spacing',
              'color',
              'line-height',
              'text-align',
              'text-decoration',
              'text-shadow'
            ]
          },
          {
            name: 'Background',
            properties: [
              'background-color',
              'background-image',
              'background-repeat',
              'background-position',
              'background-size'
            ]
          },
          {
            name: 'Border',
            properties: [
              'border',
              'border-radius',
              'box-shadow'
            ]
          }
        ]
      }
    });

    // Add custom CSS for professional styling
    editor.addComponents(`
      <style>
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
        }
        .fire-red { color: #dc2626; }
        .fire-red-bg { background-color: #dc2626; }
        .emergency-blue { color: #1e40af; }
        .emergency-blue-bg { background-color: #1e40af; }
        .warning-amber { color: #d97706; }
        .warning-amber-bg { background-color: #d97706; }
      </style>
    `);

    // Store editor reference
    editorInstanceRef.current = editor;

    // Set initial device to Mobile for mobile-first design
    editor.setDevice('Mobile');

    // Load initial data if provided
    if (initialData) {
      editor.loadProjectData(initialData);
    }

    // Add preview toggle
    editor.Commands.add('toggle-preview', {
      run: () => setIsPreview(true),
      stop: () => setIsPreview(false),
    });

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
      }
    };
  }, [pageSlug, title, initialData]);

  const handleSave = async () => {
    if (!editorInstanceRef.current) return;
    
    setIsSaving(true);
    try {
      const projectData = editorInstanceRef.current.getProjectData();
      const html = editorInstanceRef.current.getHtml();
      const css = editorInstanceRef.current.getCss();

      if (onSave) {
        // Use custom save function for sub-products
        await onSave(projectData, html, css);
      } else {
        // Default save to pages API
        await fetch(`/api/pages/${pageSlug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            slug: pageSlug,
            title: title,
            data: projectData,
            htmlContent: html,
            cssContent: css,
          }),
        });
      }

      toast({
        title: "Success",
        description: "Page saved successfully!",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!editorInstanceRef.current) return;
    
    const html = editorInstanceRef.current.getHtml();
    const css = editorInstanceRef.current.getCss();
    
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Base responsive styles */
              * { box-sizing: border-box; }
              body { margin: 0; font-family: 'Inter', sans-serif; line-height: 1.6; }
              img, video, iframe { max-width: 100%; height: auto; }
              .responsive-columns { display: flex; flex-wrap: wrap; gap: 20px; }
              @media (max-width: 768px) {
                .responsive-columns { flex-direction: column; }
              }
              ${css}
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  return (
    <div className={`h-screen flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-64"
              placeholder="Enter page title"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Device Switcher Panel */}
          <div className="panel__devices flex items-center gap-1 mr-4 p-1 bg-gray-100 rounded"></div>
          
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        {/* Blocks Panel */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto">
          <Card className="m-4">
            <CardHeader>
              <CardTitle className="text-sm">Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="blocks-container"></div>
            </CardContent>
          </Card>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1">
          <div ref={editorRef} className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;