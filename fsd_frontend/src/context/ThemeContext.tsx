import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('fedf_theme')
    return (saved as Theme) || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('fedf_theme', theme)
    
    // Update CSS variables based on theme
    const root = document.documentElement
    if (theme === 'dark') {
      root.style.colorScheme = 'dark'
      root.style.setProperty('--bg-primary', '#0A0A0A')
      root.style.setProperty('--bg-secondary', '#141414')
      root.style.setProperty('--bg-tertiary', '#1E1E1E')
      root.style.setProperty('--bg-hover', '#1E1E1E')
      root.style.setProperty('--text-primary', '#F5F5F5')
      root.style.setProperty('--text-secondary', '#A0A0B0')
      root.style.setProperty('--text-tertiary', '#6E6E80')
      root.style.setProperty('--border-subtle', '#2A2A2A')
      root.style.setProperty('--border-muted', '#1E1E1E')
      root.style.setProperty('--accent-primary', '#A100FF')
      root.style.setProperty('--accent-secondary', '#7B2FBE')
      root.style.setProperty('--glow-primary', 'rgba(161, 0, 255, 0.35)')
      root.style.setProperty('--glow-secondary', 'rgba(161, 0, 255, 0.15)')
      root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.4), 0 0 8px rgba(161,0,255,0.05)')
      root.style.setProperty('--shadow-md', '0 4px 12px rgba(0,0,0,0.5), 0 0 16px rgba(161,0,255,0.08)')
      root.style.setProperty('--shadow-lg', '0 10px 25px rgba(0,0,0,0.6), 0 0 24px rgba(161,0,255,0.1)')
    } else {
      root.style.colorScheme = 'light'
      root.style.setProperty('--bg-primary', '#ffffff')
      root.style.setProperty('--bg-secondary', '#f5f3f7')
      root.style.setProperty('--bg-tertiary', '#ece8f0')
      root.style.setProperty('--bg-hover', '#f0ecf4')
      root.style.setProperty('--text-primary', '#1a1a2e')
      root.style.setProperty('--text-secondary', '#6b6b80')
      root.style.setProperty('--text-tertiary', '#9090a7')
      root.style.setProperty('--border-subtle', '#d6d0de')
      root.style.setProperty('--border-muted', '#ece8f0')
      root.style.setProperty('--accent-primary', '#A100FF')
      root.style.setProperty('--accent-secondary', '#7B2FBE')
      root.style.setProperty('--glow-primary', 'rgba(161, 0, 255, 0.35)')
      root.style.setProperty('--glow-secondary', 'rgba(161, 0, 255, 0.15)')
      root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.12), 0 0 6px rgba(161,0,255,0.04)')
      root.style.setProperty('--shadow-md', '0 4px 12px rgba(0,0,0,0.2), 0 0 12px rgba(161,0,255,0.06)')
      root.style.setProperty('--shadow-lg', '0 10px 25px rgba(0,0,0,0.3), 0 0 20px rgba(161,0,255,0.08)')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
