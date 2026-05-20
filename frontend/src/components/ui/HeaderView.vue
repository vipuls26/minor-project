<template>
  <header class="sticky top-0 z-50 px-3 pt-3 sm:px-4">
    <nav class="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/50 bg-white/70 px-4 py-3 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/72">
      <baseLogo />

      <div class="hidden items-center gap-2 md:flex">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="group relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-300"
          active-class="text-sky-700 dark:text-sky-300"
        >
          {{ link.label }}
          <span
            class="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-sky-500 transition-transform duration-300 group-hover:scale-x-100"
          ></span>
        </RouterLink>
      </div>

      <div class="flex items-center space-x-3">
        <ThemeMode />
      </div>
    </nav>

    <div class="mx-auto mt-3 flex max-w-5xl gap-2 overflow-x-auto rounded-[1.5rem] border border-white/50 bg-white/80 p-2 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80 md:hidden">
      <RouterLink
        v-for="link in navLinks"
        :key="link.name"
        :to="{ name: link.name }"
        class="flex-1 whitespace-nowrap rounded-full px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100/90 hover:text-sky-600 dark:text-slate-200 dark:hover:bg-slate-800/90 dark:hover:text-sky-300"
        active-class="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import baseLogo from '../baseui/baseLogo.vue'
import ThemeMode from '../common/ThemeMode.vue'

const navLinks = [
  { name: 'home', label: 'Home' },
  { name: 'events', label: 'All Events' },
  { name: 'activeEvents', label: 'Upcoming Events' },
]
</script>
