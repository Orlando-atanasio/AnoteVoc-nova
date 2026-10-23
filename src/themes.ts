/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherTheme {
  id: 'sun' | 'cloud' | 'rain' | 'storm';
  name: string;
  temperature: string;
  condition: string;
  imageUrl: string;
  gradientOverlay: string;
  sidebarGradient: string;
  isDarkTopText: boolean;
  hasRainOverlay?: boolean;
  hasLightningOverlay?: boolean;
  accentColor: string;
}

export const WEATHER_THEMES: WeatherTheme[] = [
  {
    id: 'sun',
    name: 'Céu limpo',
    temperature: '24°',
    condition: 'Céu limpo',
    // Golden sunrise/sunset over mountain lake with golden reflection
    imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1000&q=85',
    gradientOverlay: 'linear-gradient(180deg, rgba(254, 243, 199, 0.42) 0%, rgba(245, 158, 11, 0.18) 40%, rgba(15, 23, 42, 0.65) 100%)',
    sidebarGradient: 'linear-gradient(180deg, rgba(254, 243, 199, 0.42) 0%, rgba(245, 158, 11, 0.18) 40%, rgba(15, 23, 42, 0.65) 100%)',
    isDarkTopText: true,
    accentColor: '#f97316',
  },
  {
    id: 'cloud',
    name: 'Nublado',
    temperature: '22°',
    condition: 'Nublado',
    // Blue sky with cumulus clouds over mountains and lake
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=85',
    gradientOverlay: 'linear-gradient(180deg, rgba(14, 60, 115, 0.25) 0%, rgba(12, 38, 70, 0.45) 50%, rgba(10, 20, 32, 0.82) 100%)',
    sidebarGradient: 'linear-gradient(180deg, rgba(14, 60, 115, 0.25) 0%, rgba(12, 38, 70, 0.45) 50%, rgba(10, 20, 32, 0.82) 100%)',
    isDarkTopText: false,
    accentColor: '#f97316',
  },
  {
    id: 'rain',
    name: 'Chuva leve',
    temperature: '18°',
    condition: 'Chuva leve',
    // Misty overcast lake with pine trees and rain streaks
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=85',
    gradientOverlay: 'linear-gradient(180deg, rgba(30, 48, 64, 0.45) 0%, rgba(18, 30, 42, 0.6) 55%, rgba(12, 22, 30, 0.88) 100%)',
    sidebarGradient: 'linear-gradient(180deg, rgba(30, 48, 64, 0.45) 0%, rgba(18, 30, 42, 0.6) 55%, rgba(12, 22, 30, 0.88) 100%)',
    isDarkTopText: false,
    hasRainOverlay: true,
    accentColor: '#f97316',
  },
  {
    id: 'storm',
    name: 'Tempestade',
    temperature: '16°',
    condition: 'Tempestade',
    // Dark nocturnal sky with electric lightning bolts over lake
    imageUrl: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1000&q=85',
    gradientOverlay: 'linear-gradient(180deg, rgba(15, 23, 42, 0.38) 0%, rgba(30, 27, 75, 0.52) 55%, rgba(10, 15, 30, 0.9) 100%)',
    sidebarGradient: 'linear-gradient(180deg, rgba(15, 23, 42, 0.38) 0%, rgba(30, 27, 75, 0.52) 55%, rgba(10, 15, 30, 0.9) 100%)',
    isDarkTopText: false,
    hasLightningOverlay: true,
    accentColor: '#f97316',
  },
];
