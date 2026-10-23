/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Note, Appointment, FolderItem, UserProfile, AppSettings } from './types.ts';

const now = Date.now();
const dayMs = 86400000;

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    titulo: 'Prioridades da semana',
    texto: 'Focar no que realmente importa e manter o equilíbrio entre trabalho e vida pessoal.',
    p: 'Trabalho/Projetos',
    t: now,
    mt: now,
    f: '1',
    fv: '1',
    t0: 'Focar no que realmente importa e manter o equilíbrio entre trabalho e vida pessoal.\n\n- Entregar revisão de projeto\n- Organizar pautas da equipe\n- Manter hábitos saudáveis',
    fm: 'line',
  },
  {
    id: 'note_2',
    titulo: 'Ata do alinhamento',
    texto: 'Definir responsáveis e prazos das entregas do trimestre.',
    p: 'Trabalho/Reuniões',
    t: now - dayMs,
    mt: now - dayMs,
    t0: 'Definir responsáveis e prazos das entregas do trimestre.\n\nParticipantes: Equipe de engenharia e produto.\nPróxima revisão na sexta-feira.',
    fm: 'line',
  },
  {
    id: 'note_3',
    titulo: 'Exames de rotina',
    texto: 'Agendar hemograma e levar os resultados na consulta médica.',
    p: 'Pessoal/Saúde',
    t: now - dayMs * 3,
    mt: now - dayMs * 3,
    f: '1',
    fv: '1',
    t0: 'Agendar hemograma e levar os resultados na consulta médica.\nPedir retorno para o Dr. Silva.',
    fm: 'none',
  },
  {
    id: 'note_4',
    titulo: 'Lista de compras',
    texto: 'Café, frutas, detergente e lâmpadas para a sala.',
    p: 'Pessoal/Casa',
    t: now - dayMs * 4,
    mt: now - dayMs * 4,
    t0: 'Café\nFrutas da estação\nDetergente\nLâmpadas LED para sala',
    tk: JSON.stringify([
      { t: 'Café em grãos', d: 1 },
      { t: 'Frutas frescas', d: 0 },
      { t: 'Detergente neutro', d: 0 },
      { t: 'Lâmpadas para a sala', d: 0 },
    ]),
    fm: 'none',
  },
  {
    id: 'note_5',
    titulo: 'Ideias para o app',
    texto: 'Lembretes por voz, notas fixadas e resumo da semana.',
    p: 'Projetos/Ideias',
    t: now - dayMs * 5,
    mt: now - dayMs * 5,
    t0: 'Lembretes por voz, notas fixadas, resumo da semana e temas dinâmicos que sincronizam com a previsão do tempo.',
    fm: 'dot',
  },
];

function getYmd(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * dayMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'ev_1',
    d: getYmd(0),
    s: '10:30',
    e: '11:30',
    t: 'Revisão de projeto',
    g: 'Trabalho',
    i: 'cal',
    l: 'Sala de reuniões 2',
    n: 'Apresentar status do aplicativo e metas da semana.',
    r: 10,
    done: false,
  },
  {
    id: 'ev_2',
    d: getYmd(0),
    s: '14:00',
    e: '15:00',
    t: 'Reunião de acompanhamento',
    g: 'Trabalho',
    i: 'cal',
    n: 'Alinhamento geral com o time.',
    r: 10,
    done: false,
  },
  {
    id: 'ev_3',
    d: getYmd(1),
    s: '09:00',
    e: '10:00',
    t: 'Planejamento da semana',
    g: 'Trabalho',
    i: 'cal',
    n: 'Organização de prioridades e backlog.',
    r: 10,
    done: false,
  },
  {
    id: 'ev_4',
    d: getYmd(0),
    s: '21:00',
    e: '22:30',
    t: 'Jantar com a família',
    g: 'Pessoal',
    i: 'bell',
    ic: '#3fa36b',
    r: 30,
    done: false,
  },
  {
    id: 'ev_5',
    d: getYmd(2),
    s: '09:00',
    e: '10:00',
    t: 'Consulta médica',
    g: 'Saúde',
    i: 'bell',
    ic: '#e5594f',
    r: 60,
    done: false,
  },
  {
    id: 'ev_6',
    d: getYmd(3),
    s: '16:30',
    e: '17:30',
    t: 'Reunião com clientes',
    g: 'Trabalho',
    i: 'cal',
    r: 10,
    done: false,
  },
];

export const INITIAL_FOLDERS: FolderItem[] = [
  // Trabalho
  { id: 'f_trabalho', n: 'Trabalho', i: 'work' },
  { id: 'f_reunioes', n: 'Reuniões', p: 'Trabalho', i: 'folder' },
  { id: 'f_projetos', n: 'Projetos', p: 'Trabalho', i: 'folder' },
  { id: 'f_clientes', n: 'Clientes', p: 'Trabalho', i: 'folder' },

  // Pessoal
  { id: 'f_pessoal', n: 'Pessoal', i: 'person' },
  { id: 'f_saude', n: 'Saúde', p: 'Pessoal', i: 'health' },
  { id: 'f_financas', n: 'Finanças', p: 'Pessoal', i: 'bank' },
  { id: 'f_casa', n: 'Casa', p: 'Pessoal', i: 'home' },

  // Projetos
  { id: 'f_proj_group', n: 'Projetos', i: 'project' },
  { id: 'f_futuros', n: 'Projetos futuros', p: 'Projetos', i: 'folder' },
  { id: 'f_ideias', n: 'Ideias', p: 'Projetos', i: 'ideas' },
  { id: 'f_andamento', n: 'Em andamento', p: 'Projetos', i: 'folder' },
  { id: 'f_concluidos', n: 'Concluídos', p: 'Projetos', i: 'folder' },
];

export const INITIAL_PROFILE: UserProfile = {
  n: 'Orlando',
  t: '',
  e: '',
};

export const INITIAL_SETTINGS: AppSettings = {
  fs: 1, // default font size
  snd: 1,
  vib: 1,
  rem: 1,
  wk: 1, // start on Monday
  dots: 1,
  dv: 'm', // month view
  th: 0,
};
