/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Menu,
  Home,
  Plus,
  Search,
  Check,
  Trash2,
  FolderInput,
  Star,
  X,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  FileText,
} from 'lucide-react';
import { Note } from '../types.ts';
import { WeatherTheme } from '../themes.ts';

interface NotesScreenProps {
  notes: Note[];
  currentTheme: WeatherTheme;
  activeFolderFilter: string | null;
  initialSearchQuery?: string;
  onOpenDrawer: () => void;
  onGoHome: () => void;
  onOpenNote: (note: Note) => void;
  onNewNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onMoveNotes: (noteIds: string[], targetFolder: string) => void;
  onEmptyTrash: () => void;
  onRestoreFromTrash: (noteId: string) => void;
}

type ViewMode = 'card' | 'list' | 'grid' | 'time';
type SortOrder = 'rec' | 'old' | 'az';

export function NotesScreen({
  notes,
  currentTheme,
  activeFolderFilter,
  initialSearchQuery = '',
  onOpenDrawer,
  onGoHome,
  onOpenNote,
  onNewNote,
  onDeleteNote,
  onToggleFavorite,
  onMoveNotes,
  onEmptyTrash,
  onRestoreFromTrash,
}: NotesScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [sortOrder, setSortOrder] = useState<SortOrder>('rec');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Exact matching to the vibrant home screen aesthetics
  const isDarkTop = currentTheme.isDarkTopText;
  const topTextColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const topTextSubColor = isDarkTop ? 'text-slate-600' : 'text-white/80';
  const navIconColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const cardStyleClass = isDarkTop ? 'ios-glass-card-light' : 'ios-glass-card-dark';

  const isTrash = activeFolderFilter === 'lix';
  const isArchive = activeFolderFilter === 'arq';
  const isFavorites = activeFolderFilter === 'fav';

  // Screen Title
  const screenTitle = useMemo(() => {
    if (searchQuery) return 'Resultados da busca';
    if (isTrash) return 'Lixeira';
    if (isArchive) return 'Arquivados';
    if (isFavorites) return 'Favoritos';
    if (!activeFolderFilter || activeFolderFilter === 'all') return 'Todas as notas';
    return activeFolderFilter.replace('/', ' › ');
  }, [activeFolderFilter, isTrash, isArchive, isFavorites, searchQuery]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        if (isTrash) return note.tr === '1';
        if (note.tr === '1') return false;

        if (isArchive) return note.ar === '1';
        if (note.ar === '1') return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = note.titulo.toLowerCase().includes(q);
          const matchText = (note.texto || note.t0 || '').toLowerCase().includes(q);
          const matchFolder = (note.p || '').toLowerCase().includes(q);
          return matchTitle || matchText || matchFolder;
        }

        if (isFavorites) return note.fv === '1';

        if (!activeFolderFilter || activeFolderFilter === 'all') return true;
        if (activeFolderFilter.includes('/')) return note.p === activeFolderFilter;
        return note.p === activeFolderFilter || note.p.startsWith(`${activeFolderFilter}/`);
      })
      .sort((a, b) => {
        const aFixed = a.f === '1' ? 1 : 0;
        const bFixed = b.f === '1' ? 1 : 0;
        if (aFixed !== bFixed) return bFixed - aFixed;

        if (sortOrder === 'az') {
          return a.titulo.localeCompare(b.titulo, 'pt');
        }
        if (sortOrder === 'old') {
          return (a.mt || a.t) - (b.mt || b.t);
        }
        return (b.mt || b.t) - (a.mt || a.t);
      });
  }, [notes, isTrash, isArchive, isFavorites, activeFolderFilter, searchQuery, sortOrder]);

  const toggleSelectNote = (id: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedNoteIds.length === filteredNotes.length) {
      setSelectedNoteIds([]);
    } else {
      setSelectedNoteIds(filteredNotes.map((n) => n.id));
    }
  };

  const handleBatchDelete = () => {
    selectedNoteIds.forEach((id) => onDeleteNote(id));
    setIsSelectionMode(false);
    setSelectedNoteIds([]);
  };

  const handleBatchFavorite = () => {
    selectedNoteIds.forEach((id) => onToggleFavorite(id));
    setIsSelectionMode(false);
    setSelectedNoteIds([]);
  };

  function formatDateLabel(timestamp: number): string {
    const d = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.round((now.getTime() - d.getTime()) / 86400000);
    if (diffDays <= 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  }

  return (
    <div className="relative z-10 flex flex-col h-full px-5 pt-2 pb-2.5 sm:px-6 sm:pt-3 sm:pb-3.5 justify-between">
      {/* Top Header */}
      <div className="space-y-2.5">
        {/* Status Bar */}
        <header className="flex justify-between items-center text-xs font-semibold pt-1 pb-1 tracking-tight">
          <span className={`text-[14px] font-medium tracking-tight ml-1 ${topTextColor}`}>
            9:41
          </span>
          <div className="flex items-center space-x-1.5 mr-1">
            <div className={`w-5 h-2.5 border ${isDarkTop ? 'border-slate-800' : 'border-white'} rounded-[3px] p-0.5 flex items-center relative`}>
              <div className={`${isDarkTop ? 'bg-slate-800' : 'bg-white'} h-full w-full rounded-[1px]`} />
            </div>
          </div>
        </header>

        {/* Navigation Bar & Folder Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenDrawer}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${navIconColor}`}
              title="Barra lateral"
              aria-label="Abrir barra lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={onGoHome}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${navIconColor}`}
              title="Início / Dashboard"
              aria-label="Retornar ao Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
            <div className="text-left ml-0.5">
              <h2 className={`text-xl font-bold tracking-tight leading-tight ${topTextColor}`}>
                {screenTitle}
              </h2>
              <small className={`text-[11px] ${topTextSubColor}`}>
                {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
              </small>
            </div>
          </div>

          <button
            onClick={onNewNote}
            className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
            title="Criar nova nota"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* View Options & Selection Toolbar */}
        {!isSelectionMode ? (
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            {/* View Segments */}
            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-xl p-0.5 border border-white/20">
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'card' ? 'bg-white/40 text-white shadow-sm' : 'text-white/70 hover:text-white'
                }`}
                title="Visualização em cartões"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white/40 text-white shadow-sm' : 'text-white/70 hover:text-white'
                }`}
                title="Visualização em lista"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('time')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'time' ? 'bg-white/40 text-white shadow-sm' : 'text-white/70 hover:text-white'
                }`}
                title="Visualização em linha do tempo"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>

            {/* Sort & Select actions */}
            <div className="flex items-center gap-1.5 relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortOrder === 'rec' ? 'Recentes' : sortOrder === 'old' ? 'Antigas' : 'A–Z'}</span>
              </button>

              {showSortDropdown && (
                <div className="absolute top-8 right-0 bg-white/95 border border-white/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-30 w-36 text-left space-y-0.5">
                  <button
                    onClick={() => {
                      setSortOrder('rec');
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      sortOrder === 'rec' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    Mais recentes
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('old');
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      sortOrder === 'old' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    Mais antigas
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('az');
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      sortOrder === 'az' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    Ordem A–Z
                  </button>
                </div>
              )}

              {isTrash ? (
                <button
                  onClick={onEmptyTrash}
                  className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 text-[11px] font-medium cursor-pointer"
                >
                  Esvaziar
                </button>
              ) : (
                <button
                  onClick={() => setIsSelectionMode(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-medium cursor-pointer transition-colors"
                >
                  Selecionar
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Multi-selection Bar */
          <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-xl bg-white/20 border border-white/25 text-xs text-white">
            <button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedNoteIds([]);
              }}
              className="p-1 rounded-lg hover:bg-white/20 cursor-pointer"
              title="Cancelar seleção"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="font-medium text-[11px]">
              {selectedNoteIds.length} {selectedNoteIds.length === 1 ? 'selecionada' : 'selecionadas'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={selectAll}
                className="p-1 rounded-lg hover:bg-white/20 cursor-pointer"
                title="Selecionar tudo"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleBatchFavorite}
                disabled={!selectedNoteIds.length}
                className="p-1 rounded-lg hover:bg-white/20 cursor-pointer disabled:opacity-40"
                title="Favoritar selecionadas"
              >
                <Star className="w-4 h-4" />
              </button>
              <button
                onClick={handleBatchDelete}
                disabled={!selectedNoteIds.length}
                className="p-1 rounded-lg hover:bg-red-500/30 text-red-300 cursor-pointer disabled:opacity-40"
                title="Excluir selecionadas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes List Content with glassmorphism cards shining over the vibrant wallpaper */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2.5 my-1">
        {filteredNotes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40 mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <p className={`text-sm ${topTextSubColor}`}>
              {isTrash ? 'A lixeira está vazia.' : 'Nenhuma nota por aqui.'}
            </p>
            {!isTrash && (
              <button
                onClick={onNewNote}
                className="mt-3 px-3.5 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-medium cursor-pointer shadow-md"
              >
                Criar primeira nota
              </button>
            )}
          </div>
        ) : (
          <div
            className={`space-y-2 ${
              viewMode === 'grid' ? 'grid grid-cols-2 gap-2 space-y-0' : ''
            }`}
          >
            {filteredNotes.map((note) => {
              const isSelected = selectedNoteIds.includes(note.id);
              const preview = note.texto || note.t0 || 'Sem conteúdo adicional';

              if (viewMode === 'list') {
                return (
                  <article
                    key={note.id}
                    onClick={() => {
                      if (isSelectionMode) toggleSelectNote(note.id);
                      else if (isTrash) onRestoreFromTrash(note.id);
                      else onOpenNote(note);
                    }}
                    className={`${cardStyleClass} rounded-xl p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] ${
                      isSelected ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                      {isSelectionMode && (
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-orange-500 border-orange-500' : 'border-white/40'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      )}
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-sm font-semibold truncate ${topTextColor}`}>
                            {note.titulo}
                          </h4>
                          {note.fv === '1' && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        </div>
                        <p className={`text-[11px] truncate ${topTextSubColor}`}>
                          {preview}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/60 flex-shrink-0">
                      {formatDateLabel(note.mt || note.t)}
                    </span>
                  </article>
                );
              }

              if (viewMode === 'time') {
                return (
                  <div key={note.id} className="relative pl-6 text-left">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-white/20" />
                    <div className="absolute left-1 top-3.5 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-slate-900" />
                    <article
                      onClick={() => {
                        if (isSelectionMode) toggleSelectNote(note.id);
                        else if (isTrash) onRestoreFromTrash(note.id);
                        else onOpenNote(note);
                      }}
                      className={`${cardStyleClass} rounded-2xl p-2.5 cursor-pointer transition-transform hover:scale-[1.01] ${
                        isSelected ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-orange-400 font-medium">
                          {formatDateLabel(note.mt || note.t)}
                        </span>
                        {note.fv === '1' && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                      <h4 className={`text-sm font-semibold tracking-tight ${topTextColor}`}>
                        {note.titulo}
                      </h4>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${topTextSubColor}`}>
                        {preview}
                      </p>
                    </article>
                  </div>
                );
              }

              // Standard Card & Grid View
              return (
                <article
                  key={note.id}
                  onClick={() => {
                    if (isSelectionMode) toggleSelectNote(note.id);
                    else if (isTrash) onRestoreFromTrash(note.id);
                    else onOpenNote(note);
                  }}
                  className={`${cardStyleClass} rounded-2xl p-3 cursor-pointer text-left transition-transform hover:scale-[1.01] ${
                    isSelected ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {isSelectionMode && (
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-orange-500 border-orange-500' : 'border-white/40'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      )}
                      <h4 className={`text-sm font-semibold tracking-tight truncate ${topTextColor}`}>
                        {note.titulo}
                      </h4>
                    </div>
                    {note.fv === '1' && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0 ml-1" />
                    )}
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${topTextSubColor}`}>
                    {preview}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-white/10 text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-white/15 text-white/90 truncate max-w-[140px]">
                      {(note.p || 'Sem pasta').replace('/', ' › ')}
                    </span>
                    <span className="text-white/60">
                      {formatDateLabel(note.mt || note.t)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Bar: Search + Create Note */}
      <footer className="pt-2 pb-1" data-purpose="bottom-bar">
        <div className="flex items-center gap-2.5">
          <div className="ios-glass-search flex-1 h-11 rounded-full flex items-center px-4 gap-2.5">
            <Search className="w-4 h-4 text-[#de7649] shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 p-0"
              placeholder="Buscar em todas as notas..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onNewNote}
            className="w-10 h-10 rounded-full bg-[#de7649] hover:bg-[#cf693d] active:scale-95 text-white flex items-center justify-center shadow-md shadow-orange-950/20 transition-transform flex-shrink-0 cursor-pointer"
            title="Criar nota"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        <div
          className={`w-32 h-1 rounded-full mx-auto mt-2 sm:mt-3 ${
            isDarkTop ? 'bg-slate-700/60' : 'bg-white/40'
          }`}
        />
      </footer>
    </div>
  );
}
