import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFPage = React.memo(({
  pdfDoc,
  pageNum,
  scale,
  user,
  onVisibilityChange
}: {
  pdfDoc: any;
  pageNum: number;
  scale: number;
  user: any;
  onVisibilityChange: (page: number, isVisible: boolean) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [pageHeight, setPageHeight] = useState(842 * scale); // A4 estimate
  const renderedScale = useRef(0);
  const unscaledViewport = useRef<any>(null);

  // Get unscaled viewport to calculate sizes synchronously
  useEffect(() => {
    if (pdfDoc) {
      pdfDoc.getPage(pageNum).then((page: any) => {
        unscaledViewport.current = page.getViewport({ scale: 1 });
        setPageHeight(unscaledViewport.current.height * scale);
      });
    }
  }, [pdfDoc, pageNum]);

  // Adjust placeholder height immediately when scale changes
  useEffect(() => {
    if (unscaledViewport.current) {
      setPageHeight(unscaledViewport.current.height * scale);
    } else if (!isRendered) {
      setPageHeight(842 * scale);
    }
  }, [scale, isRendered]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const intersecting = entry.isIntersecting;
          setIsVisible(intersecting);
          onVisibilityChange(pageNum, intersecting);
        });
      },
      { root: null, rootMargin: '800px 0px', threshold: 0 } // Render slightly before scrolling into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [pageNum, onVisibilityChange]);

  useEffect(() => {
    let isActive = true;

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !isVisible) return;
      if (isRendered && renderedScale.current === scale) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!isActive) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height * pixelRatio;
        canvas.width = viewport.width * pixelRatio;
        canvas.style.height = `${viewport.height}px`;
        canvas.style.width = `${viewport.width}px`;
        setPageHeight(viewport.height); // Update to exact height

        const renderContext = {
          canvasContext: ctx,
          viewport,
          transform: [pixelRatio, 0, 0, pixelRatio, 0, 0]
        };

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        if (!isActive) return;

        // Draw Dynamic Watermark
        const d = new Date();
        const dateStr = d.toLocaleDateString();
        const timeStr = d.toLocaleTimeString();
        const watermarkText = `${user?.name || 'User'} | ${user?.email || 'email'} | ${dateStr} ${timeStr}`;

        ctx.save();
        ctx.scale(pixelRatio, pixelRatio);
        ctx.globalAlpha = 0.1;
        ctx.font = `${20 * scale}px Inter, sans-serif`;
        ctx.fillStyle = 'gray';

        const stepX = 300 * scale;
        const stepY = 200 * scale;

        ctx.rotate((-45 * Math.PI) / 180);
        for (let x = -viewport.width * 2; x < viewport.width * 2; x += stepX) {
          for (let y = -viewport.height * 2; y < viewport.height * 2; y += stepY) {
            ctx.fillText(watermarkText, x, y);
          }
        }
        ctx.restore();

        setIsRendered(true);
        renderedScale.current = scale;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Render error', err);
        }
      }
    };

    if (isVisible) {
      renderPage();
    } else {
      // Cleanup to save memory
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      setIsRendered(false);
      renderedScale.current = 0;
      // Free canvas memory
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    }

    return () => {
      isActive = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale, isVisible, user, isRendered]);

  return (
    <div
      id={`pdf-page-${pageNum}`}
      ref={containerRef}
      className="flex justify-center mb-6 w-full"
      style={{ minHeight: `${pageHeight}px` }}
    >
      <canvas
        ref={canvasRef}
        className={`shadow-2xl rounded-sm bg-white transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
});

const PDFViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  const [blurReason, setBlurReason] = useState('');

  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));
  const allViewedPages = useRef<Set<number>>(new Set());

  // Load PDF Blob securely
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/pdfs/stream/${id}`, { responseType: 'arraybuffer' });
        const data = new Uint8Array(res.data);

        // Decrypt XOR cipher
        const xorKey = new TextEncoder().encode('AYURDNYANAM_SECURE_KEY_2026');
        for (let i = 0; i < data.length; i++) {
          data[i] = data[i] ^ xorKey[i % xorKey.length];
        }

        const loadingTask = pdfjsLib.getDocument({ data });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
      } catch (err) {
        console.error('Error loading PDF:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [id]);

  // Handle visibility of pages to update toolbar
  const handleVisibilityChange = useCallback((page: number, isVisible: boolean) => {
    if (isVisible) {
      allViewedPages.current.add(page);
    }
    setVisiblePages(prev => {
      const newSet = new Set(prev);
      if (isVisible) newSet.add(page);
      else newSet.delete(page);
      return newSet;
    });
  }, []);

  useEffect(() => {
    if (visiblePages.size > 0) {
      const minVisible = Math.min(...Array.from(visiblePages));
      setPageNum(minVisible);
      localStorage.setItem(`pdf_page_${id}`, minVisible.toString());
    }
  }, [visiblePages, id]);

  // Initial scroll to saved page
  useEffect(() => {
    if (pdfDoc && numPages > 0) {
      const savedPage = localStorage.getItem(`pdf_page_${id}`);
      if (savedPage) {
        setTimeout(() => {
          scrollToPage(parseInt(savedPage, 10));
        }, 300); // Wait for initial render
      }
    }
  }, [pdfDoc, numPages, id]);

  const scrollToPage = (page: number) => {
    const el = document.getElementById(`pdf-page-${page}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Telemetry: Track when user leaves the PDF
  useEffect(() => {
    const sendTelemetry = () => {
      if (id && allViewedPages.current.size > 0) {
        api.post('/audit/track-pdf', {
          pdfId: id,
          pagesViewed: allViewedPages.current.size
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', sendTelemetry);

    return () => {
      window.removeEventListener('beforeunload', sendTelemetry);
      sendTelemetry();
    };
  }, [id]);

  // Security Measures
  useEffect(() => {
    const hideContent = (reason: string) => {
      const container = document.getElementById('pdf-pages-container');
      if (container) container.style.opacity = '0';
      setIsBlurred(true);
      setBlurReason(reason);
    };

    const showContent = () => {
      const container = document.getElementById('pdf-pages-container');
      if (container) container.style.opacity = '1';
      setIsBlurred(false);
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      hideContent('Context menu is disabled for security reasons.');
      setTimeout(showContent, 3000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow basic scroll/navigation keys without modifiers
      const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'];
      if (allowedKeys.includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
        return;
      }

      // Block F-keys (F1-F12)
      if (e.key.match(/^F\d+$/)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Detect screenshot combinations (Mac: Cmd+Shift+3/4/5, Windows Snipping tool: Win+Shift+S)
      if ((e.metaKey && e.shiftKey) || e.key === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
        hideContent('Screenshot attempt detected. Screenshots are prohibited.');
        // Clear clipboard just in case
        navigator.clipboard?.writeText('');
        return;
      }

      // Block any combination involving Ctrl, Alt, or Meta (Windows/Cmd key)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText(''); // Clear clipboard
        hideContent('Screenshot attempt detected. Screenshots are prohibited.');
      }
    };

    const handleVisibilityChangeDoc = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
         hideContent('Screen Recording and Screenshot are prohibited.');
      } else {
         showContent();
      }
    };

    const handleBlur = () => hideContent('Window lost focus. Screenshots and screen recording are prohibited.');
    const handleFocus = () => showContent();
    
    // Sometimes mobile OS will fire touchcancel when control center / screenshot tools are invoked
    const handleTouchCancel = () => hideContent('System interruption detected. Screenshots are prohibited.');

    const handleCopy = (e: ClipboardEvent) => {
      e.clipboardData?.setData('text/plain', 'Copying is disabled for security reasons.');
      e.preventDefault();
      hideContent('Copying is prohibited.');
      setTimeout(showContent, 3000);
    };

    const devToolsInterval = setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        hideContent('Developer tools detected. Session locked.');
      }
    }, 1000);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('visibilitychange', handleVisibilityChangeDoc);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('touchcancel', handleTouchCancel);

    const style = document.createElement('style');
    style.innerHTML = `@media print { body { display: none !important; } } * { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }`;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('visibilitychange', handleVisibilityChangeDoc);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('touchcancel', handleTouchCancel);
      document.head.removeChild(style);
      clearInterval(devToolsInterval);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f1f5f9] flex flex-col no-select overflow-hidden z-50" style={{ height: '100dvh' }}>
      {/* Top Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm z-10 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="text-sm font-semibold text-gray-800">Secure Viewer</div>
        <div className="w-16"></div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 overflow-auto relative flex flex-col items-center p-4" id="viewer-container">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div id="pdf-pages-container" className={`w-full transition-all duration-300 relative ${isBlurred ? 'blur-xl scale-95 pointer-events-none' : ''}`}>
          {!isBlurred && pdfDoc && Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
            <PDFPage
              key={page}
              pdfDoc={pdfDoc}
              pageNum={page}
              scale={scale}
              user={user}
              onVisibilityChange={handleVisibilityChange}
            />
          ))}
        </div>

        {/* Security Overlay - Complete Blackout */}
        {isBlurred && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black text-white select-none">
            <div className="flex flex-col items-center max-w-md text-center p-8">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
              <h3 className="text-3xl font-bold mb-4">Security Lockdown</h3>
              <p className="text-gray-300 text-lg mb-8 whitespace-pre-wrap">{blurReason}</p>
              <p className="text-gray-500 text-sm">Click anywhere on this window to resume viewing.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div
        className="bg-white border-t border-gray-200 flex items-center justify-between sm:justify-center gap-2 sm:gap-6 px-2 sm:px-4 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] z-10 shrink-0"
        style={{ minHeight: '4rem', paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))', paddingTop: '0.5rem' }}
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => scrollToPage(Math.max(1, pageNum - 1))}
            disabled={pageNum <= 1}
            className="p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 transition-colors touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap">
            {pageNum} / {numPages || '-'}
          </div>

          <button
            onClick={() => scrollToPage(Math.min(numPages, pageNum + 1))}
            disabled={pageNum >= numPages}
            className="p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 transition-colors touch-manipulation"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200 hidden sm:block mx-2"></div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            className="p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setScale(s => Math.min(3, s + 0.25))}
            className="p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block touch-manipulation"
          >
            <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
