'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

interface DarkModeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function DarkModeToggle({ className = '', size = 'md' }: DarkModeToggleProps) {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    setMounted(true)
  }, [])

  // Update theme when toggled
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Update both class and color-scheme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    document.documentElement.style.colorScheme = newTheme === 'dark' ? 'dark' : 'light'
  }

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center rounded-2xl 
        bg-gray-200 dark:bg-gray-800 
        shadow-md transition-all duration-300 
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
        ${sizeClasses[size]} ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className={`${iconSizes[size]} text-gray-700 transition-transform duration-300`} />
      ) : (
        <Sun className={`${iconSizes[size]} text-yellow-400 transition-transform duration-300`} />
      )}
    </button>
  )
}

// Alternative compact version
export function DarkModeToggleCompact({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    setMounted(true)
  }, [])

  // Update theme when toggled
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Update both class and color-scheme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    document.documentElement.style.colorScheme = newTheme === 'dark' ? 'dark' : 'light'
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center rounded-xl
        bg-gray-200 dark:bg-gray-800 
        shadow-md transition-all duration-300 
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
        p-2 ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-gray-700 transition-transform duration-300" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-400 transition-transform duration-300" />
      )}
    </button>
  )
}