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

  const topTextColor = 'text-[#1b3547]';
  const topTextSubColor = 'text-[#5d7684]';
  const cardStyleClass = 'ios-glass-card-subtle';

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
            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${topTextColor}`}
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
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 border-2 border-white flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <button
              onClick={() => avatarFileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center cursor-pointer shadow-sm"
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
        {/* Section: Dados e backup */}
        <div>
          <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 px-1 ${topTextSubColor}`}>
            Dados e backup
          </h4>
          <div className={`${cardStyleClass} rounded-2xl overflow-hidden divide-y divide-white/10`}>
            {/* Backup options */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  Backup e exportação
                </span>
                <span className="text-[10px] text-white/50">{backups.length} salvos</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={onCreateBackup}
                  className="py-1.5 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-[11px] cursor-pointer"
                >
                  Fazer backup agora
                </button>
                <button
                  onClick={onExportJson}
                  className="py-1.5 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-[11px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Exportar JSON
                </button>
                <button
                  onClick={onExportTxt}
                  className="py-1.5 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-[11px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Exportar TXT
                </button>
                <button
                  onClick={() => importFileRef.current?.click()}
                  className="py-1.5 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-[11px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Restaurar JSON
                </button>
              </div>

              {/* Saved backups list */}
              {backups.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <span className="text-[10px] text-white/60 uppercase font-semibold">Backups recentes</span>
                  {backups.map((bk, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-white/80 py-0.5">
                      <span>{new Date(bk.t).toLocaleString('pt-BR')}</span>
                      <button
                        onClick={() => onRestoreBackup(bk)}
                        className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] cursor-pointer"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Import files */}
            <button
              onClick={() => importFileRef.current?.click()}
              className="w-full p-3 flex items-center justify-between text-white hover:bg-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Importar notas</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
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
          <div className={`${cardStyleClass} rounded-2xl overflow-hidden divide-y divide-white/10`}>
            {/* Font size */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Type className="w-4 h-4 text-orange-400" />
                <span className="font-semibold">Tamanho do texto</span>
              </div>
              <div className="flex items-center gap-1">
                {['Pequeno', 'Padrão', 'Grande'].map((sizeName, idx) => (
                  <button
                    key={sizeName}
                    onClick={() => onUpdateSettings({ ...settings, fs: idx })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer ${
                      settings.fs === idx ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {sizeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Reminders & Sound */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Bell className="w-4 h-4 text-yellow-400" />
                <div>
                  <span className="font-semibold block leading-tight">Lembretes sonoros</span>
                  <span className="text-[10px] text-white/60">Avisos de compromisso</span>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ ...settings, rem: settings.rem ? 0 : 1 })}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.rem ? 'bg-orange-500' : 'bg-white/20'
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
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Primeiro dia da semana</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateSettings({ ...settings, wk: 1 })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer ${
                    settings.wk === 1 ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Segunda
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, wk: 0 })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer ${
                    settings.wk === 0 ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Domingo
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/50 pt-2 pb-1">
          AnoteVocê · versão 1.0.0
        </p>
      </div>

      <div className="w-32 h-1 rounded-full mx-auto mt-2 bg-slate-400/80" />
    </div>
  );
}
