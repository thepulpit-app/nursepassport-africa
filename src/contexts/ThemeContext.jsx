import { createContext, useContext, useState } from 'react'

export const THEMES = {
  ocean: {
    name: 'Ocean', emoji: '🌊',
    primary: '#0A2540', secondary: '#00897B', accent: '#F4A300',
    gradient: 'linear-gradient(135deg, #0A2540, #1E3A5F)',
    cardGradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    simGradient: 'linear-gradient(135deg, #F43F5E, #EC4899)',
    bg: '#F7F9FC',
  },
  rose: {
    name: 'Rose', emoji: '🌸',
    primary: '#881337', secondary: '#F43F5E', accent: '#FB7185',
    gradient: 'linear-gradient(135deg, #881337, #BE123C)',
    cardGradient: 'linear-gradient(135deg, #F43F5E, #FB7185)',
    simGradient: 'linear-gradient(135deg, #BE123C, #F43F5E)',
    bg: '#FFF1F2',
  },
  midnight: {
    name: 'Midnight', emoji: '🌙',
    primary: '#0F0F1A', secondary: '#6366F1', accent: '#F59E0B',
    gradient: 'linear-gradient(135deg, #0F0F1A, #1E1B4B)',
    cardGradient: 'linear-gradient(135deg, #1E1B4B, #312E81)',
    simGradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    bg: '#0F0F1A',
  },
  forest: {
    name: 'Forest', emoji: '🌿',
    primary: '#14532D', secondary: '#16A34A', accent: '#86EFAC',
    gradient: 'linear-gradient(135deg, #14532D, #166534)',
    cardGradient: 'linear-gradient(135deg, #16A34A, #22C55E)',
    simGradient: 'linear-gradient(135deg, #15803D, #16A34A)',
    bg: '#F0FDF4',
  },
  sunrise: {
    name: 'Sunrise', emoji: '🌅',
    primary: '#7C2D12', secondary: '#EA580C', accent: '#FCD34D',
    gradient: 'linear-gradient(135deg, #7C2D12, #C2410C)',
    cardGradient: 'linear-gradient(135deg, #EA580C, #F97316)',
    simGradient: 'linear-gradient(135deg, #DC2626, #EA580C)',
    bg: '#FFF7ED',
  },
  lavender: {
    name: 'Lavender', emoji: '💜',
    primary: '#4C1D95', secondary: '#7C3AED', accent: '#C4B5FD',
    gradient: 'linear-gradient(135deg, #4C1D95, #5B21B6)',
    cardGradient: 'linear-gradient(135deg, #7C3AED, #9333EA)',
    simGradient: 'linear-gradient(135deg, #6D28D9, #7C3AED)',
    bg: '#F5F3FF',
  },
  sahara: {
    name: 'Sahara', emoji: '🌍',
    primary: '#78350F', secondary: '#D97706', accent: '#FCD34D',
    gradient: 'linear-gradient(135deg, #78350F, #92400E)',
    cardGradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
    simGradient: 'linear-gradient(135deg, #B45309, #D97706)',
    bg: '#FFFBEB',
  },
  monochrome: {
    name: 'Mono', emoji: '🖤',
    primary: '#111827', secondary: '#374151', accent: '#9CA3AF',
    gradient: 'linear-gradient(135deg, #111827, #1F2937)',
    cardGradient: 'linear-gradient(135deg, #374151, #4B5563)',
    simGradient: 'linear-gradient(135deg, #1F2937, #374151)',
    bg: '#F9FAFB',
  },
}

const DEFAULT_THEME = THEMES.ocean

const ThemeContext = createContext({
  theme: THEMES.ocean,
  themeName: 'ocean',
  setTheme: () => {},
  themes: THEMES,
})

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    try {
      return localStorage.getItem('npa-theme') || 'ocean'
    } catch {
      return 'ocean'
    }
  })

  const theme = THEMES[themeName] || DEFAULT_THEME

  function setTheme(name) {
    if (THEMES[name]) {
      setThemeName(name)
      try { localStorage.setItem('npa-theme', name) } catch {}
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return {
    theme: context?.theme || DEFAULT_THEME,
    themeName: context?.themeName || 'ocean',
    setTheme: context?.setTheme || (() => {}),
    themes: context?.themes || THEMES,
  }
}