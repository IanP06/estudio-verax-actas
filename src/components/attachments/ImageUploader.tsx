import React, { useRef, useState, useEffect } from 'react';
import { Upload, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, FileCheck, Sliders, Clipboard, ClipboardCheck } from 'lucide-react';
import type { ImageAttachment } from '../../types/acta';
import { ImageEditorModal } from './ImageEditorModal';

interface ImageUploaderProps {
  title?: string;
  subtitle?: string;
  attachments: ImageAttachment[];
  onAttachmentsChange: (attachments: ImageAttachment[]) => void;
  maxFiles?: number;
  icon?: React.ReactNode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  title = 'Anexos Documentales',
  subtitle,
  attachments,
  onAttachmentsChange,
  maxFiles,
  icon = <ImageIcon className="w-4 h-4 text-verax-red" />,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<ImageAttachment | null>(null);
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  const processFiles = (files: FileList | File[]) => {
    setIsProcessing(true);
    let validFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

    if (maxFiles && attachments.length + validFiles.length > maxFiles) {
      const allowedCount = Math.max(0, maxFiles - attachments.length);
      validFiles = validFiles.slice(0, allowedCount);
    }

    if (validFiles.length === 0) {
      setIsProcessing(false);
      return;
    }

    const newAttachmentsPromises = validFiles.map((file, idx) => {
      return new Promise<ImageAttachment>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const fileName = file.name || `captura_portapapeles_${Date.now()}_${idx + 1}.png`;
          resolve({
            id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: fileName,
            size: file.size,
            type: file.type || 'image/png',
            dataUrl: dataUrl,
            previewUrl: dataUrl,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newAttachmentsPromises).then(newItems => {
      onAttachmentsChange([...attachments, ...newItems]);
      setIsProcessing(false);

      if (newItems.length > 0) {
        setEditingAttachment(newItems[0]);
      }
    });
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Si el elemento activo está en otro input/textarea, permitimos pegar solo si no es texto plano
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            const pastedFile = new File(
              [blob],
              `captura_portapapeles_${Date.now()}.png`,
              { type: blob.type || 'image/png' }
            );
            imageFiles.push(pastedFile);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processFiles(imageFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [attachments, maxFiles]);

  const handlePasteFromClipboardButton = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setPasteFeedback(null);

    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        const imageFiles: File[] = [];

        for (const item of clipboardItems) {
          const imageType = item.types.find(type => type.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File(
              [blob], 
              `captura_portapapeles_${Date.now()}.png`, 
              { type: imageType }
            );
            imageFiles.push(file);
          }
        }

        if (imageFiles.length > 0) {
          processFiles(imageFiles);
          return;
        } else {
          setPasteFeedback('No se encontró ninguna imagen en el portapapeles. Copia una imagen o usa Ctrl + V.');
          setTimeout(() => setPasteFeedback(null), 4000);
          return;
        }
      }
    } catch (err) {
      console.warn('Lectura directa del portapapeles no permitida o restringida:', err);
    }

    setPasteFeedback('Presiona Ctrl + V en tu teclado para pegar la imagen copiada.');
    setTimeout(() => setPasteFeedback(null), 4000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeItem = (id: string) => {
    onAttachmentsChange(attachments.filter(item => item.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= attachments.length) return;

    const updated = [...attachments];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onAttachmentsChange(updated);
  };

  const handleSaveEditedAttachment = (updated: ImageAttachment) => {
    onAttachmentsChange(
      attachments.map(item => (item.id === updated.id ? updated : item))
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isMaxReached = maxFiles ? attachments.length >= maxFiles : false;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
            {icon}
            {title}
            {attachments.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-100 text-verax-blue rounded-full border border-slate-200">
                {attachments.length} {maxFiles ? `/ ${maxFiles}` : ''}
              </span>
            )}
          </label>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isMaxReached && (
            <button
              type="button"
              onClick={handlePasteFromClipboardButton}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-verax-blue hover:bg-slate-800 rounded-lg shadow-sm transition"
              title="Pegar imagen copiada en el portapapeles"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-verax-red" />
              Pegar Imagen
            </button>
          )}

          {attachments.length > 0 && (
            <button
              type="button"
              onClick={() => onAttachmentsChange([])}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium transition"
            >
              Quitar todo
            </button>
          )}
        </div>
      </div>

      {pasteFeedback && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <Clipboard className="w-4 h-4 text-amber-600 flex-shrink-0" />
          {pasteFeedback}
        </div>
      )}

      {/* Zona Drag & Drop */}
      {!isMaxReached && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-verax-red bg-rose-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-verax-blue bg-slate-50/50 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={!maxFiles || maxFiles > 1}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-verax-blue flex items-center justify-center border border-slate-200">
              <Upload className="w-4 h-4 text-verax-blue" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">
                {isProcessing ? 'Procesando imagen...' : 'Arrastra imágenes aquí o haz clic para examinar'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                O presiona <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-800 font-mono text-[10px] rounded border border-slate-300 font-bold">Ctrl + V</kbd> para pegar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Imágenes Adjuntas Limpia Sin Botones de Toggle */}
      {attachments.length > 0 && (
        <div className="space-y-2.5 mt-2">
          {attachments.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-verax-blue text-white text-[9px] font-bold px-1 rounded-tl">
                    #{index + 1}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-verax-blue" />
                      {formatFileSize(item.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingAttachment(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-verax-red hover:underline"
                      title="Editar brillo, contraste, rotación y encuadre"
                    >
                      <Sliders className="w-3 h-3" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1 rounded text-slate-400 hover:text-verax-blue hover:bg-slate-100 disabled:opacity-30"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === attachments.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1 rounded text-slate-400 hover:text-verax-blue hover:bg-slate-100 disabled:opacity-30"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingAttachment && (
        <ImageEditorModal
          attachment={editingAttachment}
          onSave={handleSaveEditedAttachment}
          onClose={() => setEditingAttachment(null)}
        />
      )}
    </div>
  );
};
