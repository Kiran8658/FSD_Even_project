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
      root.style.setProperty('--bg-primary', '#0A0F1E')
      root.style.setProperty('--bg-secondary', '#111827')
      root.style.setProperty('--bg-tertiary', '#1E2D3D')
      root.style.setProperty('--bg-hover', '#1E2D3D')
      root.style.setProperty('--text-primary', '#E0F2FE')
      root.style.setProperty('--text-secondary', '#7EB8D4')
      root.style.setProperty('--text-tertiary', '#4A7A99')
      root.style.setProperty('--border-subtle', '#1E3A52')
      root.style.setProperty('--border-muted', '#162230')
      root.style.setProperty('--accent-primary', '#0EA5E9')
      root.style.setProperty('--accent-secondary', '#0284C7')
      root.style.setProperty('--glow-primary', 'rgba(14, 165, 233, 0.35)')
      root.style.setProperty('--glow-secondary', 'rgba(14, 165, 233, 0.15)')
      root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.4), 0 0 8px rgba(14,165,233,0.08)')
      root.style.setProperty('--shadow-md', '0 4px 12px rgba(0,0,0,0.5), 0 0 16px rgba(14,165,233,0.12)')
      root.style.setProperty('--shadow-lg', '0 10px 25px rgba(0,0,0,0.6), 0 0 24px rgba(14,165,233,0.15)')
    } else {
      root.style.colorScheme = 'light'
      root.style.setProperty('--bg-primary', '#ffffff')
      root.style.setProperty('--bg-secondary', '#f0f9ff')
      root.style.setProperty('--bg-tertiary', '#e0f2fe')
      root.style.setProperty('--bg-hover', '#e8f4fb')
      root.style.setProperty('--text-primary', '#0c1a2e')
      root.style.setProperty('--text-secondary', '#4a6075')
      root.style.setProperty('--text-tertiary', '#7a98b0')
      root.style.setProperty('--border-subtle', '#bae6fd')
      root.style.setProperty('--border-muted', '#e0f2fe')
      root.style.setProperty('--accent-primary', '#0EA5E9')
      root.style.setProperty('--accent-secondary', '#0284C7')
      root.style.setProperty('--glow-primary', 'rgba(14, 165, 233, 0.35)')
      root.style.setProperty('--glow-secondary', 'rgba(14, 165, 233, 0.15)')
      root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.10), 0 0 6px rgba(14,165,233,0.06)')
      root.style.setProperty('--shadow-md', '0 4px 12px rgba(0,0,0,0.15), 0 0 12px rgba(14,165,233,0.10)')
      root.style.setProperty('--shadow-lg', '0 10px 25px rgba(0,0,0,0.2), 0 0 20px rgba(14,165,233,0.12)')
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
