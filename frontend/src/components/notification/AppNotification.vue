<template>
  <Toaster position="top-right" :theme="theme" rich-colors expand :close-button="true" :toast-options="toastOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import { useThemeStore } from '@/stores/useThemeStore'

const themeStore = useThemeStore()

const theme = computed(() => (themeStore.darkMode ? 'dark' : 'light'))

const toastOptions = {
  duration: 2500,
}
</script>
