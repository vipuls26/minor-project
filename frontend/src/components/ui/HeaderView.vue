<template>
  <header class="sticky top-0 z-50 bg-white shadow-md dark:bg-slate-800">
    <nav class="container mx-auto px-4 py-2 flex items-center justify-between">
      <baseLogo />

      <div class="hidden md:flex space-x-6 text-gray-700 font-medium">
        <RouterLink :to="{ name: 'home' }"
          class="p-2 text-slate-600 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          active-class="bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">
          Home
        </RouterLink>

        <RouterLink :to="{ name: 'events' }"
          class="p-2 text-slate-600 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          active-class="bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">
          All Events
        </RouterLink>

        <RouterLink :to="{ name: 'activeEvents' }"
          class="p-2 text-slate-600 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          active-class="bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">
          Upcoming Events
        </RouterLink>
      </div>

      <div class="flex items-center space-x-4">
        <ThemeMode />

        <button @click="toggleMenu" class="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle menu">
          <i :class="isMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl text-white"></i>
        </button>
      </div>
    </nav>

   <div v-show="isMenuOpen" class="md:hidden bg-white dark:bg-slate-900 px-4 py-3 border-t border-gray-200 dark:border-slate-700">
  <div class="flex flex-col space-y-2">
    <RouterLink 
      :to="{ name: 'home' }" 
      @click="closeMenu"
      class="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
      active-class="bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400"
    >
      Home
    </RouterLink>
    <RouterLink 
      :to="{ name: 'events' }" 
      @click="closeMenu"
      class="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
      active-class="bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400"
    >
      Events
    </RouterLink>
    <RouterLink 
      :to="{ name: 'activeEvents' }" 
      @click="closeMenu"
      class="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
      active-class="bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400"
    >
      Upcoming Events
    </RouterLink>
  </div>
</div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import baseLogo from '../baseui/baseLogo.vue'
import ThemeMode from '../common/ThemeMode.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>
