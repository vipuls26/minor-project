import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {

  const darkMode = ref(true)

  function applyTheme(value) {

    darkMode.value = value

    document.documentElement.classList.toggle('dark', value)

    localStorage.setItem('theme', value ? 'dark' : 'light')
  }

  function initializeTheme() {

    const storedTheme = localStorage.getItem('theme')

    applyTheme(storedTheme === 'dark')
  }

  function toggleTheme() {
    applyTheme(!darkMode.value)
  }

  return {
    darkMode,
    initializeTheme,
    toggleTheme,
  }
})
