import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  RotateCw, 
  ZoomIn, 
  Sliders, 
  Sun, 
  Contrast as ContrastIcon, 
  Check, 
  FileCheck2,
  Move
} from 'lucide-react';
import type { ImageAttachment } from '../../types/acta';

interface ImageEditorModalProps {
  attachment: ImageAttachment;
  onSave: (updatedAttachment: ImageAttachment) => void;
  onClose: () => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  attachment,
  onSave,
  onClose,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);

  // Drag State for Canvas Mouse/Touch Panning
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = attachment.dataUrl;
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
  }, [attachment.dataUrl]);

  useEffect(() => {
    if (imageRef.current) {
      renderCanvas();
    }
  }, [rotation, zoom, panX, panY, brightness, contrast, isGrayscale]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const origWidth = img.naturalWidth || img.width;
    const origHeight = img.naturalHeight || img.height;

    // Swap width/height if rotated 90 or 270 deg
    const isSwapped = rotation === 90 || rotation === 270;
    const canvasWidth = isSwapped ? origHeight : origWidth;
    const canvasHeight = isSwapped ? origWidth : origHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Save state
    ctx.save();

    // Filters
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (isGrayscale) {
      filterStr += ` grayscale(100%)`;
    }
    ctx.filter = filterStr;

    // Translate to center for rotation, zoom & drag panning
    ctx.translate(canvasWidth / 2 + panX, canvasHeight / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered
    ctx.drawImage(img, -origWidth / 2, -origHeight / 2, origWidth, origHeight);

    ctx.restore();
  };

  // Canvas Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDraggingCanvas(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panX,
      initialPanY: panY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvas) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.initialPanX + deltaX);
    setPanY(dragStartRef.current.initialPanY + deltaY);
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDraggingCanvas(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        initialPanX: panX,
        initialPanY: panY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvas || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.initialPanX + deltaX);
    setPanY(dragStartRef.current.initialPanY + deltaY);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setBrightness(100);
    setContrast(100);
    setIsGrayscale(false);
  };

  const handleDocumentOptimize = () => {
    // Presets for optimal DNI & paper readability
    setBrightness(115);
    setContrast(140);
    setIsGrayscale(true);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSave({
      ...attachment,
      dataUrl: editedDataUrl,
      previewUrl: editedDataUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]">
        {/* Header */}
        <div className="bg-verax-blue px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-verax-red" />
            <h3 className="text-base font-bold">
              Edición de Imagen: {attachment.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Canvas with Mouse Drag, Right Controls */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Canvas Preview (Soporta Arrastrar / Drag con el mouse) */}
          <div className="md:col-span-7 bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden border border-slate-800 select-none">
            {/* Overlay hint */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 z-10 pointer-events-none">
              <Move className="w-3.5 h-3.5 text-verax-red animate-pulse" />
              Arrastra con el mouse para posicionar la imagen
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className={`max-w-full max-h-[400px] object-contain rounded shadow-lg transition-transform ${
                isDraggingCanvas ? 'cursor-grabbing scale-[1.01]' : 'cursor-grab'
              }`}
            />
          </div>

          {/* Right Controls Panel */}
          <div className="md:col-span-5 space-y-5">
            {/* Quick Document Enhancer */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mejora Automática Documental
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDocumentOptimize}
                  className="px-3 py-2 text-xs font-bold text-verax-blue bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-verax-red" />
                  Optimizar DNI / Papel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition"
                >
                  Restablecer
                </button>
              </div>
            </div>

            {/* Rotación y Zoom */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-verax-red" />
                  Rotación ({rotation}°)
                </span>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="px-3 py-1 text-xs font-bold text-white bg-verax-blue hover:bg-verax-blue-dark rounded-lg flex items-center gap-1 transition"
                >
                  <RotateCw className="w-3 h-3" />
                  Girar 90°
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-slate-400" /> Zoom / Escala
                  </span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={e => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-verax-red cursor-pointer"
                />
              </div>

              {/* Sliders manuales de posición X / Y */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Posición X
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    value={panX}
                    onChange={e => setPanX(parseInt(e.target.value))}
                    className="w-full accent-verax-blue cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Posición Y
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    value={panY}
                    onChange={e => setPanY(parseInt(e.target.value))}
                    className="w-full accent-verax-blue cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Ajustes de Imagen (Brillo / Contraste / B&N) */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Brillo
                  </span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={brightness}
                  onChange={e => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-verax-red cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-1">
                    <ContrastIcon className="w-3.5 h-3.5 text-blue-600" /> Contraste
                  </span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="220"
                  value={contrast}
                  onChange={e => setContrast(parseInt(e.target.value))}
                  className="w-full accent-verax-blue cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-slate-700">Filtro Blanco y Negro</span>
                <input
                  type="checkbox"
                  checked={isGrayscale}
                  onChange={e => setIsGrayscale(e.target.checked)}
                  className="w-4 h-4 accent-verax-red rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold text-white bg-verax-red hover:bg-verax-red-dark rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <Check className="w-4 h-4" />
            Guardar Cambios de Imagen
          </button>
        </div>
      </div>
    </div>
  );
};
