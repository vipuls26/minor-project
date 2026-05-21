<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
  >
    <nav
      class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      
      <baseLogo />

      
<div class="hidden items-center space-x-4 md:flex">

  <RouterLink
    :to="{ name: 'home' }"
    :class="[
      'border-b-2 px-2 py-1 text-sm font-medium transition-colors duration-200',
      route.name === 'home'
        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
        : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
    ]"
  >
    Home
  </RouterLink>

  <RouterLink
    :to="{ name: 'events' }"
    :class="[
      'border-b-2 px-2 py-1 text-sm font-medium transition-colors duration-200',
      route.name === 'events'
        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
        : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
    ]"
  >
    All Events
  </RouterLink>

  <RouterLink
    :to="{ name: 'activeEvents' }"
    :class="[
      'border-b-2 px-2 py-1 text-sm font-medium transition-colors duration-200',
      route.name === 'activeEvents'
        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
        : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
    ]"
  >
    Upcoming Events
  </RouterLink>

</div>

      
      <div class="flex items-center gap-3">
        <ThemeMode />

        
        <button
          @click="toggleMenu"
          class="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors duration-200 hover:bg-slate-100 hover:text-indigo-600 focus:outline-none dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400 md:hidden"
          aria-label="Toggle menu"
        >
          <i
            :class="isMenuOpen ? 'pi pi-times' : 'pi pi-bars'"
            class="text-lg"
          ></i>
        </button>
      </div>
    </nav>

    
    <transition name="fade">
      <div
        v-show="isMenuOpen"
        class="border-t border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:hidden"
      >
        <div class="flex flex-col space-y-1">
          <RouterLink
            :to="{ name: 'home' }"
            @click="closeMenu"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            active-class="bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
          >
            Home
          </RouterLink>

          <RouterLink
            :to="{ name: 'events' }"
            @click="closeMenu"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            active-class="bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
          >
            Events
          </RouterLink>

          <RouterLink
            :to="{ name: 'activeEvents' }"
            @click="closeMenu"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            active-class="bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
          >
            Upcoming Events
          </RouterLink>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import baseLogo from '../baseui/baseLogo.vue'
import ThemeMode from '../common/ThemeMode.vue'

const route = useRoute()


const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>
