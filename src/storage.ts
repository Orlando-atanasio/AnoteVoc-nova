/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Note, Appointment, FolderItem, UserProfile, AppSettings } from './types.ts';
import {
  INITIAL_NOTES,
  INITIAL_APPOINTMENTS,
  INITIAL_FOLDERS,
  INITIAL_PROFILE,
  INITIAL_SETTINGS,
} from './defaultData.ts';

const NOTES_KEY = 'anote_voce:notes';
const EVENTS_KEY = 'anote_voce:events';
const FOLDERS_KEY = 'anote_voce:folders';
const PROFILE_KEY = 'anote_voce:profile';
const SETTINGS_KEY = 'anote_voce:settings';
const BACKUPS_KEY = 'anote_voce:backups';

export interface BackupItem {
  t: number;
  n: number;
  e: number;
  data: {
    notas: Note[];
    compromissos: Appointment[];
    pastas: FolderItem[];
    perfil: UserProfile;
    ajustes: AppSettings;
  };
}

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return INITIAL_NOTES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // fallback
  }
}

export function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return INITIAL_APPOINTMENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_APPOINTMENTS;
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

export function saveAppointments(events: Appointment[]): void {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // fallback
  }
}

export function loadFolders(): FolderItem[] {
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    if (!raw) return INITIAL_FOLDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_FOLDERS;
  } catch {
    return INITIAL_FOLDERS;
  }
}

export function saveFolders(folders: FolderItem[]): void {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch {
    // fallback
  }
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return INITIAL_PROFILE;
    return JSON.parse(raw) || INITIAL_PROFILE;
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // fallback
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return INITIAL_SETTINGS;
    return JSON.parse(raw) || INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // fallback
  }
}

export function loadBackups(): BackupItem[] {
  try {
    const raw = localStorage.getItem(BACKUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBackups(backups: BackupItem[]): void {
  try {
    localStorage.setItem(BACKUPS_KEY, JSON.stringify(backups.slice(0, 5)));
  } catch {
    // fallback
  }
}
