/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NoteTable {
  r: string[][];
  a: string;
}

export interface NoteTask {
  t: string;
  d: number; // 0 or 1
}

export interface Note {
  id: string;
  titulo: string;
  texto: string;
  p: string; // folder path, e.g. "Trabalho/Projetos"
  t: number; // created timestamp
  mt: number; // modified timestamp
  f?: string; // "1" if pinned
  fv?: string; // "1" if favorite
  t0?: string; // raw full body text
  th?: string; // rich html text
  tb?: string; // JSON string of NoteTable[]
  tk?: string; // JSON string of NoteTask[]
  fm?: 'line' | 'none' | 'dot'; // format: lines, blank, dot
  tr?: string; // "1" if in trash
  img?: string; // JSON string of image data URLs
  ar?: string; // "1" if archived
  lk?: string; // "1" if locked
  fs?: string; // font size index "0", "1", "2"
  draft?: string;
  tc?: string; // text color hex
  pc?: string; // page background color hex
  hc?: string; // highlight color hex
}

export interface Appointment {
  id: string | number;
  d: string; // "YYYY-MM-DD"
  s: string; // "HH:MM" start time
  e: string; // "HH:MM" end time
  t: string; // title
  g: string; // category: 'Trabalho' | 'Pessoal' | 'Saúde'
  i?: string; // 'cal' | 'bell'
  ic?: string; // icon color
  c?: string; // custom color
  l?: string; // location
  n?: string; // notes
  r?: number; // reminder minutes before: -1=none, 0=at time, 10, 30, 60, 1440
  done?: boolean;
  arc?: boolean; // archived
  dismissed?: boolean;
}

export interface FolderItem {
  id: string;
  n: string; // folder name
  p?: string; // parent folder path
  i?: string; // icon id
}

export interface UserProfile {
  n: string;
  t?: string;
  e?: string;
  avatar?: string;
}

export interface AppSettings {
  fs: number; // 0=small, 1=default, 2=large
  snd: number;
  vib: number;
  rem: number;
  wk: number; // 0=Sunday, 1=Monday
  dots: number;
  dv: 'm' | 's' | 'd'; // default view: month, week, day
  th: number; // theme: 0=light, 1=dark, 2=auto
}
