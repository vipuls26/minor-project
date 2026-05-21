<template>
  <div
    class="min-h-screen flex flex-col bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100"
  >
    <AppNotification />

    <HeaderView />

    <main class="flex-1">
      <RouterView />
    </main>

    <FooterView />
  </div>
</template>

<script setup>
import AppNotification from './components/common/AppNotification.vue'
import FooterView from './components/ui/FooterView.vue'
import HeaderView from './components/ui/HeaderView.vue'
</script>
