import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface ZoomControlsProps {
  onZoomChange?: (zoomLevel: number) => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomChange }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const applyZoom = (newZoom: number) => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const zoomContent = mainContent.querySelector('.zoom-content') as HTMLElement;
      if (zoomContent) {
        // Reset to original state to get accurate measurements
        if (zoomLevel !== 1) {
          zoomContent.style.transform = 'scale(1)';
          // Force a reflow to get accurate measurements
          zoomContent.offsetHeight;
        }
        
        // Get current natural dimensions
        const naturalWidth = zoomContent.scrollWidth;
        const naturalHeight = zoomContent.scrollHeight;
        
        // Apply the zoom transform
        zoomContent.style.transform = `scale(${newZoom})`;
        zoomContent.style.transformOrigin = 'top left';
        
        // Calculate viewport dimensions
        const viewportWidth = mainContent.clientWidth;
        const viewportHeight = mainContent.clientHeight;
        
        // Calculate scaled dimensions
        const scaledWidth = naturalWidth * newZoom;
        const scaledHeight = naturalHeight * newZoom;
        
        // Adjust the container to accommodate scaled content
        // If content is smaller than viewport after zoom, don't add scrolling
        const effectiveWidth = Math.max(scaledWidth, viewportWidth);
        const effectiveHeight = Math.max(scaledHeight, viewportHeight);
        
        // Update container styles to manage scroll area
        if (scaledWidth > viewportWidth) {
          mainContent.style.overflowX = 'auto';
          zoomContent.style.width = `${naturalWidth}px`;
        } else {
          mainContent.style.overflowX = 'hidden';
          zoomContent.style.width = 'auto';
        }
        
        if (scaledHeight > viewportHeight) {
          mainContent.style.overflowY = 'auto';
          zoomContent.style.height = `${naturalHeight}px`;
        } else {
          mainContent.style.overflowY = 'hidden';
          zoomContent.style.height = 'auto';
        }
        
        // Trigger scroll area recalculation
        setTimeout(() => {
          mainContent.dispatchEvent(new Event('scroll'));
        }, 100);
      }
    }
    
    setZoomLevel(newZoom);
    onZoomChange?.(newZoom);
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.1, 2);
    applyZoom(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.1, 0.3);
    applyZoom(newZoom);
  };

  const resetZoom = () => {
    applyZoom(1);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          zoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          zoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          resetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel]);

  return (
    <div className="zoom-controls">
      <button
        className="zoom-button"
        onClick={zoomIn}
        title="Zoom In (Ctrl/Cmd + +)"
        disabled={zoomLevel >= 2}
      >
        <Plus size={18} />
      </button>
      
      <div className="zoom-level">
        {Math.round(zoomLevel * 100)}%
      </div>
      
      <button
        className="zoom-button"
        onClick={resetZoom}
        title="Reset Zoom (Ctrl/Cmd + 0)"
      >
        <RotateCcw size={16} />
      </button>
      
      <button
        className="zoom-button"
        onClick={zoomOut}
        title="Zoom Out (Ctrl/Cmd + -)"
        disabled={zoomLevel <= 0.3}
      >
        <Minus size={18} />
      </button>
    </div>
  );
};

export default ZoomControls;