/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, FileText, Search, X, Pencil } from 'lucide-react';
import { WeatherIcon } from '../WeatherIcon.tsx';
import { Appointment, UserProfile } from '../types.ts';
import { WeatherTheme } from '../themes.ts';
import { SidebarToggleIcon } from './SidebarToggleIcon.tsx';

interface HomeScreenProps {
  profile: UserProfile;
  currentTheme: WeatherTheme;
  temperatureDisplay: string;
  conditionDisplay: string;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  onOpenDrawer: () => void;
  onOpenProfile: () => void;
  onOpenCalendar: () => void;
  onOpenNotes: (searchQuery?: string) => void;
  onOpenNewNote: () => void;
  onOpenNewEvent: () => void;
  onSelectEvent: (event: Appointment) => void;
  appointments: Appointment[];
  onCycleTheme?: () => void;
}

export function HomeScreen({
  profile,
  currentTheme,
  temperatureDisplay,
  conditionDisplay,
  onCycleTheme,
  selectedDay,
  setSelectedDay,
  onOpenDrawer,
  onOpenProfile,
  onOpenCalendar,
  onOpenNotes,
  onOpenNewNote,
  onOpenNewEvent,
  onSelectEvent,
  appointments,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const weekDays = [
    { name: 'SEG', day: 19 },
    { name: 'TER', day: 20 },
    { name: 'QUA', day: 21 },
    { name: 'QUI', day: 22 },
    { name: 'SEX', day: 23 },
    { name: 'SÁB', day: 24 },
    { name: 'DOM', day: 25 },
  ];

  const isDarkTop = currentTheme.isDarkTopText;
  const topTextColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const topTextSubColor = isDarkTop ? 'text-slate-600' : 'text-white/80';
  const statusIconColor = isDarkTop ? 'text-slate-800 fill-slate-800' : 'text-white fill-white';
  const navIconColor = isDarkTop ? 'text-slate-800' : 'text-white';
  const cardStyleClass = isDarkTop ? 'ios-glass-card-light' : 'ios-glass-card-dark';

  // Get active appointments
  const activeEvents = appointments.filter((e) => !e.arc && !e.done);
  const nextEvent = activeEvents[0] || null;
  const upcomingEvents = activeEvents.slice(1, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenNotes(searchQuery.trim());
    }
  };

  return (
    <div className="relative z-10 flex flex-col h-full px-5 pt-2 pb-2.5 sm:px-6 sm:pt-3 sm:pb-3.5 justify-between">
      {/* Top Section */}
      <div className="space-y-2 sm:space-y-2.5">
        {/* iOS Status Bar */}
        <header className="flex justify-between items-center text-xs font-semibold pt-1 pb-1 tracking-tight" data-purpose="ios-status-bar">
          <span className={`text-[14px] font-medium tracking-tight ml-1 ${topTextColor}`}>
            9:41
          </span>

          <div className="flex items-center space-x-1.5 mr-1">
            <svg className={`w-4 h-3 ${statusIconColor}`} viewBox="0 0 17 11">
              <rect height="4" rx="0.5" width="2.5" x="0" y="7" />
              <rect height="6" rx="0.5" width="2.5" x="4.5" y="5" />
              <rect height="8.5" rx="0.5" width="2.5" x="9" y="2.5" />
              <rect height="11" rx="0.5" width="2.5" x="13.5" y="0" />
            </svg>
            <svg className={`w-4 h-3 ${statusIconColor}`} viewBox="0 0 16 12">
              <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.2-2.8a6 6 0 018.4 0 .8.8 0 001.1-1.1 7.6 7.6 0 00-10.6 0 .8.8 0 001.1 1.1zm-2.8-2.8a10 10 0 0114 0 .8.8 0 001.1-1.1 11.6 11.6 0 00-16.2 0 .8.8 0 101.1 1.1z" />
            </svg>
            <div className={`w-5 h-2.5 border ${isDarkTop ? 'border-slate-800' : 'border-white'} rounded-[3px] p-0.5 flex items-center relative`}>
              <div className={`${isDarkTop ? 'bg-slate-800' : 'bg-white'} h-full w-full rounded-[1px]`} />
              <div className={`w-0.5 h-1 ${isDarkTop ? 'bg-slate-800' : 'bg-white'} absolute -right-1 top-0.5 rounded-r-sm`} />
            </div>
          </div>
        </header>

        {/* Top Navigation Bar */}
        <nav className="flex justify-between items-center mt-0.5 mb-1.5" data-purpose="top-navigation">
          <button
            aria-label="Abrir menu lateral"
            className="p-1 -ml-1 focus:outline-none cursor-pointer hover:opacity-85 transition-opacity text-[#de7649] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            id="menu-toggle-btn"
            type="button"
            onClick={onOpenDrawer}
            title="Abrir barra lateral"
          >
            <SidebarToggleIcon className="w-5 h-5 stroke-[1.9]" />
          </button>

          <button
            aria-label="Perfil do usuário"
            className={`p-0.5 focus:outline-none cursor-pointer hover:opacity-85 transition-opacity ${navIconColor}`}
            type="button"
            onClick={onOpenProfile}
          >
            <div className={`w-8 h-8 rounded-full overflow-hidden border ${isDarkTop ? 'border-slate-700/60' : 'border-white/70'} flex items-center justify-center ${isDarkTop ? 'bg-slate-900/10' : 'bg-white/20'} shadow-sm`}>
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.n || 'Perfil'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
                </svg>
              )}
            </div>
          </button>
        </nav>

        {/* Combined Greeting & Weather Header */}
        <section className="flex items-start justify-between mb-2 text-left" data-purpose="greeting-section">
          <div>
            <span className={`text-[11px] font-semibold tracking-wider uppercase block ${topTextSubColor}`}>
              BOM DIA,
            </span>
            <h1 className={`text-3xl font-bold tracking-tight leading-tight mt-0.5 ${topTextColor}`}>
              {profile?.n || 'Orlando'}
            </h1>
            <p className={`text-xs ${topTextSubColor} mt-0.5 font-normal`}>
              Quinta-feira, 22 de outubro
            </p>
          </div>

          <button
            type="button"
            onClick={onCycleTheme}
            className="flex items-center gap-2 pt-1 text-right cursor-pointer select-none group hover:opacity-90 active:scale-95 transition-all focus:outline-none"
            title="Alternar entre as 4 telas"
            aria-label="Alternar clima e tela de fundo"
          >
            <WeatherIcon type={currentTheme.id} className="w-10 h-10" />
            <div>
              <div className={`text-2xl font-bold ${topTextColor} leading-none tracking-tight`}>
                {temperatureDisplay}
              </div>
              <div className={`text-[11px] ${topTextSubColor} font-medium tracking-wide mt-0.5`}>
                {conditionDisplay}
              </div>
            </div>
          </button>
        </section>

        {/* Weekly Calendar Strip */}
        <section className="mb-2" data-purpose="week-calendar">
          <h3 className={`text-xs ${topTextSubColor} font-medium mb-1.5`}>Sua semana</h3>
          <div className="grid grid-cols-7 text-center">
            {weekDays.map((item) => {
              const isSelected = selectedDay === item.day;
              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedDay(item.day)}
                  className="flex flex-col items-center cursor-pointer group focus:outline-none transition-transform"
                >
                  <span
                    className={`text-[10px] uppercase font-medium ${
                      isSelected
                        ? `font-semibold ${topTextColor}`
                        : `${topTextSubColor} group-hover:${topTextColor}`
                    }`}
                  >
                    {item.name}
                  </span>
                  {isSelected ? (
                    <div className="flex flex-col items-center relative -top-0.5 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-semibold text-white shadow-md">
                        {item.day}
                      </div>
                      <div className="w-1 h-1 bg-white rounded-full mt-0.5" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className={`text-xs ${topTextColor} mt-1 font-normal opacity-90 group-hover:opacity-100`}>
                        {item.day}
                      </span>
                      <div className="w-1 h-1 bg-white/40 rounded-full mt-0.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Next Appointment Section */}
        <section className="mb-2" data-purpose="next-appointment">
          <h3 className={`text-xs ${topTextSubColor} font-medium mb-1.5`}>Próximo compromisso</h3>
          {nextEvent ? (
            <article
              onClick={() => onSelectEvent(nextEvent)}
              className={`${cardStyleClass} rounded-2xl p-2.5 flex items-center gap-3 transition-transform hover:scale-[1.01] cursor-pointer`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-sm flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="w-0.5 h-8 bg-orange-500 rounded-full flex-shrink-0" />
              <div className="flex flex-col text-left flex-1 min-w-0">
                <h4 className={`text-sm font-semibold tracking-tight leading-snug truncate ${topTextColor}`}>
                  {nextEvent.t}
                </h4>
                <p className={`text-xs ${topTextSubColor} mt-0.5`}>
                  {nextEvent.s} · {nextEvent.g}
                </p>
              </div>
            </article>
          ) : (
            <div className={`${cardStyleClass} rounded-2xl p-3 text-center text-xs ${topTextSubColor}`}>
              Nenhum compromisso agendado
            </div>
          )}
        </section>

        {/* Upcoming Appointments Section */}
        <section data-purpose="upcoming-tasks">
          <div className="flex justify-between items-center mb-1.5">
            <h3 className={`text-xs ${topTextSubColor} font-medium`}>A seguir</h3>
            <button
              type="button"
              onClick={onOpenCalendar}
              className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <span>Ver todos</span>
              <span className="text-[11px]">→</span>
            </button>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((ev) => (
                <article
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className={`${cardStyleClass} rounded-2xl p-2.5 flex items-center gap-3 transition-transform hover:scale-[1.01] cursor-pointer`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                    {ev.g === 'Trabalho' ? (
                      <Calendar className="w-4 h-4 text-white" />
                    ) : (
                      <FileText className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="w-0.5 h-7 bg-orange-500 rounded-full flex-shrink-0" />
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold tracking-tight leading-snug truncate ${topTextColor}`}>
                      {ev.t}
                    </h4>
                    <p className={`text-xs ${topTextSubColor} mt-0.5`}>
                      {ev.s} · {ev.g}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className={`${cardStyleClass} rounded-2xl p-3 text-center text-xs ${topTextSubColor}`}>
                Tudo em dia por enquanto
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Actions (Search Bar & Floating Pencil Button) */}
      <footer className="pt-2 pb-1" data-purpose="bottom-bar">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <form onSubmit={handleSearchSubmit} className="ios-glass-search flex-1 h-11 rounded-full flex items-center px-4 gap-2.5">
            <Search className="w-4 h-4 text-[#de7649] shrink-0" />
            <input
              aria-label="Buscar notas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 p-0"
              placeholder="Buscar notas..."
              type="text"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Orange Floating Action Button (FAB) com lápis levemente reduzido */}
          <button
            aria-label="Criar novo item"
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 rounded-full bg-[#de7649] hover:bg-[#cf693d] active:scale-95 text-white flex items-center justify-center shadow-md shadow-orange-950/20 transition-transform flex-shrink-0 cursor-pointer"
            type="button"
          >
            <Pencil className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* iOS Home Indicator */}
        <div
          className={`w-32 h-1 rounded-full mx-auto mt-2 sm:mt-3 ${
            isDarkTop ? 'bg-slate-700/60' : 'bg-white/40'
          }`}
          data-purpose="ios-home-indicator"
        />
      </footer>

      {/* Quick Action Modal: Nova nota ou Novo compromisso (Estilo Claro / Glass) */}
      {showCreateModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
            }
          }}
          className="absolute inset-0 bg-black/35 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-xs bg-white/95 border border-white/80 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Criar novo</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  onOpenNewNote();
                }}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-slate-100/80 hover:bg-slate-100 text-slate-800 font-medium text-sm transition-colors text-left border border-slate-200/60 shadow-xs cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Nova Nota</div>
                  <div className="text-[11px] text-slate-500">Texto, listas, tabelas e imagens</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowCreateModal(false);
                  onOpenNewEvent();
                }}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-slate-100/80 hover:bg-slate-100 text-slate-800 font-medium text-sm transition-colors text-left border border-slate-200/60 shadow-xs cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Novo Compromisso</div>
                  <div className="text-[11px] text-slate-500">Data, hora, categoria e lembretes</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
