/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Plus,
  Calendar as CalIcon,
  Clock,
  MapPin,
  FileText,
  Check,
  RotateCcw,
  Trash2,
  Copy,
  Archive,
  X,
  Edit,
} from 'lucide-react';
import { Appointment } from '../types.ts';
import { WeatherTheme } from '../themes.ts';

interface CalendarScreenProps {
  appointments: Appointment[];
  currentTheme: WeatherTheme;
  initialOpenCreate?: boolean;
  onBack: () => void;
  onSaveAppointment: (appt: Appointment) => void;
  onDeleteAppointment: (id: string | number) => void;
}

type CalViewMode = 'm' | 's' | 'd'; // month, week, day

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Trabalho: { bg: 'bg-blue-500/20', text: 'text-blue-300', dot: '#3b82f6' },
  Pessoal: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', dot: '#10b981' },
  Saúde: { bg: 'bg-rose-500/20', text: 'text-rose-300', dot: '#f43f5e' },
};

export function CalendarScreen({
  appointments,
  currentTheme,
  initialOpenCreate,
  onBack,
  onSaveAppointment,
  onDeleteAppointment,
}: CalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalViewMode>('m');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Appointment | null>(null);

  // Auto-open create form when requested from home screen
  useEffect(() => {
    if (initialOpenCreate) {
      setEditingEvent(null);
      setFormTitle('');
      setFormDate(ymd(new Date()));
      setFormStart('09:00');
      setFormEnd('10:00');
      setFormCategory('Trabalho');
      setFormLocation('');
      setFormNotes('');
      setIsFormOpen(true);
    }
  }, [initialOpenCreate]);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStart, setFormStart] = useState('09:00');
  const [formEnd, setFormEnd] = useState('10:00');
  const [formCategory, setFormCategory] = useState<'Trabalho' | 'Pessoal' | 'Saúde'>('Trabalho');
  const [formLocation, setFormLocation] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const isDarkTop = currentTheme.isDarkTopText;
  const topTextColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const topTextSubColor = isDarkTop ? 'text-slate-600' : 'text-white/80';
  const navIconColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const cardStyleClass = isDarkTop ? 'ios-glass-card-light' : 'ios-glass-card-dark';

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDayHeaders = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  function ymd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Generate calendar days for the current month
  const calendarCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  }, [currentDate]);

  // Navigate months or days
  const handlePrev = () => {
    if (viewMode === 'm') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() - (viewMode === 's' ? 7 : 1));
      setSelectedDate(next);
      setCurrentDate(next);
    }
  };

  const handleNext = () => {
    if (viewMode === 'm') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + (viewMode === 's' ? 7 : 1));
      setSelectedDate(next);
      setCurrentDate(next);
    }
  };

  // Events for selected date
  const eventsForSelectedDate = useMemo(() => {
    const targetYmd = ymd(selectedDate);
    return appointments
      .filter((e) => !e.arc && e.d === targetYmd)
      .sort((a, b) => a.s.localeCompare(b.s));
  }, [appointments, selectedDate]);

  // 7 days for the Week View strip
  const weekDays = useMemo(() => {
    const curr = new Date(selectedDate);
    const day = (curr.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  // Open form to create
  const handleOpenCreateForm = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDate(ymd(selectedDate));
    setFormStart('09:00');
    setFormEnd('10:00');
    setFormCategory('Trabalho');
    setFormLocation('');
    setFormNotes('');
    setIsFormOpen(true);
  };

  // Open form to edit
  const handleOpenEditForm = (ev: Appointment) => {
    setEditingEvent(ev);
    setFormTitle(ev.t);
    setFormDate(ev.d);
    setFormStart(ev.s);
    setFormEnd(ev.e);
    setFormCategory((ev.g as 'Trabalho' | 'Pessoal' | 'Saúde') || 'Trabalho');
    setFormLocation(ev.l || '');
    setFormNotes(ev.n || '');
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  // Save form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const saved: Appointment = {
      id: editingEvent ? editingEvent.id : `ev_${Date.now()}`,
      t: formTitle.trim(),
      d: formDate || ymd(selectedDate),
      s: formStart,
      e: formEnd,
      g: formCategory,
      l: formLocation.trim() || undefined,
      n: formNotes.trim() || undefined,
      r: 10,
      done: editingEvent ? editingEvent.done : false,
    };

    onSaveAppointment(saved);
    setIsFormOpen(false);
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return appointments.filter(
      (ev) =>
        !ev.arc &&
        (ev.t.toLowerCase().includes(q) ||
          ev.g.toLowerCase().includes(q) ||
          (ev.l || '').toLowerCase().includes(q) ||
          (ev.n || '').toLowerCase().includes(q))
    );
  }, [appointments, searchQuery]);

  return (
    <div className="relative z-10 flex flex-col h-full px-5 pt-2 pb-2.5 sm:px-6 sm:pt-3 sm:pb-3.5 justify-between text-left">
      {/* Top Header */}
      <div className="space-y-2.5">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onBack}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${topTextColor}`}
              title="Voltar"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onBack}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${topTextColor}`}
              title="Início / Dashboard"
              aria-label="Ir para o Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
            <h2 className={`text-xl font-bold tracking-tight ml-1 ${topTextColor}`}>
              Calendário
            </h2>
          </div>
        </div>

        {/* View Mode Segment Switcher (Mês, Semana, Dia) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-xs">
          <button
            onClick={() => setViewMode('m')}
            className={`py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              viewMode === 'm' ? 'bg-orange-500 text-white shadow-md font-bold' : `${topTextColor} hover:bg-white/10`
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setViewMode('s')}
            className={`py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              viewMode === 's' ? 'bg-orange-500 text-white shadow-md font-bold' : `${topTextColor} hover:bg-white/10`
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode('d')}
            className={`py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              viewMode === 'd' ? 'bg-orange-500 text-white shadow-md font-bold' : `${topTextColor} hover:bg-white/10`
            }`}
          >
            Dia
          </button>
        </div>

        {/* Month / Period Bar */}
        {viewMode === 'm' && (
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-base font-bold ${topTextColor}`}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className={`p-1.5 rounded-lg hover:bg-white/10 ${topTextColor} cursor-pointer`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className={`p-1.5 rounded-lg hover:bg-white/10 ${topTextColor} cursor-pointer`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        {viewMode === 'm' ? (
          /* Month Grid View */
          <div>
            {/* Weekday headers */}
            <div className={`grid grid-cols-7 text-center mb-1 text-[11px] font-bold ${topTextSubColor}`}>
              {weekDayHeaders.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((date, idx) => {
                if (!date) {
                  return <div key={`empty_${idx}`} className="h-9" />;
                }
                const dateStr = ymd(date);
                const isSelected = dateStr === ymd(selectedDate);
                const isToday = dateStr === ymd(new Date());

                // Find events on this day
                const dayEvents = appointments.filter((e) => !e.arc && e.d === dateStr);

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(date)}
                    className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition-transform cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-white font-bold shadow-md scale-105'
                        : isToday
                        ? isDarkTop
                          ? 'bg-slate-900/20 text-slate-900 font-bold ring-1 ring-slate-800/40'
                          : 'bg-white/30 text-white font-bold ring-1 ring-white/50'
                        : isDarkTop
                        ? 'text-slate-900 hover:bg-black/10 font-bold'
                        : 'text-white hover:bg-white/15 font-semibold'
                    }`}
                  >
                    <span className="text-xs leading-none drop-shadow-sm">{date.getDate()}</span>
                    {dayEvents.length > 0 && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Events for selected date section */}
            <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
              <h4 className={`text-xs font-semibold ${topTextSubColor}`}>
                {selectedDate.getDate()} de {months[selectedDate.getMonth()]}
              </h4>

              {eventsForSelectedDate.length === 0 ? (
                <p className={`text-xs py-2 ${topTextSubColor}`}>Nenhum compromisso marcado para este dia.</p>
              ) : (
                eventsForSelectedDate.map((ev) => {
                  const catColor = CATEGORY_COLORS[ev.g] || CATEGORY_COLORS.Trabalho;
                  return (
                    <article
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`${cardStyleClass} rounded-2xl p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-transform hover:scale-[1.01]`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                          <CalIcon className="w-4 h-4" />
                        </div>
                        <div className="truncate flex-1">
                          <h4 className={`text-sm font-semibold truncate ${topTextColor}`}>
                            {ev.t}
                          </h4>
                          <p className={`text-xs ${topTextSubColor}`}>
                            {ev.s} – {ev.e} · {ev.g}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}>
                        {ev.g}
                      </span>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        ) : viewMode === 's' ? (
          /* Week View with 7-Day Strip */
          <div className="space-y-3">
            {/* 7-day selector strip */}
            <div className="grid grid-cols-7 gap-1.5 p-1.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
              {weekDays.map((d, i) => {
                const dStr = ymd(d);
                const isSel = dStr === ymd(selectedDate);
                const isTod = dStr === ymd(new Date());
                const dayEvs = appointments.filter((e) => !e.arc && e.d === dStr);
                return (
                  <button
                    key={dStr}
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-0.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-orange-500 text-white font-bold shadow-md scale-105'
                        : isTod
                        ? isDarkTop
                          ? 'bg-slate-900/20 text-slate-900 font-bold'
                          : 'bg-white/25 text-white font-bold'
                        : isDarkTop
                        ? 'text-slate-800 hover:bg-black/10 font-semibold'
                        : 'text-white/90 hover:bg-white/10 font-semibold'
                    }`}
                  >
                    <span className="text-[10px] opacity-80">{weekDayHeaders[i]}</span>
                    <span className="text-xs font-bold leading-none">{d.getDate()}</span>
                    {dayEvs.length > 0 && !isSel && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-0.5 shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Events for selected day in week */}
            <div className="space-y-2">
              <h4 className={`text-xs font-semibold ${topTextSubColor}`}>
                Compromissos para {selectedDate.getDate()} de {months[selectedDate.getMonth()]}
              </h4>
              {eventsForSelectedDate.length === 0 ? (
                <div className={`${cardStyleClass} rounded-2xl p-6 text-center text-xs opacity-70`}>
                  Nenhum compromisso marcado para este dia.
                </div>
              ) : (
                eventsForSelectedDate.map((ev) => {
                  const catColor = CATEGORY_COLORS[ev.g] || CATEGORY_COLORS.Trabalho;
                  return (
                    <article
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`${cardStyleClass} rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-transform hover:scale-[1.01]`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                          <CalIcon className="w-4 h-4" />
                        </div>
                        <div className="truncate flex-1">
                          <h4 className={`text-sm font-bold truncate ${topTextColor}`}>{ev.t}</h4>
                          <p className={`text-xs ${topTextSubColor}`}>
                            {ev.s} – {ev.e} {ev.l ? `· ${ev.l}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${catColor.bg} ${catColor.text}`}>
                        {ev.g}
                      </span>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Day View with focused single-day schedule */
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
              <button onClick={handlePrev} className={`p-1.5 rounded-lg hover:bg-white/10 ${topTextColor} cursor-pointer`}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <h3 className={`text-sm font-bold ${topTextColor}`}>
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <small className={`text-[11px] ${topTextSubColor}`}>
                  {eventsForSelectedDate.length} {eventsForSelectedDate.length === 1 ? 'compromisso' : 'compromissos'}
                </small>
              </div>
              <button onClick={handleNext} className={`p-1.5 rounded-lg hover:bg-white/10 ${topTextColor} cursor-pointer`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* List of day events */}
            <div className="space-y-2">
              {eventsForSelectedDate.length === 0 ? (
                <div className={`${cardStyleClass} rounded-2xl p-6 text-center text-xs opacity-70`}>
                  Nenhum compromisso para este dia.
                </div>
              ) : (
                eventsForSelectedDate.map((ev) => {
                  const catColor = CATEGORY_COLORS[ev.g] || CATEGORY_COLORS.Trabalho;
                  return (
                    <article
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`${cardStyleClass} rounded-2xl p-3.5 cursor-pointer space-y-2 transition-transform hover:scale-[1.01]`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${topTextColor}`}>{ev.t}</h4>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${catColor.bg} ${catColor.text}`}>
                          {ev.g}
                        </span>
                      </div>
                      <div className={`flex items-center gap-3 text-xs ${topTextSubColor}`}>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                          {ev.s} – {ev.e}
                        </span>
                        {ev.l && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-orange-400" />
                            {ev.l}
                          </span>
                        )}
                      </div>
                      {ev.n && <p className={`text-xs italic ${topTextSubColor}`}>{ev.n}</p>}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Event Details Sheet (Claro / Frosted Glass) */}
      {selectedEvent && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedEvent(null);
            }
          }}
          className="absolute inset-0 bg-black/35 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-xs bg-white/95 border border-white/80 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-left text-slate-800 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                {selectedEvent.g}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-2">{selectedEvent.t}</h3>

            <div className="space-y-1.5 text-xs text-slate-700 mb-4 bg-slate-100/80 rounded-2xl p-3 border border-slate-200/60">
              <div className="flex items-center gap-2">
                <CalIcon className="w-3.5 h-3.5 text-orange-500" />
                <span>{selectedEvent.d}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>{selectedEvent.s} – {selectedEvent.e}</span>
              </div>
              {selectedEvent.l && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{selectedEvent.l}</span>
                </div>
              )}
              {selectedEvent.n && (
                <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                  <FileText className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                  <span className="text-slate-600">{selectedEvent.n}</span>
                </div>
              )}
            </div>

            {/* Event Actions */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleOpenEditForm(selectedEvent)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  onSaveAppointment({ ...selectedEvent, done: !selectedEvent.done });
                  setSelectedEvent(null);
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {selectedEvent.done ? 'Reabrir' : 'Concluir'}
              </button>
              <button
                onClick={() => {
                  onSaveAppointment({
                    ...selectedEvent,
                    id: `ev_${Date.now()}`,
                    t: `${selectedEvent.t} (Cópia)`,
                  });
                  setSelectedEvent(null);
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicar
              </button>
              <button
                onClick={() => {
                  onDeleteAppointment(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium flex items-center justify-center gap-1.5 cursor-pointer border border-red-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Appointment Form Modal (Claro / Frosted Glass) */}
      {isFormOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFormOpen(false);
              if (initialOpenCreate) {
                onBack();
              }
            }
          }}
          className="absolute inset-0 bg-black/35 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
        >
          <form
            onSubmit={handleSaveForm}
            className="w-full max-w-xs bg-white/95 border border-white/80 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-left animate-fadeIn space-y-3 text-slate-800"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                {editingEvent ? 'Editar compromisso' : 'Novo compromisso'}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  if (initialOpenCreate) {
                    onBack();
                  }
                }}
                type="button"
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Título</label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Reunião de equipe"
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Data</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Categoria</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                >
                  <option value="Trabalho">Trabalho</option>
                  <option value="Pessoal">Pessoal</option>
                  <option value="Saúde">Saúde</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Início</label>
                <input
                  type="time"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Fim</label>
                <input
                  type="time"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Local (opcional)</label>
              <input
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Ex: Sala de reunião ou online"
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Observações (opcional)</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                placeholder="Detalhes ou lembretes..."
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  if (initialOpenCreate) {
                    onBack();
                  }
                }}
                className="flex-1 py-2 text-xs rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 border border-slate-200 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow-md cursor-pointer transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
