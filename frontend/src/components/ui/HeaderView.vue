<template>
  <header
    class="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

      <baseLogo />

      <!-- desktop navigation -->
      <div class="hidden items-center space-x-4 md:flex">

        <RouterLink :to="{ name: 'home' }" :class="[
          'border-b-2 px-2.5 py-1.5 text-sm font-medium transition-colors duration-200',
          route.name === 'home'
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400'
        ]">
          Home
        </RouterLink>

        <RouterLink :to="{ name: 'events' }" :class="[
          'border-b-2 px-2.5 py-1.5 text-sm font-medium transition-colors duration-200',
          route.name === 'events'
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400'
        ]">
          All Events
        </RouterLink>

        <RouterLink :to="{ name: 'activeEvents' }" :class="[
          'border-b-2 px-2.5 py-1.5 text-sm font-medium transition-colors duration-200',
          route.name === 'activeEvents'
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400'
        ]">
          Upcoming Events
        </RouterLink>

      </div>

      <!-- mobile navigation -->
      <div class="flex items-center gap-3">
        <ThemeMode />
        <button @click="toggleMenu"
          class="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-900 transition-colors duration-200 hover:bg-zinc-50 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:text-zinc-100 dark:hover:bg-white/5 dark:hover:text-indigo-400 md:hidden"
          aria-label="Toggle menu">
          <i :class="isMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-base"></i>
        </button>
      </div>
    </nav>

    <transition name="fade">
      <div v-show="isMenuOpen"
        class="border-t border-zinc-200/80 bg-white/90 px-3 py-2 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/90 md:hidden">
        <div class="flex flex-col space-y-0.5">

          <RouterLink :to="{ name: 'home' }" @click="closeMenu"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-indigo-400"
            active-class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            Home
          </RouterLink>

          <RouterLink :to="{ name: 'events' }" @click="closeMenu"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-indigo-400"
            active-class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            Events
          </RouterLink>

          <RouterLink :to="{ name: 'activeEvents' }" @click="closeMenu"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-indigo-400"
            active-class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
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


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
