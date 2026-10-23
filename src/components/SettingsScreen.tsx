/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  User,
  HardDrive,
  Download,
  Upload,
  Sun,
  Type,
  Bell,
  Calendar,
  Camera,
  Check,
  AlertCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { UserProfile, AppSettings } from '../types.ts';
import { WeatherTheme } from '../themes.ts';
import { BackupItem } from '../storage.ts';

interface SettingsScreenProps {
  currentTheme: WeatherTheme;
  profile: UserProfile;
  settings: AppSettings;
  backups: BackupItem[];
  onBack: () => void;
  onUpdateProfile: (p: UserProfile) => void;
  onUpdateSettings: (s: AppSettings) => void;
  onCreateBackup: () => void;
  onRestoreBackup: (backup: BackupItem) => void;
  onDeleteBackup?: () => void;
  onExportJson: () => void;
  onExportTxt: () => void;
  onImportFiles: (files: FileList) => void;
}

export function SettingsScreen({
  currentTheme,
  profile,
  settings,
  backups,
  onBack,
  onUpdateProfile,
  onUpdateSettings,
  onCreateBackup,
  onRestoreBackup,
  onDeleteBackup,
  onExportJson,
  onExportTxt,
  onImportFiles,
}: SettingsScreenProps) {
  const [nameInput, setNameInput] = useState(profile.n || 'Orlando');
  const [emailInput, setEmailInput] = useState(profile.e || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const importFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const isDarkTop = currentTheme.isDarkTopText;
  const topTextColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const topTextSubColor = isDarkTop ? 'text-slate-600' : 'text-white/80';
  const navIconColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const cardStyleClass = isDarkTop ? 'ios-glass-card-light' : 'ios-glass-card-dark';
  const dividerClass = isDarkTop ? 'divide-black/10' : 'divide-white/10';
  const borderSubtleClass = isDarkTop ? 'border-black/10' : 'border-white/10';
  const btnGlassClass = isDarkTop
    ? 'bg-black/10 hover:bg-black/15 text-slate-800'
    : 'bg-white/15 hover:bg-white/25 text-white';
  const btnInactiveClass = isDarkTop ? 'bg-black/10 text-slate-700' : 'bg-white/10 text-white/70';
  const homeIndicatorClass = isDarkTop ? 'bg-slate-700/60' : 'bg-white/40';

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...profile,
      n: nameInput.trim() || 'Orlando',
      e: emailInput.trim(),
      avatar,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        onUpdateProfile({
          ...profile,
          avatar: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative z-10 flex flex-col h-full px-5 pt-2 pb-2.5 sm:px-6 sm:pt-3 sm:pb-3.5 justify-between text-left">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onBack}
            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${navIconColor}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className={`text-xl font-bold tracking-tight ${topTextColor}`}>
            Configurações
          </h2>
        </div>

        {/* Profile Card */}
        <div className={`${cardStyleClass} rounded-2xl p-3 flex items-center gap-3.5`}>
          <div className="relative">
            <div className={`w-12 h-12 rounded-full overflow-hidden ${isDarkTop ? 'bg-black/15 border-slate-700/60' : 'bg-white/20 border-white'} border-2 flex items-center justify-center`}>
              {avatar ? (
                <img src={avatar} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <User className={`w-6 h-6 ${isDarkTop ? 'text-slate-700' : 'text-white'}`} />
              )}
            </div>
            <button
              onClick={() => avatarFileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center cursor-pointer shadow-sm hover:bg-orange-600 transition-colors"
              title="Trocar foto"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              ref={avatarFileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 min-w-0">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleSaveProfile}
              placeholder="Seu nome"
              className={`font-bold text-sm bg-transparent border-none p-0 focus:outline-none w-full ${topTextColor}`}
            />
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onBlur={handleSaveProfile}
              placeholder="Adicionar e-mail..."
              className={`text-xs bg-transparent border-none p-0 focus:outline-none w-full ${topTextSubColor}`}
            />
          </div>
        </div>
      </div>

      {/* Settings Options Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-4 text-xs">
        {/* Section: Backup e Restauração Simplificados */}
        <div>
          <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 px-1 ${topTextSubColor}`}>
            Backup e Restauração
          </h4>
          <div className={`${cardStyleClass} rounded-2xl overflow-hidden divide-y ${dividerClass}`}>
            {/* 1. Criar e Baixar Backup */}
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className={`font-semibold ${topTextColor} block text-[12.5px] leading-tight`}>
                      Fazer Backup
                    </span>
                    <span className={`text-[10px] ${topTextSubColor} block truncate`}>
                      Salva e baixa o arquivo .json no aparelho
                    </span>
                  </div>
                </div>
                <button
                  onClick={onCreateBackup}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[11px] shadow-sm cursor-pointer transition-colors flex-shrink-0"
                >
                  Criar e Baixar
                </button>
              </div>

              {/* Ponto de restauração único salvo */}
              {backups.length > 0 && (
                <div className={`p-2 rounded-xl ${isDarkTop ? 'bg-black/5' : 'bg-white/10'} flex items-center justify-between`}>
                  <div className="min-w-0 pr-2">
                    <span className={`text-[9.5px] ${topTextSubColor} uppercase font-semibold block leading-none`}>
                      Último backup salvo:
                    </span>
                    <span className={`text-[11px] font-medium ${topTextColor} block truncate mt-0.5`}>
                      {new Date(backups[0].t).toLocaleDateString('pt-BR')} às {new Date(backups[0].t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ({backups[0].n} notas)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onRestoreBackup(backups[0])}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-medium cursor-pointer shadow-sm transition-colors"
                    >
                      Restaurar
                    </button>
                    {onDeleteBackup && (
                      <button
                        onClick={onDeleteBackup}
                        className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                        title="Excluir este ponto de restauração"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Restaurar de Arquivo */}
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className={`font-semibold ${topTextColor} block text-[12.5px] leading-tight`}>
                    Restaurar Backup
                  </span>
                  <span className={`text-[10px] ${topTextSubColor} block truncate`}>
                    Abrir arquivo .json salvo anteriormente
                  </span>
                </div>
              </div>
              <button
                onClick={() => importFileRef.current?.click()}
                className={`px-3 py-1.5 rounded-xl ${btnGlassClass} font-semibold text-[11px] cursor-pointer transition-colors flex-shrink-0 border ${isDarkTop ? 'border-slate-300' : 'border-white/20'}`}
              >
                Restaurar
              </button>
            </div>

            {/* 3. Exportar Texto simples */}
            <div className="px-3 py-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span className={`font-medium ${topTextColor}`}>
                  Exportar notas em texto (.txt)
                </span>
              </div>
              <button
                onClick={onExportTxt}
                className={`text-[10px] px-2 py-0.5 rounded-lg ${btnGlassClass} hover:opacity-80 cursor-pointer transition-colors`}
              >
                Baixar TXT
              </button>
            </div>

            <input
              ref={importFileRef}
              type="file"
              accept=".txt,.md,.json"
              multiple
              onChange={(e) => e.target.files && onImportFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Section: Aparência */}
        <div>
          <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 px-1 ${topTextSubColor}`}>
            Aparência
          </h4>
          <div className={`${cardStyleClass} rounded-2xl overflow-hidden divide-y ${dividerClass}`}>
            {/* Font size */}
            <div className="p-3 flex items-center justify-between">
              <div className={`flex items-center gap-2 ${topTextColor}`}>
                <Type className="w-4 h-4 text-orange-400" />
                <span className="font-semibold">Tamanho do texto</span>
              </div>
              <div className="flex items-center gap-1">
                {['Pequeno', 'Padrão', 'Grande'].map((sizeName, idx) => (
                  <button
                    key={sizeName}
                    onClick={() => onUpdateSettings({ ...settings, fs: idx })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer transition-colors ${
                      settings.fs === idx ? 'bg-orange-500 text-white shadow-sm' : btnInactiveClass
                    }`}
                  >
                    {sizeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Reminders & Sound */}
            <div className="p-3 flex items-center justify-between">
              <div className={`flex items-center gap-2 ${topTextColor}`}>
                <Bell className="w-4 h-4 text-yellow-400" />
                <div>
                  <span className="font-semibold block leading-tight">Lembretes sonoros</span>
                  <span className={`text-[10px] ${topTextSubColor}`}>Avisos de compromisso</span>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ ...settings, rem: settings.rem ? 0 : 1 })}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.rem ? 'bg-orange-500' : (isDarkTop ? 'bg-black/20' : 'bg-white/20')
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.rem ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section: Calendário */}
        <div>
          <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 px-1 ${topTextSubColor}`}>
            Organização
          </h4>
          <div className={`${cardStyleClass} rounded-2xl p-3 space-y-2.5`}>
            <div className={`flex items-center justify-between ${topTextColor}`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Primeiro dia da semana</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateSettings({ ...settings, wk: 1 })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer transition-colors ${
                    settings.wk === 1 ? 'bg-orange-500 text-white shadow-sm' : btnInactiveClass
                  }`}
                >
                  Segunda
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, wk: 0 })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer transition-colors ${
                    settings.wk === 0 ? 'bg-orange-500 text-white shadow-sm' : btnInactiveClass
                  }`}
                >
                  Domingo
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className={`text-center text-[11px] ${topTextSubColor} pt-2 pb-1`}>
          AnoteVocê · versão 1.0.0
        </p>
      </div>

      <div className={`w-32 h-1 rounded-full mx-auto mt-2 ${homeIndicatorClass}`} />
    </div>
  );
}
