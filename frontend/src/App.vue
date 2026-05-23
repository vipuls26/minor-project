<template>
  <div
    class="min-h-screen flex flex-col bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
    <AppNotification />

    <HeaderView />

    <main class="flex-1">
      <RouterView />
    </main>

    <FooterView />
  </div>
</template>

<script setup>
import AppNotification from './components/notification/AppNotification.vue'
import FooterView from './layouts/AppFooter.vue'
import HeaderView from './layouts/AppHeader.vue'
</script>
