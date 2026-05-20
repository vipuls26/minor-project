<template>
  <Toaster
    position="top-right"
    :theme="theme"
    rich-colors
    expand
    :close-button="true"
    :toast-options="toastOptions"
  />
</template>

<script setup>
import { computed } from 'vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

const theme = computed(() => (themeStore.darkMode ? 'dark' : 'light'))

const toastOptions = {
  duration: 2500,
  classNames: {
    toast:
      'border border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
    title: 'text-slate-900 dark:text-slate-100',
    description: 'text-slate-600 dark:text-slate-300',
    actionButton: 'bg-sky-600 text-white',
    cancelButton: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    closeButton:
      'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
  },
}
</script>
