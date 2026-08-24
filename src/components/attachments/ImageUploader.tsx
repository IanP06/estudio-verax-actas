import React, { useRef, useState, useEffect } from 'react';
import { Upload, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, FileCheck, Sliders, Clipboard, ClipboardCheck, IdCard, Map } from 'lucide-react';
import type { ImageAttachment } from '../../types/acta';
import { ImageEditorModal } from './ImageEditorModal';

interface ImageUploaderProps {
  attachments: ImageAttachment[];
  onAttachmentsChange: (attachments: ImageAttachment[]) => void;
  showCroquisOption?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  attachments,
  onAttachmentsChange,
  showCroquisOption = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<ImageAttachment | null>(null);
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  const processFiles = (files: FileList | File[]) => {
    setIsProcessing(true);
    const validFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

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
            isDni: attachments.length === 0 && idx === 0, // Auto-marcar primera foto como DNI si no hay nada
            isCroquis: false,
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
  }, [attachments]);

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

  // Mutuamente excluyentes: si se selecciona isDni, desmarcar isCroquis y viceversa
  const toggleDni = (id: string) => {
    onAttachmentsChange(
      attachments.map(item => {
        if (item.id === id) {
          const nextDniState = !item.isDni;
          return {
            ...item,
            isDni: nextDniState,
            isCroquis: nextDniState ? false : item.isCroquis,
          };
        }
        return item;
      })
    );
  };

  const toggleCroquis = (id: string) => {
    onAttachmentsChange(
      attachments.map(item => {
        if (item.id === id) {
          const nextCroquisState = !item.isCroquis;
          return {
            ...item,
            isCroquis: nextCroquisState,
            isDni: nextCroquisState ? false : item.isDni,
          };
        }
        return item;
      })
    );
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-verax-red" />
          Anexos Documentales (DNI, Croquis, Evidencias)
          {attachments.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-100 text-verax-blue rounded-full border border-slate-200">
              {attachments.length} archivo{attachments.length > 1 ? 's' : ''}
            </span>
          )}
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePasteFromClipboardButton}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-verax-blue hover:bg-slate-800 rounded-lg shadow-sm transition"
            title="Pegar imagen copiada en el portapapeles"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-verax-red" />
            Pegar Imagen Copiada
          </button>

          {attachments.length > 0 && (
            <button
              type="button"
              onClick={() => onAttachmentsChange([])}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium transition"
            >
              Quitar todos
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
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-verax-red bg-rose-50/50 scale-[0.99]'
            : 'border-slate-300 hover:border-verax-blue bg-slate-50/50 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-verax-blue flex items-center justify-center border border-slate-200">
            <Upload className="w-5 h-5 text-verax-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {isProcessing ? 'Procesando imagen...' : 'Arrastra imágenes de DNI/Croquis o haz clic'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              O usa el botón <span className="font-semibold text-verax-blue">"Pegar Imagen Copiada"</span> o presiona <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-800 font-mono text-[10px] rounded border border-slate-300 font-bold">Ctrl + V</kbd>
            </p>
          </div>

          <button
            type="button"
            onClick={handlePasteFromClipboardButton}
            className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-verax-blue text-xs font-bold rounded-lg border border-slate-300 shadow-sm transition"
          >
            <Clipboard className="w-3.5 h-3.5 text-verax-red" />
            Pegar desde Portapapeles
          </button>
        </div>
      </div>

      {/* Lista de Imágenes Adjuntas con Toggles Mutuamente Excluyentes */}
      {attachments.length > 0 && (
        <div className="space-y-3 mt-3">
          {attachments.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-verax-blue text-white text-[10px] font-bold px-1 rounded-tl">
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

              {/* Toggles Mutuamente Excluyentes: Foto DNI vs Croquis */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center gap-2">
                  {/* Toggle DNI */}
                  <button
                    type="button"
                    onClick={() => toggleDni(item.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                      item.isDni
                        ? 'bg-blue-50 text-verax-blue border-verax-blue ring-1 ring-verax-blue/30'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Muestra esta foto junto a la firma al pie del acta"
                  >
                    <IdCard className="w-3.5 h-3.5" />
                    {item.isDni ? 'Foto DNI ✓' : 'Es DNI'}
                  </button>

                  {/* Toggle Croquis */}
                  {showCroquisOption && (
                    <button
                      type="button"
                      onClick={() => toggleCroquis(item.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        item.isCroquis
                          ? 'bg-rose-50 text-verax-red border-verax-red ring-1 ring-verax-red/30'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Muestra esta foto como hoja de Anexo Documental / Croquis"
                    >
                      <Map className="w-3.5 h-3.5" />
                      {item.isCroquis ? 'Croquis ✓' : 'Es Croquis'}
                    </button>
                  )}
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
