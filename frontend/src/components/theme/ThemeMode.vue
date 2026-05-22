<script setup>
import { useThemeStore } from '@/stores/useThemeStore';
import { computed } from 'vue';

const themeStore = useThemeStore();

const iconClass = computed(() => (themeStore.darkMode ? 'pi pi-sun' : 'pi pi-moon'));
</script>

<template>
  <button type="button" :aria-label="themeStore.themeLabel"
    class="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 text-zinc-900 shadow-sm transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-md hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:text-indigo-500"
    @click="themeStore.toggleTheme">
    <Transition mode="out-in" enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in absolute" enter-from-class="opacity-0 rotate-90 scale-50"
      enter-to-class="opacity-100 rotate-0 scale-100" leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-90 scale-50">
      <i :key="iconClass" :class="iconClass" class="text-lg" aria-hidden="true"></i>
    </Transition>
  </button>
</template>
