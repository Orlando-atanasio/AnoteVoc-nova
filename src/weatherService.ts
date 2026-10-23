/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Map WMO standard weather code to one of our 4 theme styles
export function mapWeatherCodeToTheme(code: number): {
  themeId: 'sun' | 'cloud' | 'rain' | 'storm';
  conditionText: string;
} {
  switch (code) {
    case 0:
      return { themeId: 'sun', conditionText: 'Céu limpo' };
    case 1:
      return { themeId: 'sun', conditionText: 'Predominantemente limpo' };
    case 2:
      return { themeId: 'cloud', conditionText: 'Parcialmente nublado' };
    case 3:
      return { themeId: 'cloud', conditionText: 'Nublado' };
    case 45:
    case 48:
      return { themeId: 'rain', conditionText: 'Neblina' };
    case 51:
    case 53:
    case 55:
      return { themeId: 'rain', conditionText: 'Chuvisco' };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return { themeId: 'rain', conditionText: 'Chuva leve' };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { themeId: 'cloud', conditionText: 'Neve' };
    case 95:
    case 96:
    case 99:
      return { themeId: 'storm', conditionText: 'Tempestade' };
    default:
      return { themeId: 'sun', conditionText: 'Céu limpo' };
  }
}

/**
 * Silently detects user coordinates via IP or GPS in the background
 * without requiring any manual user interaction or search.
 */
export async function getSilentLiveWeather(): Promise<{
  themeId: 'sun' | 'cloud' | 'rain' | 'storm';
  temperature: string;
  condition: string;
  cityName?: string;
}> {
  let lat = 28.5383; // Orlando fallback
  let lon = -81.3792;
  let detectedCity = 'Orlando';

  // 1. First try fast silent IP geolocation (works on mobile without browser permission prompts)
  try {
    const ipRes = await fetch('https://ipwho.is/');
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.success && typeof ipData.latitude === 'number') {
        lat = ipData.latitude;
        lon = ipData.longitude;
        if (ipData.city) detectedCity = ipData.city;
      }
    }
  } catch {
    // silently continue to weather fetch with default coords
  }

  // 2. Fetch live weather for determined coordinates
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`
  );
  if (!weatherRes.ok) throw new Error('Falha ao consultar clima');

  const weatherData = await weatherRes.json();
  const current = weatherData.current;
  const temp = Math.round(current.temperature_2m);
  const code = current.weather_code ?? 0;
  const { themeId, conditionText } = mapWeatherCodeToTheme(code);

  return {
    themeId,
    temperature: `${temp}°`,
    condition: conditionText,
    cityName: detectedCity,
  };
}
