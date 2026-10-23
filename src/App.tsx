/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WEATHER_THEMES, WeatherTheme } from './themes.ts';
import { Note, Appointment, FolderItem, UserProfile, AppSettings } from './types.ts';
import {
  loadNotes,
  saveNotes,
  loadAppointments,
  saveAppointments,
  loadFolders,
  saveFolders,
  loadProfile,
  saveProfile,
  loadSettings,
  saveSettings,
  loadBackups,
  saveBackups,
  BackupItem,
} from './storage.ts';

import { HomeScreen } from './components/HomeScreen.tsx';
import { NotesScreen } from './components/NotesScreen.tsx';
import { NoteEditorScreen } from './components/NoteEditorScreen.tsx';
import { CalendarScreen } from './components/CalendarScreen.tsx';
import { SettingsScreen } from './components/SettingsScreen.tsx';
import { SidebarDrawer } from './components/SidebarDrawer.tsx';

type ActiveScreen = 'home' | 'notes' | 'note_editor' | 'calendar' | 'settings';

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [previousScreen, setPreviousScreen] = useState<ActiveScreen>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(22);
  const [calendarInitialOpenCreate, setCalendarInitialOpenCreate] = useState(false);

  // Data states
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadAppointments());
  const [folders, setFolders] = useState<FolderItem[]>(() => loadFolders());
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [backups, setBackups] = useState<BackupItem[]>(() => loadBackups());

  // Active navigation filter & active note
  const [activeNav, setActiveNav] = useState('inicio');
  const [activeFolderFilter, setActiveFolderFilter] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [notesSearchQuery, setNotesSearchQuery] = useState('');

  // Silent live weather running behind the scenes
  const [liveTemp, setLiveTemp] = useState<string | null>(null);
  const [liveCondition, setLiveCondition] = useState<string | null>(null);

  // Background weather updater
  useEffect(() => {
    let isMounted = true;

    const updateWeatherSilently = async () => {
      try {
        const weather = await getSilentLiveWeather();
        if (!isMounted) return;

        setLiveTemp(weather.temperature);
        setLiveCondition(weather.condition);

        const matchedIdx = WEATHER_THEMES.findIndex((t) => t.id === weather.themeId);
        if (matchedIdx !== -1) {
          setThemeIndex(matchedIdx);
        }
      } catch {
        if (isMounted) {
          setThemeIndex((current) => (current + 1) % WEATHER_THEMES.length);
        }
      }
    };

    updateWeatherSilently();
    const interval = setInterval(updateWeatherSilently, 120000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Save appointments whenever they change
  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  // Save folders whenever they change
  useEffect(() => {
    saveFolders(folders);
  }, [folders]);

  const currentTheme: WeatherTheme = WEATHER_THEMES[themeIndex];
  const temperatureDisplay = currentTheme.temperature;
  const conditionDisplay = currentTheme.condition;

  // Folder paths list
  const allFolderPaths = folders.map((f) => (f.p ? `${f.p}/${f.n}` : f.n));

  // Handlers
  const handleNavigate = (target: string, folderKey?: string | null) => {
    setCalendarInitialOpenCreate(false);
    if (target === 'inicio') {
      setActiveNav('inicio');
      setActiveScreen('home');
    } else if (target === 'notas') {
      setActiveNav(folderKey || 'all');
      setActiveFolderFilter(folderKey || null);
      setNotesSearchQuery('');
      setActiveScreen('notes');
    } else if (target === 'calendario') {
      setActiveNav('calendario');
      setActiveScreen('calendar');
    } else if (target === 'configuracoes') {
      setActiveNav('configuracoes');
      setActiveScreen('settings');
    }
  };

  const handleOpenNote = (note: Note) => {
    setPreviousScreen(activeScreen);
    setActiveNote(note);
    setActiveScreen('note_editor');
  };

  const handleNewNote = () => {
    setPreviousScreen(activeScreen);
    const newId = `note_${Date.now()}`;
    const defaultFolder =
      activeFolderFilter && !['all', 'fav', 'lix', 'arq'].includes(activeFolderFilter)
        ? activeFolderFilter
        : 'Sem pasta';

    const freshNote: Note = {
      id: newId,
      titulo: 'Nova nota',
      texto: '',
      p: defaultFolder,
      t: Date.now(),
      mt: Date.now(),
      fm: 'line',
      draft: '1',
    };

    setNotes([freshNote, ...notes]);
    setActiveNote(freshNote);
    setActiveScreen('note_editor');
  };

  const handleSaveNote = (updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    if (activeNote && activeNote.id === updated.id) {
      setActiveNote(updated);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, tr: '1', mt: Date.now() } : n))
    );
  };

  const handleRestoreFromTrash = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, tr: undefined, mt: Date.now() } : n))
    );
  };

  const handleEmptyTrash = () => {
    if (confirm('Deseja realmente esvaziar a lixeira?')) {
      setNotes((prev) => prev.filter((n) => n.tr !== '1'));
    }
  };

  const handleToggleFavorite = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, fv: n.fv === '1' ? undefined : '1', mt: Date.now() } : n
      )
    );
  };

  const handleMoveNotes = (noteIds: string[], targetFolder: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        noteIds.includes(n.id) ? { ...n, p: targetFolder, mt: Date.now() } : n
      )
    );
  };

  const handleSaveAppointment = (appt: Appointment) => {
    setAppointments((prev) => {
      const exists = prev.some((e) => e.id === appt.id);
      if (exists) {
        return prev.map((e) => (e.id === appt.id ? appt : e));
      }
      return [appt, ...prev];
    });
  };

  const handleDeleteAppointment = (id: string | number) => {
    setAppointments((prev) => prev.filter((e) => e.id !== id));
  };

  // Folder management
  const handleCreateFolder = (name: string, parentPath?: string, icon?: string) => {
    const newF: FolderItem = {
      id: `f_${Date.now()}`,
      n: name,
      p: parentPath,
      i: icon || 'folder',
    };
    setFolders([...folders, newF]);
  };

  const handleDeleteFolder = (folderId: string) => {
    const target = folders.find((f) => f.id === folderId);
    if (!target) return;
    if (confirm(`Excluir a pasta "${target.n}"? As notas serão mantidas como "Sem pasta".`)) {
      setFolders(folders.filter((f) => f.id !== folderId));
      const targetPath = target.p ? `${target.p}/${target.n}` : target.n;
      setNotes((prev) =>
        prev.map((n) => (n.p && n.p.startsWith(targetPath) ? { ...n, p: 'Sem pasta' } : n))
      );
    }
  };

  const handleRenameFolder = (folderId: string, newName: string, newIcon?: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const target = folders.find((f) => f.id === folderId);
    if (!target) return;

    const oldName = target.n;
    const oldPath = target.p ? `${target.p}/${oldName}` : oldName;
    const newPath = target.p ? `${target.p}/${trimmed}` : trimmed;

    // Update folders list
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          return { ...f, n: trimmed, i: newIcon ?? f.i };
        }
        if (!target.p && f.p === oldName) {
          return { ...f, p: trimmed };
        }
        return f;
      })
    );

    // Update notes path
    setNotes((prev) =>
      prev.map((note) => {
        if (!note.p) return note;
        if (note.p === oldPath) {
          return { ...note, p: newPath, mt: Date.now() };
        }
        if (note.p.startsWith(`${oldPath}/`)) {
          return { ...note, p: `${newPath}${note.p.slice(oldPath.length)}`, mt: Date.now() };
        }
        return note;
      })
    );

    // Update active filter if user is on this folder
    if (activeFolderFilter === oldPath) {
      setActiveFolderFilter(newPath);
      setActiveNav(newPath);
    }
  };

  // Backup & Import/Export
  const handleCreateBackup = () => {
    const item: BackupItem = {
      t: Date.now(),
      n: notes.filter((n) => !n.tr).length,
      e: appointments.length,
      data: {
        notas: notes,
        compromissos: appointments,
        pastas: folders,
        perfil: profile,
        ajustes: settings,
      },
    };
    // Always keep only 1 single latest backup
    const nextBackups = [item];
    setBackups(nextBackups);
    saveBackups(nextBackups);

    // Immediately trigger JSON download
    const data = {
      app: 'AnoteVocê',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      notas: notes,
      compromissos: appointments,
      pastas: folders,
      perfil: profile,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anotevoce-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteBackup = () => {
    if (confirm('Deseja excluir o ponto de restauração salvo?')) {
      setBackups([]);
      saveBackups([]);
    }
  };

  const handleRestoreBackup = (bItem: BackupItem) => {
    if (confirm('Restaurar este backup? Os dados atuais serão substituídos.')) {
      setNotes(bItem.data.notas);
      setAppointments(bItem.data.compromissos);
      setFolders(bItem.data.pastas);
      setProfile(bItem.data.perfil);
      setSettings(bItem.data.ajustes);
      saveProfile(bItem.data.perfil);
      saveSettings(bItem.data.ajustes);
      alert('Backup restaurado com sucesso!');
    }
  };

  const handleExportJson = () => {
    const data = {
      app: 'AnoteVocê',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      notas: notes,
      compromissos: appointments,
      pastas: folders,
      perfil: profile,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anotevoce-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTxt = () => {
    let txt = `ANOTEVOCÊ — EXPORTAÇÃO\nData: ${new Date().toLocaleString('pt-BR')}\n\n`;
    txt += `=== NOTAS (${notes.length}) ===\n\n`;
    notes.forEach((n) => {
      txt += `Título: ${n.titulo}\nPasta: ${n.p || 'Sem pasta'}\nData: ${new Date(n.t).toLocaleString('pt-BR')}\nConteúdo:\n${n.t0 || n.texto || ''}\n\n---\n\n`;
    });
    txt += `=== COMPROMISSOS (${appointments.length}) ===\n\n`;
    appointments.forEach((e) => {
      txt += `Título: ${e.t}\nData: ${e.d} (${e.s} - ${e.e})\nCategoria: ${e.g}\nLocal: ${e.l || 'N/A'}\n\n`;
    });
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anotevoce-notas-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = String(reader.result || '');
        if (file.name.endsWith('.json')) {
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed.notas)) {
              setNotes((prev) => [...parsed.notas, ...prev]);
            }
            if (Array.isArray(parsed.compromissos)) {
              setAppointments((prev) => [...parsed.compromissos, ...prev]);
            }
            alert('Arquivo JSON importado com sucesso!');
            return;
          } catch {
            // treat as regular text
          }
        }
        // Add as note
        const newNote: Note = {
          id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          titulo: file.name.replace(/\.[^/.]+$/, ''),
          texto: content.slice(0, 140),
          t0: content,
          p: 'Importadas',
          t: Date.now(),
          mt: Date.now(),
          fm: 'line',
        };
        setNotes((prev) => [newNote, ...prev]);
        alert(`Arquivo "${file.name}" importado como nota!`);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="bg-slate-950 min-h-screen w-full flex flex-col justify-center items-center font-sans select-none overflow-hidden p-2 sm:p-4">
      {/* Phone Mockup Frame (Phone chassis body) */}
      <main className="relative w-full max-w-[380px] h-[min(812px,96vh)] max-h-[844px] rounded-[50px] p-[8px] bg-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-black/60 flex flex-col justify-between isolate">
        {/* Inner Phone Screen (strictly clipped to phone body screen radius) */}
        <div
          className="relative w-full h-full rounded-[42px] overflow-hidden flex flex-col justify-between isolate @container bg-slate-900"
          style={{
            clipPath: 'inset(0 round 42px)',
            WebkitClipPath: 'inset(0 round 42px)',
          }}
        >
          {/* Layered backgrounds for all 4 themes with silky-smooth crossfade transition */}
          {WEATHER_THEMES.map((theme, idx) => (
            <div
              key={theme.id}
              className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out ${
                themeIndex === idx ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage:
                  activeScreen === 'home' || activeScreen === 'notes' || activeScreen === 'calendar' || activeScreen === 'settings'
                    ? `${theme.gradientOverlay}, url('${theme.imageUrl}')`
                    : `linear-gradient(180deg, rgba(246, 250, 252, 0.90) 0%, rgba(234, 242, 247, 0.94) 50%, rgba(224, 236, 242, 0.96) 100%), url('${theme.imageUrl}')`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Dynamic weather effects: strictly contained inside the screen */}
              {(activeScreen === 'home' || activeScreen === 'notes' || activeScreen === 'calendar' || activeScreen === 'settings') && theme.hasRainOverlay && (
                <div className="rain-overlay absolute inset-0 pointer-events-none opacity-70" />
              )}
              {(activeScreen === 'home' || activeScreen === 'notes' || activeScreen === 'calendar' || activeScreen === 'settings') && theme.hasLightningOverlay && (
                <div className="lightning-flash absolute inset-0 bg-blue-100 pointer-events-none" />
              )}
              {(activeScreen === 'home' || activeScreen === 'notes' || activeScreen === 'calendar' || activeScreen === 'settings') && theme.id === 'sun' && (
                <div className="sun-glow absolute top-0 left-0 w-48 h-48 rounded-full bg-amber-300/25 blur-2xl pointer-events-none" />
              )}
            </div>
          ))}

          {/* Dynamic Island */}
          <div className="flex absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 items-center justify-between px-2.5 shadow-sm border border-white/5 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-blue-900" />
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
          </div>

        {/* Active Screen Router */}
        {activeScreen === 'home' && (
          <HomeScreen
            profile={profile}
            currentTheme={currentTheme}
            temperatureDisplay={temperatureDisplay}
            conditionDisplay={conditionDisplay}
            onCycleTheme={() => setThemeIndex((c) => (c + 1) % WEATHER_THEMES.length)}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenProfile={() => setActiveScreen('settings')}
            onOpenCalendar={() => {
              setActiveNav('calendario');
              setCalendarInitialOpenCreate(false);
              setActiveScreen('calendar');
            }}
            onOpenNotes={(q) => {
              setActiveNav('all');
              setActiveFolderFilter(null);
              setNotesSearchQuery(q || '');
              setActiveScreen('notes');
            }}
            onOpenNewNote={handleNewNote}
            onOpenNewEvent={() => {
              setActiveNav('calendario');
              setCalendarInitialOpenCreate(true);
              setActiveScreen('calendar');
            }}
            onSelectEvent={(ev) => {
              setActiveNav('calendario');
              setCalendarInitialOpenCreate(false);
              setActiveScreen('calendar');
            }}
            appointments={appointments}
          />
        )}

        {activeScreen === 'notes' && (
          <NotesScreen
            notes={notes}
            currentTheme={currentTheme}
            activeFolderFilter={activeFolderFilter}
            initialSearchQuery={notesSearchQuery}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenNote={handleOpenNote}
            onNewNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
            onToggleFavorite={handleToggleFavorite}
            onMoveNotes={handleMoveNotes}
            onEmptyTrash={handleEmptyTrash}
            onRestoreFromTrash={handleRestoreFromTrash}
          />
        )}

        {activeScreen === 'note_editor' && activeNote && (
          <NoteEditorScreen
            note={activeNote}
            currentTheme={currentTheme}
            allFolderPaths={allFolderPaths}
            onBack={() => {
              setActiveScreen(previousScreen === 'home' ? 'home' : 'notes');
            }}
            onSaveNote={handleSaveNote}
            onDeleteNote={(id) => {
              handleDeleteNote(id);
              setActiveScreen(previousScreen === 'home' ? 'home' : 'notes');
            }}
            onOpenCalendar={() => {
              setActiveNav('calendario');
              setCalendarInitialOpenCreate(false);
              setActiveScreen('calendar');
            }}
          />
        )}

        {activeScreen === 'calendar' && (
          <CalendarScreen
            appointments={appointments}
            currentTheme={currentTheme}
            initialOpenCreate={calendarInitialOpenCreate}
            onBack={() => {
              setCalendarInitialOpenCreate(false);
              setActiveScreen('home');
            }}
            onSaveAppointment={(appt) => {
              handleSaveAppointment(appt);
              setCalendarInitialOpenCreate(false);
            }}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            currentTheme={currentTheme}
            profile={profile}
            settings={settings}
            backups={backups}
            onBack={() => setActiveScreen('home')}
            onUpdateProfile={(p) => {
              setProfile(p);
              saveProfile(p);
            }}
            onUpdateSettings={(s) => {
              setSettings(s);
              saveSettings(s);
            }}
            onCreateBackup={handleCreateBackup}
            onRestoreBackup={handleRestoreBackup}
            onDeleteBackup={handleDeleteBackup}
            onExportJson={handleExportJson}
            onExportTxt={handleExportTxt}
            onImportFiles={handleImportFiles}
          />
        )}

        {/* Sidebar Drawer */}
        <SidebarDrawer
          isOpen={isDrawerOpen}
          currentTheme={currentTheme}
          activeNav={activeNav}
          notes={notes}
          folders={folders}
          profile={profile}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={handleNavigate}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
          onRenameFolder={handleRenameFolder}
        />
        </div>
      </main>
    </div>
  );
}
