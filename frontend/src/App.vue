<template>
  <div
    class="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
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
