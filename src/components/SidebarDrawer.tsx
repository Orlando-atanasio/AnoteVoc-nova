/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Home,
  FileText,
  Star,
  Briefcase,
  User,
  Layers,
  Calendar,
  Pin,
  Archive,
  Trash2,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderPlus,
  Pencil,
  Car,
  ShoppingBasket,
  Wrench,
  TrendingUp,
  Mail,
  Sparkles,
  Landmark,
  Lightbulb,
  PenTool,
  Smartphone,
  Wifi,
  Stethoscope,
  Pill,
  Target,
  Film,
  Music,
  Image as ImageIcon,
  BookOpen,
  BriefcaseBusiness,
  Church,
  ShoppingBag,
  Send,
  ShieldCheck,
  Utensils,
  HeartPulse,
  Dumbbell,
  PawPrint,
  Gamepad2,
  Code,
  Library,
  Users,
  Search,
  Check,
} from 'lucide-react';
import { FolderItem, Note, UserProfile } from '../types.ts';
import { WeatherTheme, WEATHER_THEMES } from '../themes.ts';
import { SidebarToggleIcon } from './SidebarToggleIcon.tsx';

export interface FolderIconOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Exactly 39 options as requested and displayed in the screenshot
export const FOLDER_ICON_OPTIONS: FolderIconOption[] = [
  { id: 'folder', label: 'Pasta comum', icon: Folder },
  { id: 'work', label: 'Trabalho', icon: Briefcase },
  { id: 'personal', label: 'Pessoal', icon: User },
  { id: 'projects', label: 'Projetos', icon: Layers },
  { id: 'car', label: 'Carro', icon: Car },
  { id: 'supermarket', label: 'Supermercado', icon: ShoppingBasket },
  { id: 'services', label: 'Serviços', icon: Wrench },
  { id: 'investments', label: 'Investimentos', icon: TrendingUp },
  { id: 'emails', label: 'E-mails', icon: Mail },
  { id: 'prompts', label: 'Prompts', icon: Sparkles },
  { id: 'bank', label: 'Bancos e corretora', icon: Landmark },
  { id: 'tips', label: 'Dicas e macetes', icon: Lightbulb },
  { id: 'bids', label: 'Licitações', icon: PenTool },
  { id: 'phone', label: 'Telefone', icon: Smartphone },
  { id: 'internet', label: 'Internet', icon: Wifi },
  { id: 'doctor', label: 'Médico', icon: Stethoscope },
  { id: 'medicine', label: 'Remédios', icon: Pill },
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'movies', label: 'Filmes e séries', icon: Film },
  { id: 'music', label: 'Música', icon: Music },
  { id: 'photos', label: 'Fotos', icon: ImageIcon },
  { id: 'studies', label: 'Estudos', icon: BookOpen },
  { id: 'extra_work', label: 'Trabalho extra', icon: BriefcaseBusiness },
  { id: 'church', label: 'Igreja', icon: Church },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'shopping', label: 'Compras', icon: ShoppingBag },
  { id: 'travel', label: 'Viagens', icon: Send },
  { id: 'security', label: 'Segurança', icon: ShieldCheck },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { id: 'food', label: 'Alimentação', icon: Utensils },
  { id: 'health', label: 'Saúde', icon: HeartPulse },
  { id: 'fitness', label: 'Academia', icon: Dumbbell },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'games', label: 'Jogos', icon: Gamepad2 },
  { id: 'code', label: 'Código', icon: Code },
  { id: 'books', label: 'Livros', icon: Library },
  { id: 'family', label: 'Família', icon: Users },
  { id: 'favorites', label: 'Favoritos', icon: Star },
];

export function getFolderIconComponent(iconId?: string): React.ComponentType<{ className?: string }> {
  const match = FOLDER_ICON_OPTIONS.find((opt) => opt.id === iconId);
  return match ? match.icon : Folder;
}

export function getFolderIconLabel(iconId?: string): string {
  const match = FOLDER_ICON_OPTIONS.find((opt) => opt.id === iconId);
  return match ? match.label : 'Pasta comum';
}

export function suggestFolderIcon(name: string): string {
  const lower = name.toLowerCase().trim();
  if (!lower) return 'folder';

  if (/carro|ve[ií]culo|moto|auto|gasolina|ipva/.test(lower)) return 'car';
  if (/supermercado|mercado|feira|hortifruti/.test(lower)) return 'supermarket';
  if (/servi[cç]o|manuten|conserto|reparo/.test(lower)) return 'services';
  if (/invest|a[cç][oõ]es|renda|cdb|tesouro|fundo/.test(lower)) return 'investments';
  if (/e-?mail|mensagem|inbox|contato/.test(lower)) return 'emails';
  if (/prompt|ia|chatgpt|gemini|ia|comando/.test(lower)) return 'prompts';
  if (/banco|corretora|conta|pix|cart[aã]o|financeiro|dinheiro|pagamento/.test(lower)) return 'bank';
  if (/dica|macete|truque|atalho|tutorial/.test(lower)) return 'tips';
  if (/licita|edital|proposta|preg[aã]o/.test(lower)) return 'bids';
  if (/telefone|celular|ligar|operadora|chamada/.test(lower)) return 'phone';
  if (/internet|wifi|rede|provedor|conex[aã]o/.test(lower)) return 'internet';
  if (/m[eé]dic|consulta|exame|cl[ií]nica|doutor|dentista/.test(lower)) return 'doctor';
  if (/rem[eé]dio|medicamento|farm[aá]cia|receita|drogaria/.test(lower)) return 'medicine';
  if (/casa|lar|im[oó]vel|apartamento|reforma|aluguel/.test(lower)) return 'home';
  if (/meta|objetivo|foco|planejamento|alvo/.test(lower)) return 'goals';
  if (/filme|s[eé]rie|cinema|netflix|streaming|v[ií]deo/.test(lower)) return 'movies';
  if (/m[uú]sica|som|playlist|show|banda/.test(lower)) return 'music';
  if (/foto|imagem|galeria|recorda/.test(lower)) return 'photos';
  if (/estudo|curso|faculdade|escola|aula|concurso|aprender/.test(lower)) return 'studies';
  if (/trabalho extra|freela|bico|renda extra/.test(lower)) return 'extra_work';
  if (/igreja|religi|culto|missa|f[eé]|ora[cç][aã]o/.test(lower)) return 'church';
  if (/documento|certid|rg|cpf|contrato|pdf/.test(lower)) return 'documents';
  if (/compra|shopping|loja|pedidos/.test(lower)) return 'shopping';
  if (/viag|f[eé]rias|praia|passagem|hotel|turismo|mala|voo/.test(lower)) return 'travel';
  if (/seguran|senha|prote[cç][aã]o|privacidade/.test(lower)) return 'security';
  if (/calend[aá]rio|agenda|compromisso|evento|prazo/.test(lower)) return 'calendar';
  if (/aliment|comida|restaurante|almo[cç]o|jantar|dieta|nutri/.test(lower)) return 'food';
  if (/sa[uú]de|terapia|psicolog|bem-estar/.test(lower)) return 'health';
  if (/academia|treino|gym|fit|exerc[ií]cio|muscula/.test(lower)) return 'fitness';
  if (/pet|cachorro|gato|animal|veterin[aá]rio/.test(lower)) return 'pets';
  if (/jogo|game|play|divers[aã]o/.test(lower)) return 'games';
  if (/c[oó]digo|dev|program|software|ti|site|web/.test(lower)) return 'code';
  if (/livro|leitura|biblioteca|literatura/.test(lower)) return 'books';
  if (/fam[ií]lia|pais|filhos|parentes/.test(lower)) return 'family';
  if (/favorit|estrela|destaque|importante/.test(lower)) return 'favorites';
  if (/trabalho|work|empresa|reuni|job|escrit[oó]rio|cliente/.test(lower)) return 'work';
  if (/pessoal|vida|eu|rotina|di[aá]rio/.test(lower)) return 'personal';
  if (/projeto|sprint|entrega|task/.test(lower)) return 'projects';

  return 'folder';
}

interface SidebarDrawerProps {
  isOpen: boolean;
  currentTheme: WeatherTheme;
  activeNav: string;
  notes: Note[];
  folders: FolderItem[];
  profile?: UserProfile;
  onClose: () => void;
  onNavigate: (target: string, folderKey?: string | null) => void;
  onCreateFolder: (name: string, parentPath?: string, icon?: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder?: (folderId: string, newName: string, icon?: string) => void;
}

export function SidebarDrawer({
  isOpen,
  currentTheme,
  activeNav,
  notes,
  folders,
  profile,
  onClose,
  onNavigate,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
}: SidebarDrawerProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Trabalho: true,
    Pessoal: true,
    Projetos: true,
  });

  const [isManageMode, setIsManageMode] = useState(false);

  // Modal: Nova Pasta
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('folder');
  const [isIconManuallySelected, setIsIconManuallySelected] = useState(false);
  const [isParentPickerOpen, setIsParentPickerOpen] = useState(false);

  // Extended icon picker screen (slides in from right to left)
  const [showExtendedIconPicker, setShowExtendedIconPicker] = useState(false);
  const [iconPickerSearch, setIconPickerSearch] = useState('');
  const [iconPickerTargetMode, setIconPickerTargetMode] = useState<'create' | 'edit'>('create');

  // Modal: Editar Pasta
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [editingFolderIcon, setEditingFolderIcon] = useState('folder');
  const [folderToDelete, setFolderToDelete] = useState<FolderItem | null>(null);

  const handleStartRename = (folder: FolderItem) => {
    setEditingFolder(folder);
    setEditingFolderName(folder.n);
    setEditingFolderIcon(folder.i || 'folder');
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFolder || !editingFolderName.trim()) return;
    if (onRenameFolder) {
      onRenameFolder(editingFolder.id, editingFolderName.trim(), editingFolderIcon);
    }
    setEditingFolder(null);
    setEditingFolderName('');
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewFolderName(val);
    if (!isIconManuallySelected) {
      setNewFolderIcon(suggestFolderIcon(val));
    }
  };

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

  const handleOpenNewFolder = () => {
    setNewFolderName('');
    setNewFolderParent('');
    setNewFolderIcon('folder');
    setIsIconManuallySelected(false);
    setIsParentPickerOpen(false);
    setShowExtendedIconPicker(false);
    setShowNewFolderModal(true);
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), newFolderParent || undefined, newFolderIcon);
    setNewFolderName('');
    setNewFolderParent('');
    setNewFolderIcon('folder');
    setIsIconManuallySelected(false);
    setShowNewFolderModal(false);
  };

  // Filtered icons in the extended picker
  const filteredIcons = useMemo(() => {
    const q = iconPickerSearch.toLowerCase().trim();
    if (!q) return FOLDER_ICON_OPTIONS;
    return FOLDER_ICON_OPTIONS.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [iconPickerSearch]);

  const activePickerIconId = iconPickerTargetMode === 'create' ? newFolderIcon : editingFolderIcon;

  const handleSelectIconInExtended = (iconId: string) => {
    if (iconPickerTargetMode === 'create') {
      setNewFolderIcon(iconId);
      setIsIconManuallySelected(true);
    } else {
      setEditingFolderIcon(iconId);
    }
  };

  const handleConcludeIconPicker = () => {
    setShowExtendedIconPicker(false);
    setIconPickerSearch('');
  };

  const SelectedNewFolderIconComp = getFolderIconComponent(newFolderIcon);
  const SelectedEditFolderIconComp = getFolderIconComponent(editingFolderIcon);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/25 backdrop-blur-[1px] z-40 transition-opacity duration-300 rounded-[42px] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        id="sidebar-backdrop"
      />

      {/* Retractable Drawer */}
      <aside
        className={`absolute top-0 bottom-0 left-0 w-[265px] sm:w-[275px] z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl overflow-hidden border-r border-white/40 text-left select-none rounded-l-[42px] ${
          isOpen ? 'translate-x-0' : '-translate-x-full invisible pointer-events-none'
        }`}
      >
        {/* Layered backgrounds for all 4 themes with silky-smooth crossfade transition */}
        {WEATHER_THEMES.map((theme) => (
          <div
            key={theme.id}
            className={`absolute top-0 bottom-0 left-0 h-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
              theme.id === currentTheme.id ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
            style={{
              width: '100cqw',
              minWidth: '364px',
              backgroundImage: `${theme.gradientOverlay}, url('${theme.imageUrl}')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {theme.id === 'sun' && (
              <div className="sun-glow absolute top-0 left-0 w-48 h-48 rounded-full bg-amber-300/25 blur-2xl pointer-events-none" />
            )}
            {theme.hasRainOverlay && (
              <div className="rain-overlay absolute inset-0 pointer-events-none opacity-70" />
            )}
            {theme.hasLightningOverlay && (
              <div className="lightning-flash absolute inset-0 bg-blue-100 pointer-events-none" />
            )}
          </div>
        ))}

        {/* Luminous glass layer */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none z-0" />

        {/* Inner Content */}
        <div className="relative z-10 flex flex-col h-full px-3.5 py-3.5 justify-between overflow-y-auto no-scrollbar">
          <div>
            {/* Top Header: Editar (pill) + Pastinha com total (orange pill) + Botão de recolher */}
            <div className="flex items-center justify-between pb-2.5 pt-0.5">
              {/* Botão Editar: pill branca */}
              <button
                type="button"
                onClick={() => setIsManageMode(!isManageMode)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                  isManageMode
                    ? 'bg-orange-500 text-white shadow-orange-500/30'
                    : 'bg-white/95 hover:bg-white text-slate-800'
                }`}
                title={isManageMode ? 'Concluir edição' : 'Editar pastas'}
              >
                {isManageMode ? 'OK' : 'Editar'}
              </button>

              {/* Pastinha com o total de pastas: pill laranja */}
              <button
                type="button"
                onClick={handleOpenNewFolder}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#de7649] hover:bg-[#cf693d] text-white rounded-full font-bold text-xs shadow-md shadow-orange-500/25 transition-transform active:scale-95 cursor-pointer"
                title="Criar nova pasta"
              >
                <FolderPlus className="w-3.5 h-3.5 stroke-[2.2]" />
                <span className="text-xs">{folders.length}</span>
              </button>

              {/* Botão de recolher barra lateral com linha alaranjadinha */}
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-[#de7649] hover:text-[#cf693d] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-opacity cursor-pointer"
                title="Recolher barra lateral"
                aria-label="Recolher barra lateral"
              >
                <SidebarToggleIcon className="w-5 h-5 stroke-[1.9]" />
              </button>
            </div>

            {/* Main Navigation Items com textos e ícones brancos originais (sem alterar cor das pastas) */}
            <nav className="mt-2 space-y-0.5">
              {/* Início / Hoje */}
              <button
                onClick={() => {
                  onNavigate('inicio');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === 'inicio'
                    ? 'bg-[#c27847] text-white shadow-md border border-white/30 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                    : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  <span>Hoje</span>
                </div>
              </button>

              {/* Todas as notas */}
              <button
                onClick={() => {
                  onNavigate('notas', 'all');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === 'all'
                    ? 'bg-[#c27847] text-white shadow-md border border-white/30 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                    : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  <span>Todas as notas</span>
                </div>
                <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {allCount}
                </span>
              </button>

              {/* Favoritos */}
              <button
                onClick={() => {
                  onNavigate('notas', 'fav');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === 'fav'
                    ? 'bg-[#c27847] text-white shadow-md border border-white/30 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                    : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  <span>Favoritos</span>
                </div>
                <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {favCount}
                </span>
              </button>

              {/* Folders hierarchy: cores brancas originais preservadas nas pastas */}
              <div className="pt-1.5 border-t border-white/15 space-y-0.5">
                {rootFolders.map((root) => {
                  const subItems = getSubfolders(root.n);
                  const isOpen = !!openGroups[root.n];
                  const rootCount = getFolderCount(root.n);
                  const RootIconComp = getFolderIconComponent(root.i);

                  return (
                    <div key={root.id} className="space-y-0.5">
                      {/* Root Folder Item com ícone e texto brancos originais */}
                      <div
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeNav === root.n
                            ? 'bg-[#c27847] text-white shadow-sm font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                            : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
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
                          className="flex items-center gap-2 flex-1 min-w-0"
                        >
                          <RootIconComp className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] shrink-0" />
                          <span className="truncate">{root.n}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isManageMode && (
                            <div className="flex items-center gap-1 mr-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartRename(root);
                                }}
                                className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                                title="Editar pasta e ícone"
                              >
                                <Pencil className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFolderToDelete(root);
                                }}
                                className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer"
                                title="Excluir pasta"
                              >
                                <Trash2 className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                              </button>
                            </div>
                          )}
                          <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            {rootCount}
                          </span>
                          {subItems.length > 0 && (
                            <button onClick={() => toggleGroup(root.n)} className="p-0.5 text-white">
                              {isOpen ? (
                                <ChevronDown className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subfolders list */}
                      {isOpen && subItems.length > 0 && (
                        <div className="pl-4 space-y-0.5 border-l border-white/25 ml-2.5 my-0.5">
                          {subItems.map((sub) => {
                            const subPath = `${root.n}/${sub.n}`;
                            const subCount = getFolderCount(subPath);
                            const SubIconComp = getFolderIconComponent(sub.i);

                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  onNavigate('notas', subPath);
                                  onClose();
                                }}
                                className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                  activeNav === subPath
                                    ? 'bg-[#c27847]/90 text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                                    : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <SubIconComp className="w-3 h-3 text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] shrink-0" />
                                  <span className="truncate">{sub.n}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isManageMode && (
                                    <div className="flex items-center gap-1 mr-0.5">
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartRename(sub);
                                        }}
                                        className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                                        title="Editar pasta e ícone"
                                      >
                                        <Pencil className="w-3 h-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                                      </span>
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFolderToDelete(sub);
                                        }}
                                        className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer inline-flex items-center justify-center"
                                        title="Excluir pasta"
                                      >
                                        <Trash2 className="w-3 h-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                                      </span>
                                    </div>
                                  )}
                                  <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                    {subCount}
                                  </span>
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

              {/* Atalhos: Calendário, Fixadas, Arquivados, Lixeira */}
              <div className="pt-1.5 border-t border-white/15 space-y-0.5">
                <button
                  onClick={() => {
                    onNavigate('calendario');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeNav === 'calendario'
                      ? 'bg-[#c27847] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                      : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    <span>Calendário</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('notas', 'fix');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeNav === 'fix'
                      ? 'bg-[#c27847] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                      : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Pin className="w-4 h-4 text-amber-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    <span>Fixadas</span>
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {pinCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('notas', 'arq');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeNav === 'arq'
                      ? 'bg-[#c27847] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                      : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Archive className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    <span>Arquivados</span>
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {archiveCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('notas', 'lix');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeNav === 'lix'
                      ? 'bg-[#c27847] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                      : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trash2 className="w-4 h-4 text-red-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    <span>Lixeira</span>
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {trashCount}
                  </span>
                </button>
              </div>
            </nav>
          </div>

          {/* Bottom Settings Link */}
          <div className="pt-2 border-t border-white/15">
            <button
              onClick={() => {
                onNavigate('configuracoes');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeNav === 'configuracoes'
                  ? 'bg-[#c27847] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                  : 'text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white/25 border border-white/40 flex items-center justify-center flex-shrink-0">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <Settings className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <span className="truncate">Configurações</span>
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] truncate max-w-[90px]">
                {profile?.n || 'Orlando'}
              </span>
            </button>
          </div>
        </div>

        {/* Modal: Nova Pasta */}
        {showNewFolderModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget && !showExtendedIconPicker) {
                setShowNewFolderModal(false);
              }
            }}
            className="absolute inset-0 bg-black/35 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-fadeIn"
          >
            <form
              onSubmit={handleCreateFolderSubmit}
              className="w-full bg-white/95 border border-white/80 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl text-left space-y-3.5 text-slate-800 max-h-[92vh] overflow-y-auto no-scrollbar relative"
            >
              {/* Header: Nova pasta + Close circle */}
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800 tracking-tight">Nova pasta</h3>
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Nome da pasta */}
              <div>
                <input
                  value={newFolderName}
                  onChange={handleFolderNameChange}
                  placeholder="Nome da pasta"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 shadow-sm"
                  autoFocus
                />
              </div>

              {/* Seletor de Ícone: Ao clicar, estende a tela da direita para a esquerda com os 39 ícones */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ícone</label>
                <button
                  type="button"
                  onClick={() => {
                    setIconPickerTargetMode('create');
                    setIconPickerSearch('');
                    setShowExtendedIconPicker(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-800 text-xs sm:text-sm shadow-sm hover:border-slate-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                      <SelectedNewFolderIconComp className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                      {getFolderIconLabel(newFolderIcon)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-[10px] text-slate-500 mt-1 pl-1">
                  Sugestão automática pelo nome; toque para escolher entre 39 opções.
                </p>
              </div>

              {/* Criar em (Hierarquia) */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Criar em</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsParentPickerOpen(!isParentPickerOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-800 text-xs sm:text-sm shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                        {newFolderParent || 'Pasta principal'}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isParentPickerOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isParentPickerOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 py-1 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setNewFolderParent('');
                          setIsParentPickerOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors text-left ${
                          !newFolderParent ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5" />
                        <span>Pasta principal</span>
                      </button>
                      {rootFolders.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setNewFolderParent(f.n);
                            setIsParentPickerOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors text-left ${
                            newFolderParent === f.n ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Folder className="w-3.5 h-3.5" />
                          <span>{f.n}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de ação: Criar pasta */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="w-full py-3 rounded-2xl bg-[#71a3b2] hover:bg-[#5f93a3] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-slate-400/25 cursor-pointer transition-all text-center"
                >
                  Criar pasta
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Editar Pasta */}
        {editingFolder && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget && !showExtendedIconPicker) {
                setEditingFolder(null);
              }
            }}
            className="absolute inset-0 bg-black/35 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-fadeIn"
          >
            <form
              onSubmit={handleRenameSubmit}
              className="w-full bg-white/95 border border-white/80 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl text-left space-y-3.5 text-slate-800 max-h-[92vh] overflow-y-auto no-scrollbar relative"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Pencil className="w-4 h-4 text-slate-700" />
                  <h3 className="text-base font-bold text-slate-800 tracking-tight">Editar Pasta</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingFolder(null)}
                  className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nome da pasta</label>
                <input
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  placeholder="Nome da pasta"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-sm"
                  autoFocus
                />
              </div>

              {/* Seletor de Ícone para a pasta existente: abre a tela estendida */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ícone da pasta</label>
                <button
                  type="button"
                  onClick={() => {
                    setIconPickerTargetMode('edit');
                    setIconPickerSearch('');
                    setShowExtendedIconPicker(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-800 text-xs sm:text-sm shadow-sm hover:border-slate-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <SelectedEditFolderIconComp className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                      {getFolderIconLabel(editingFolderIcon)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingFolder(null)}
                  className="flex-1 py-2.5 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!editingFolderName.trim()}
                  className="flex-1 py-2.5 text-xs rounded-xl bg-[#de7649] text-white font-semibold hover:bg-[#cf693d] disabled:opacity-50 shadow-md cursor-pointer transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Confirmar Exclusão de Pasta */}
        {folderToDelete && (
          <div
            onClick={() => setFolderToDelete(null)}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[245px] bg-white/95 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl text-center space-y-3 border border-white/80 text-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 mx-auto flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Excluir pasta?</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Deseja excluir a pasta <strong>"{folderToDelete.n}"</strong>? As notas vinculadas não serão perdidas e passarão para "Sem pasta".
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFolderToDelete(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteFolder(folderToDelete.id);
                    setFolderToDelete(null);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TELA ESTENDIDA (Estende da direita para a esquerda) - Exatamente igual ao print */}
        <div
          className={`absolute inset-0 z-[60] transform transition-transform duration-300 ease-out flex flex-col ${
            showExtendedIconPicker ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}
        >
          <div className="h-full w-full bg-gradient-to-b from-[#e3edf2]/95 via-white/95 to-[#faeede]/95 border-l border-white/80 shadow-2xl backdrop-blur-2xl flex flex-col p-4 sm:p-5 text-slate-800 select-none">
            {/* Top Bar: PERSONALIZE A PASTA + Escolha um ícone + Botão X */}
            <div className="flex justify-between items-start pb-1">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  PERSONALIZE A PASTA
                </p>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Escolha um ícone
                </h2>
              </div>
              <button
                type="button"
                onClick={handleConcludeIconPicker}
                className="w-8 h-8 rounded-full bg-white/90 border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                title="Fechar seletor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Toque em um desenho para aplicá-lo à pasta.
            </p>

            {/* Buscar ícone... */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={iconPickerSearch}
                onChange={(e) => setIconPickerSearch(e.target.value)}
                placeholder="Buscar ícone..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white border border-slate-200/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 shadow-xs"
              />
              {iconPickerSearch && (
                <button
                  type="button"
                  onClick={() => setIconPickerSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Lista de ícones e total de opções */}
            <div className="flex justify-between items-center text-xs mb-2 px-1">
              <span className="font-semibold text-slate-500">Lista de ícones</span>
              <span className="font-bold text-[#1b6b80]">{filteredIcons.length} opções</span>
            </div>

            {/* Grid com exatamente os 39 ícones (4 colunas) */}
            <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 pb-3 flex-1 no-scrollbar">
              {filteredIcons.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = activePickerIconId === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectIconInExtended(opt.id)}
                    className={`w-full h-[76px] rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#e8f3f6] border-2 border-[#5497aa] text-slate-900 shadow-xs font-semibold'
                        : 'bg-white/85 hover:bg-white border border-slate-200/70 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 text-[#2d6f82]">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                    <IconComp className="w-5 h-5 mb-1 shrink-0" />
                    <span className="text-[10px] leading-tight text-center font-medium line-clamp-2 px-0.5 max-w-full">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Bar: Selecionado + Botão Concluir (recolhe a tela e volta para Nova pasta) */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs text-slate-600 truncate max-w-[140px]">
                Selecionado: <strong className="text-slate-800">{getFolderIconLabel(activePickerIconId)}</strong>
              </span>

              <button
                type="button"
                onClick={handleConcludeIconPicker}
                className="px-5 py-2 rounded-full bg-[#6aa4b4] hover:bg-[#5b94a4] text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
