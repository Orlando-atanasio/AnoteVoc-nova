/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Home,
  FileText,
  Star,
  Briefcase,
  User,
  FolderKanban,
  Calendar,
  Pin,
  Bell,
  Inbox,
  Archive,
  Cloud,
  Trash2,
  Settings,
  HelpCircle,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Folder,
} from 'lucide-react';
import { FolderItem, Note } from '../types.ts';
import { WeatherTheme } from '../themes.ts';

interface SidebarDrawerProps {
  isOpen: boolean;
  currentTheme: WeatherTheme;
  activeNav: string; // 'inicio', 'notas', 'calendario', 'configuracoes', or folder key
  notes: Note[];
  folders: FolderItem[];
  onClose: () => void;
  onNavigate: (target: string, folderKey?: string | null) => void;
  onCreateFolder: (name: string, parentPath?: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export function SidebarDrawer({
  isOpen,
  currentTheme,
  activeNav,
  notes,
  folders,
  onClose,
  onNavigate,
  onCreateFolder,
  onDeleteFolder,
}: SidebarDrawerProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Trabalho: true,
    Pessoal: true,
    Projetos: true,
  });

  const [isManageMode, setIsManageMode] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('');

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Compute counts
  const nonTrashNotes = notes.filter((n) => !n.tr && n.ar !== '1');
  const allCount = nonTrashNotes.length;
  const favCount = nonTrashNotes.filter((n) => n.fv === '1').length;
  const pinCount = nonTrashNotes.filter((n) => n.f === '1').length;
  const trashCount = notes.filter((n) => n.tr === '1').length;
  const archiveCount = notes.filter((n) => n.ar === '1').length;

  const getFolderCount = (path: string) => {
    return nonTrashNotes.filter((n) => {
      const p = n.p || '';
      return p === path || p.startsWith(`${path}/`);
    }).length;
  };

  // Group top-level folders and subfolders
  const rootFolders = folders.filter((f) => !f.p);
  const getSubfolders = (parentName: string) =>
    folders.filter((f) => f.p === parentName);

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), newFolderParent || undefined);
    setNewFolderName('');
    setNewFolderParent('');
    setShowNewFolderModal(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 z-40 transition-opacity duration-300 sm:rounded-[39px] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        id="sidebar-backdrop"
      />

      {/* Retractable Drawer */}
      <aside
        className={`absolute top-0 bottom-0 left-0 w-[260px] sm:w-[270px] z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl overflow-hidden border-r border-white/20 text-left select-none sm:rounded-l-[39px] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundImage: `${currentTheme.sidebarGradient}, url('${currentTheme.imageUrl}')`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {currentTheme.hasRainOverlay && (
          <div className="rain-overlay absolute inset-0 pointer-events-none z-0 opacity-60" />
        )}

        {/* Inner Content */}
        <div className="relative z-10 flex flex-col h-full px-4 py-4 justify-between overflow-y-auto no-scrollbar">
          <div>
            {/* Top Header: AnoteVocê + Close */}
            <div className="flex items-center justify-between pb-3 pt-1 border-b border-white/15">
              <span className="text-lg font-bold text-white tracking-tight">
                AnoteVocê
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsManageMode(!isManageMode)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    isManageMode
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {isManageMode ? 'OK' : 'Editar'}
                </button>
                <button
                  onClick={() => setShowNewFolderModal(true)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  title="Nova pasta"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Navigation Items */}
            <nav className="mt-3 space-y-1">
              {/* Início / Hoje */}
              <button
                onClick={() => {
                  onNavigate('inicio');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === 'inicio'
                    ? 'bg-[#c27847]/85 text-white shadow-md border border-white/20 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-white" />
                  <span>Início</span>
                </div>
              </button>

              {/* Todas as notas */}
              <button
                onClick={() => {
                  onNavigate('notas', 'all');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === 'all'
                    ? 'bg-[#c27847]/85 text-white shadow-md border border-white/20 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-white" />
                  <span>Todas as notas</span>
                </div>
                <span className="text-[11px] opacity-70">{allCount}</span>
              </button>

              {/* Favoritos */}
              <button
                onClick={() => {
                  onNavigate('notas', 'fav');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === 'fav'
                    ? 'bg-[#c27847]/85 text-white shadow-md border border-white/20 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Favoritos</span>
                </div>
                <span className="text-[11px] opacity-70">{favCount}</span>
              </button>

              {/* Folders hierarchy: Trabalho, Pessoal, Projetos, etc. */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                {rootFolders.map((root) => {
                  const subItems = getSubfolders(root.n);
                  const isOpen = !!openGroups[root.n];
                  const rootCount = getFolderCount(root.n);

                  return (
                    <div key={root.id} className="space-y-0.5">
                      {/* Root Folder Item */}
                      <div
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          activeNav === root.n
                            ? 'bg-[#c27847]/85 text-white shadow-sm font-semibold'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div
                          onClick={() => {
                            if (subItems.length > 0) toggleGroup(root.n);
                            else {
                              onNavigate('notas', root.n);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-2 flex-1"
                        >
                          <Folder className="w-3.5 h-3.5 text-orange-400" />
                          <span className="truncate">{root.n}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isManageMode && (
                            <button
                              onClick={() => onDeleteFolder(root.id)}
                              className="text-red-400 hover:text-red-300 p-0.5"
                              title="Excluir pasta"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className="text-[10px] opacity-70">{rootCount}</span>
                          {subItems.length > 0 && (
                            <button onClick={() => toggleGroup(root.n)} className="p-0.5">
                              {isOpen ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subfolders list */}
                      {isOpen && subItems.length > 0 && (
                        <div className="pl-5 space-y-0.5 border-l border-white/15 ml-3 my-0.5">
                          {subItems.map((sub) => {
                            const subPath = `${root.n}/${sub.n}`;
                            const subCount = getFolderCount(subPath);

                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  onNavigate('notas', subPath);
                                  onClose();
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                  activeNav === subPath
                                    ? 'bg-[#c27847]/80 text-white font-semibold'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <span className="truncate">{sub.n}</span>
                                <div className="flex items-center gap-1">
                                  {isManageMode && (
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteFolder(sub.id);
                                      }}
                                      className="text-red-400 p-0.5"
                                    >
                                      ×
                                    </span>
                                  )}
                                  <span className="text-[10px] opacity-60">{subCount}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calendário & Productivity shortcuts */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <button
                  onClick={() => {
                    onNavigate('calendario');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    activeNav === 'calendario'
                      ? 'bg-[#c27847]/85 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Calendário</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('notas', 'fix');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    activeNav === 'fix'
                      ? 'bg-[#c27847]/85 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Pin className="w-4 h-4 text-orange-400" />
                    <span>Fixadas</span>
                  </div>
                  <span className="text-[11px] opacity-70">{pinCount}</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('notas', 'arq');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    activeNav === 'arq'
                      ? 'bg-[#c27847]/85 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Archive className="w-4 h-4 text-white" />
                    <span>Arquivados</span>
                  </div>
                  <span className="text-[11px] opacity-70">{archiveCount}</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('notas', 'lix');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    activeNav === 'lix'
                      ? 'bg-[#c27847]/85 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span>Lixeira</span>
                  </div>
                  <span className="text-[11px] opacity-70">{trashCount}</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Bottom Settings Link */}
          <div className="pt-3 border-t border-white/15">
            <button
              onClick={() => {
                onNavigate('configuracoes');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeNav === 'configuracoes'
                  ? 'bg-[#c27847]/85 text-white font-semibold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="w-4 h-4 text-white/80" />
              <span>Configurações</span>
            </button>
          </div>
        </div>

        {/* Modal: Nova Pasta */}
        {showNewFolderModal && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-3">
            <form
              onSubmit={handleCreateFolderSubmit}
              className="w-full bg-slate-900/95 border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl text-left space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Nova Pasta</h3>
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Nome da pasta</label>
                <input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ex: Finanças, Estudos..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Criar dentro de</label>
                <select
                  value={newFolderParent}
                  onChange={(e) => setNewFolderParent(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-800 border border-white/20 text-white focus:outline-none"
                >
                  <option value="">Pasta principal (raiz)</option>
                  {rootFolders.map((f) => (
                    <option key={f.id} value={f.n}>
                      {f.n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 py-1.5 text-xs rounded-xl bg-white/10 text-white font-medium hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow-md"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        )}
      </aside>
    </>
  );
}
