/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Undo2,
  Redo2,
  Share2,
  MoreVertical,
  Star,
  Lock,
  Unlock,
  Pin,
  Archive,
  Trash2,
  Calendar,
  FolderInput,
  Camera,
  CheckSquare,
  Palette,
  X,
  Plus,
  Trash,
} from 'lucide-react';
import { Note, NoteTable, NoteTask } from '../types.ts';
import { WeatherTheme } from '../themes.ts';

interface NoteEditorScreenProps {
  note: Note;
  currentTheme: WeatherTheme;
  allFolderPaths: string[];
  onBack: () => void;
  onSaveNote: (updatedNote: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onOpenCalendar: () => void;
}

export function NoteEditorScreen({
  note,
  currentTheme,
  allFolderPaths,
  onBack,
  onSaveNote,
  onDeleteNote,
  onOpenCalendar,
}: NoteEditorScreenProps) {
  const [titulo, setTitulo] = useState(note.titulo || 'Nova nota');
  const [bodyText, setBodyText] = useState(note.t0 || note.texto || '');
  const [format, setFormat] = useState<'line' | 'none' | 'dot'>(note.fm || 'line');
  const [isPinned, setIsPinned] = useState(note.f === '1');
  const [isFavorite, setIsFavorite] = useState(note.fv === '1');
  const [isLocked, setIsLocked] = useState(note.lk === '1');
  const [isArchived, setIsArchived] = useState(note.ar === '1');
  const [currentFolder, setCurrentFolder] = useState(note.p || 'Sem pasta');
  const [textColor, setTextColor] = useState(note.tc || '');
  const [pageColor, setPageColor] = useState(note.pc || '');
  const [highlightColor, setHighlightColor] = useState(note.hc || '');
  const [fontSize, setFontSize] = useState<number>(Number(note.fs) || 1);

  // Tables & Tasks state
  const [tables, setTables] = useState<NoteTable[]>(() => {
    try {
      return note.tb ? JSON.parse(note.tb) : [];
    } catch {
      return [];
    }
  });

  const [tasks, setTasks] = useState<NoteTask[]>(() => {
    try {
      return note.tk ? JSON.parse(note.tk) : [];
    } catch {
      return [];
    }
  });

  const [images, setImages] = useState<string[]>(() => {
    try {
      return note.img ? JSON.parse(note.img) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [colorMode, setColorMode] = useState<'text' | 'page' | 'highlight'>('text');
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);

  // Undo/Redo stack
  const [history, setHistory] = useState<string[]>([bodyText]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save note changes
  useEffect(() => {
    const updated: Note = {
      ...note,
      titulo: titulo.trim() || 'Nova nota',
      texto: bodyText.slice(0, 140),
      t0: bodyText,
      p: currentFolder,
      mt: Date.now(),
      fm: format,
      f: isPinned ? '1' : undefined,
      fv: isFavorite ? '1' : undefined,
      lk: isLocked ? '1' : undefined,
      ar: isArchived ? '1' : undefined,
      fs: String(fontSize),
      tc: textColor || undefined,
      pc: pageColor || undefined,
      hc: highlightColor || undefined,
      tb: tables.length ? JSON.stringify(tables) : undefined,
      tk: tasks.length ? JSON.stringify(tasks) : undefined,
      img: images.length ? JSON.stringify(images) : undefined,
    };
    onSaveNote(updated);
  }, [
    titulo,
    bodyText,
    format,
    isPinned,
    isFavorite,
    isLocked,
    isArchived,
    currentFolder,
    textColor,
    pageColor,
    highlightColor,
    fontSize,
    tables,
    tasks,
    images,
  ]);

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isLocked) return;
    const val = e.target.value;
    setBodyText(val);

    if (val !== history[historyIdx]) {
      const nextHist = history.slice(0, historyIdx + 1);
      nextHist.push(val);
      setHistory(nextHist.slice(-50));
      setHistoryIdx(nextHist.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = historyIdx - 1;
      setHistoryIdx(prev);
      setBodyText(history[prev]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = historyIdx + 1;
      setHistoryIdx(next);
      setBodyText(history[next]);
    }
  };

  const handleShare = () => {
    const fullContent = `${titulo}\n\n${bodyText}`;
    if (navigator.share) {
      navigator.share({ title: titulo, text: fullContent }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(fullContent).then(() => {
        alert('Conteúdo copiado para a área de transferência');
      });
    }
  };

  // Add Table
  const handleAddTable = () => {
    if (isLocked) return;
    const newTable: NoteTable = {
      r: [
        ['Item 1', 'Valor 1'],
        ['Item 2', 'Valor 2'],
      ],
      a: '',
    };
    setTables([...tables, newTable]);
  };

  const handleAddTableRow = (tableIdx: number) => {
    if (isLocked) return;
    const copy = [...tables];
    const target = copy[tableIdx];
    const numCols = target.r[0]?.length || 2;
    target.r.push(new Array(numCols).fill(''));
    setTables(copy);
  };

  const handleAddTableCol = (tableIdx: number) => {
    if (isLocked) return;
    const copy = [...tables];
    const target = copy[tableIdx];
    target.r.forEach((row) => row.push(''));
    setTables(copy);
  };

  const handleDeleteTable = (tableIdx: number) => {
    if (isLocked) return;
    setTables(tables.filter((_, idx) => idx !== tableIdx));
  };

  // Add Checklist task
  const handleAddTask = () => {
    if (isLocked) return;
    setTasks([...tasks, { t: '', d: 0 }]);
  };

  const handleToggleTask = (taskIdx: number) => {
    if (isLocked) return;
    const copy = [...tasks];
    copy[taskIdx].d = copy[taskIdx].d ? 0 : 1;
    setTasks(copy);
  };

  const handleTaskTextChange = (taskIdx: number, val: string) => {
    if (isLocked) return;
    const copy = [...tasks];
    copy[taskIdx].t = val;
    setTasks(copy);
  };

  const handleDeleteTask = (taskIdx: number) => {
    if (isLocked) return;
    setTasks(tasks.filter((_, idx) => idx !== taskIdx));
  };

  // Add Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImages([...images, reader.result]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const fontSizes = [15, 17, 20];
  const currentFontSize = fontSizes[fontSize] || 17;

  // Swatch palettes
  const colorPalettes = {
    text: ['#1d3a4c', '#111111', '#dc2626', '#ea580c', '#d97706', '#16a34a', '#0284c7', '#4f46e5', '#9333ea', '#db2777'],
    page: ['#ffffff', '#fffbeb', '#fef2f2', '#f0fdf4', '#f0f9ff', '#faf5ff', '#f1f5f9'],
    highlight: ['#fef08a', '#fed7aa', '#fbcfe8', '#bbf7d0', '#bae6fd', '#e9d5ff'],
  };

  return (
    <div
      className="relative z-10 w-full h-full flex flex-col justify-between overflow-hidden text-left transition-colors sm:rounded-[39px]"
      style={{
        backgroundColor: pageColor || '#ffffff',
      }}
    >
      {/* Top Navigation Bar: Edge-to-edge, clean iOS blur */}
      <header className="px-4 pt-3 pb-2.5 flex items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex-shrink-0 z-10 sm:rounded-t-[39px]">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#1f3d4e] hover:text-black text-xs font-semibold px-2 py-1.5 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-[#2c6a80]" />
          <span className="truncate max-w-[120px]">{currentFolder.replace('/', ' › ')}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={historyIdx <= 0 || isLocked}
            className="p-1.5 text-[#2f5d70] hover:text-black rounded-lg hover:bg-slate-200/50 disabled:opacity-30 cursor-pointer"
            title="Desfazer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1 || isLocked}
            className="p-1.5 text-[#2f5d70] hover:text-black rounded-lg hover:bg-slate-200/50 disabled:opacity-30 cursor-pointer"
            title="Refazer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 text-[#2f5d70] hover:text-black rounded-lg hover:bg-slate-200/50 cursor-pointer"
            title="Compartilhar nota"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer text-amber-500"
            title={isFavorite ? 'Remover dos favoritos' : 'Favoritar nota'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : 'text-slate-400'}`} />
          </button>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1.5 text-[#2f5d70] hover:text-black rounded-lg hover:bg-slate-200/50 cursor-pointer"
            title="Mais opções"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Note Paper Canvas: Full-bleed notebook sheet taking the entire screen */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 sm:px-6 py-4 flex flex-col">
        {/* Note Title Input */}
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          disabled={isLocked}
          placeholder="Título da nota"
          className="w-full bg-transparent border-none text-2xl sm:text-3xl font-bold tracking-tight text-[#1b3547] placeholder-slate-400 focus:outline-none p-0 mb-2"
        />

        {/* Folder tag + Lock indicator + Modified date */}
        <div className="flex items-center justify-between gap-2 text-xs mb-3.5 pb-2.5 border-b border-slate-200/80 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMoveFolderModal(true)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#2c6a80] border border-slate-200 flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <FolderInput className="w-3.5 h-3.5 text-orange-500" />
              <span>{currentFolder.replace('/', ' › ')}</span>
            </button>

            {isLocked && (
              <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 text-[11px] font-medium">
                <Lock className="w-3 h-3" />
                Bloqueada
              </span>
            )}
            {isPinned && (
              <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1 text-[11px] font-medium">
                <Pin className="w-3 h-3" />
                Fixada
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400">
            {new Date(note.mt || note.t).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Body Textarea with ruled notebook lines */}
        <textarea
          value={bodyText}
          onChange={handleBodyChange}
          disabled={isLocked}
          placeholder="Escreva sua nota aqui…"
          rows={12}
          className={`w-full flex-1 min-h-[340px] bg-transparent border-none resize-none focus:outline-none p-0 text-[#1d3a4c] placeholder-slate-400 leading-[32px] ${
            format === 'line' ? 'nf-line' : format === 'dot' ? 'nf-dot' : 'nf-none'
          }`}
          style={{
            fontSize: `${currentFontSize}px`,
            color: textColor || '#1d3a4c',
          }}
        />

          {/* Checklists Section */}
          {tasks.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-200/80 mt-2">
              <h4 className="text-xs font-semibold text-[#5a7684] uppercase tracking-wider">Tarefas</h4>
              <div className="space-y-1.5">
                {tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 group">
                    <button
                      onClick={() => handleToggleTask(idx)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                        task.d
                          ? 'bg-orange-500 border-orange-500 text-white font-bold'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      {task.d ? '✓' : ''}
                    </button>
                    <input
                      value={task.t}
                      onChange={(e) => handleTaskTextChange(idx, e.target.value)}
                      disabled={isLocked}
                      placeholder="Descrição da tarefa..."
                      className={`flex-1 bg-transparent border-none text-sm text-[#1f3d4e] focus:outline-none ${
                        task.d ? 'line-through text-slate-400' : ''
                      }`}
                    />
                    {!isLocked && (
                      <button
                        onClick={() => handleDeleteTask(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tables Section */}
          {tables.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-200/80 mt-2">
              {tables.map((table, tIdx) => (
                <div key={tIdx} className="bg-white/80 border border-slate-200 rounded-2xl p-2.5 space-y-2 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#1b3547]">Tabela #{tIdx + 1}</span>
                    {!isLocked && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAddTableRow(tIdx)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[#2c6a80] font-medium text-[11px] cursor-pointer"
                        >
                          + Linha
                        </button>
                        <button
                          onClick={() => handleAddTableCol(tIdx)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[#2c6a80] font-medium text-[11px] cursor-pointer"
                        >
                          + Coluna
                        </button>
                        <button
                          onClick={() => handleDeleteTable(tIdx)}
                          className="p-1 text-red-500 hover:text-red-600 cursor-pointer"
                          title="Excluir tabela"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-[#1f3d4e] border-collapse">
                      <tbody>
                        {table.r.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-200 last:border-b-0">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-1.5 border-r border-slate-200 last:border-r-0">
                                <input
                                  value={cell}
                                  onChange={(e) => {
                                    const copy = [...tables];
                                    copy[tIdx].r[rIdx][cIdx] = e.target.value;
                                    setTables(copy);
                                  }}
                                  disabled={isLocked}
                                  placeholder={`Item ${cIdx + 1}`}
                                  className="w-full bg-transparent border-none text-[#1f3d4e] focus:outline-none"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Attached Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/80 mt-2">
              {images.map((src, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 group shadow-sm">
                  <img src={src} alt="Anexo" className="w-full h-28 object-cover" />
                  {!isLocked && (
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center cursor-pointer hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Bottom Tool Bar: Clean docked bar with tools and Concluir button */}
      <footer className="px-4 pt-2.5 pb-2 bg-white/95 border-t border-slate-200/90 backdrop-blur-xl flex flex-col text-[#2f5d70] flex-shrink-0 z-10 sm:rounded-b-[39px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleAddTable}
              disabled={isLocked}
              className="p-2 rounded-xl hover:bg-slate-200/60 cursor-pointer disabled:opacity-40 transition-colors"
              title="Inserir tabela"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddTask}
              disabled={isLocked}
              className="p-2 rounded-xl hover:bg-slate-200/60 cursor-pointer disabled:opacity-40 transition-colors"
              title="Inserir lista de tarefas"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFontSize((fontSize + 1) % 3)}
              disabled={isLocked}
              className="p-2 rounded-xl hover:bg-slate-200/60 cursor-pointer text-xs font-bold disabled:opacity-40 transition-colors"
              title="Tamanho do texto"
            >
              Aa
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLocked}
              className="p-2 rounded-xl hover:bg-slate-200/60 cursor-pointer disabled:opacity-40 transition-colors"
              title="Adicionar imagem"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowColorPanel(!showColorPanel)}
              disabled={isLocked}
              className="p-2 rounded-xl text-orange-500 hover:bg-orange-50 cursor-pointer disabled:opacity-40 transition-colors"
              title="Cores da nota"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onBack}
            className="text-xs font-semibold px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white cursor-pointer shadow-md transition-transform"
          >
            Concluir
          </button>
        </div>
        <div className="w-32 h-1 rounded-full mx-auto bg-slate-300 mt-2" />
      </footer>

      {/* Hidden file input for camera/gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Color Panel Modal */}
      {showColorPanel && (
        <div className="absolute inset-x-2 bottom-14 bg-white/98 border border-slate-200 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl z-40 animate-fadeIn text-left">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-[#1b3547]">Cores da nota</h3>
            <button onClick={() => setShowColorPanel(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Color Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3 text-xs">
            <button
              onClick={() => setColorMode('text')}
              className={`py-1 rounded-lg font-medium cursor-pointer ${
                colorMode === 'text' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Texto
            </button>
            <button
              onClick={() => setColorMode('page')}
              className={`py-1 rounded-lg font-medium cursor-pointer ${
                colorMode === 'page' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Página
            </button>
            <button
              onClick={() => setColorMode('highlight')}
              className={`py-1 rounded-lg font-medium cursor-pointer ${
                colorMode === 'highlight' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Marca-texto
            </button>
          </div>

          {/* Palette Swatches */}
          <div className="flex flex-wrap gap-2 mb-3">
            {colorPalettes[colorMode].map((color) => (
              <button
                key={color}
                onClick={() => {
                  if (colorMode === 'text') setTextColor(color);
                  else if (colorMode === 'page') setPageColor(color);
                  else setHighlightColor(color);
                }}
                className="w-7 h-7 rounded-full border border-slate-300 cursor-pointer shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (colorMode === 'text') setTextColor('');
              else if (colorMode === 'page') setPageColor('');
              else setHighlightColor('');
            }}
            className="w-full text-xs text-center text-slate-500 hover:text-slate-800 py-1 cursor-pointer font-medium"
          >
            Remover cor
          </button>
        </div>
      )}

      {/* More Options Dropdown Menu */}
      {showMoreMenu && (
        <div className="absolute top-12 right-3 w-56 bg-white/98 border border-slate-200 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-50 text-left text-xs animate-fadeIn">
          <button
            onClick={() => {
              setIsPinned(!isPinned);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1f3d4e] hover:bg-slate-100 cursor-pointer"
          >
            <Pin className="w-4 h-4 text-orange-500" />
            <span>{isPinned ? 'Desafixar nota' : 'Fixar nota'}</span>
          </button>

          <button
            onClick={() => {
              setIsLocked(!isLocked);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1f3d4e] hover:bg-slate-100 cursor-pointer"
          >
            {isLocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
            <span>{isLocked ? 'Desbloquear nota' : 'Bloquear nota'}</span>
          </button>

          <button
            onClick={() => {
              setShowMoveFolderModal(true);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1f3d4e] hover:bg-slate-100 cursor-pointer"
          >
            <FolderInput className="w-4 h-4 text-blue-500" />
            <span>Mover para pasta</span>
          </button>

          <button
            onClick={() => {
              setShowMoreMenu(false);
              onOpenCalendar();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1f3d4e] hover:bg-slate-100 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Consultar calendário</span>
          </button>

          {/* Paper Format Option */}
          <div className="p-2 border-t border-slate-200 mt-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1.5">Fundo do papel</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setFormat('line')}
                className={`py-1 rounded-lg text-center cursor-pointer ${
                  format === 'line' ? 'bg-orange-500 text-white font-medium shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Linhas
              </button>
              <button
                onClick={() => setFormat('none')}
                className={`py-1 rounded-lg text-center cursor-pointer ${
                  format === 'none' ? 'bg-orange-500 text-white font-medium shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Branco
              </button>
              <button
                onClick={() => setFormat('dot')}
                className={`py-1 rounded-lg text-center cursor-pointer ${
                  format === 'dot' ? 'bg-orange-500 text-white font-medium shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Pontos
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 my-1" />

          <button
            onClick={() => {
              setIsArchived(!isArchived);
              setShowMoreMenu(false);
              onBack();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1f3d4e] hover:bg-slate-100 cursor-pointer"
          >
            <Archive className="w-4 h-4 text-amber-600" />
            <span>{isArchived ? 'Desarquivar nota' : 'Arquivar nota'}</span>
          </button>

          <button
            onClick={() => {
              onDeleteNote(note.id);
              setShowMoreMenu(false);
              onBack();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span>Mover para lixeira</span>
          </button>
        </div>
      )}

      {/* Move to Folder Modal */}
      {showMoveFolderModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white/98 border border-slate-200 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-left animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-[#1b3547]">Mover para pasta</h3>
              <button onClick={() => setShowMoveFolderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 my-2">
              <button
                onClick={() => {
                  setCurrentFolder('Sem pasta');
                  setShowMoveFolderModal(false);
                }}
                className={`w-full text-xs text-left px-3 py-2 rounded-xl cursor-pointer ${
                  currentFolder === 'Sem pasta'
                    ? 'bg-orange-500 text-white font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Sem pasta
              </button>
              {allFolderPaths.map((fPath) => (
                <button
                  key={fPath}
                  onClick={() => {
                    setCurrentFolder(fPath);
                    setShowMoveFolderModal(false);
                  }}
                  className={`w-full text-xs text-left px-3 py-2 rounded-xl cursor-pointer ${
                    currentFolder === fPath
                      ? 'bg-orange-500 text-white font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {fPath.replace('/', ' › ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
