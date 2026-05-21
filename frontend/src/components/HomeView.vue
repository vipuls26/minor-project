<script setup>
import { onMounted, ref } from 'vue'
import { eventStore } from '@/stores/eventStore'
import BaseButton from './baseButton/BaseButton.vue'
import CalendarView from './common/CalendarView.vue'
import FormAdd from './common/FormAdd.vue'

const isFormOpen = ref(false)
const formErrors = ref({})
const store = eventStore()



onMounted(() => {
  if (!store.eventsData.length) {
    store.fetchEvent()
  }
})

function openForm() {
  formErrors.value = {}
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  formErrors.value = {}
}

async function handleCreateEvent(payload) {
  const result = await store.createEvent(payload)

  if (result.ok) {
    closeForm()
    return
  }

  formErrors.value = {
    general: result.message,
    fields: result.errors,
  }
}
</script>

<template>
  <section class="min-h-screen w-full bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat transition-colors duration-300">
    <div class="min-h-screen bg-white/80 py-12 dark:bg-zinc-950/85">
      <div class="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="space-y-6">
          <div class="space-y-4">
            <h1 class="text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
              Plan, organize, and manage every event in one place.
            </h1>
            <p class="text-base text-zinc-500 dark:text-zinc-400 md:text-lg">
              From seamless ticketing to guest management, access all the tools you need to execute flawless experiences.
            </p>
          </div>

          <ul class="flex flex-wrap gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <li class="flex items-center gap-2"><span class="text-indigo-600 dark:text-indigo-500"> <i class="pi pi-map-marker"></i> </span> Best Location</li>
            <li class="flex items-center gap-2"><span class="text-indigo-600 dark:text-indigo-500"> <i class="pi pi-money-bill"></i></span> Fit in Budget </li>
            <li class="flex items-center gap-2"><span class="text-indigo-600 dark:text-indigo-500"> <i class="pi pi-users"></i> </span> Proper seamless experince </li>
          </ul>

          <div class="flex flex-col gap-3 sm:flex-row">
            <BaseButton label="Create Event" variant="primary" html-type="button" @click="openForm" />
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
          
          </div>
        </div>

        <CalendarView :events="store.eventsData" :loading="store.loading" />
      </div>
    </div>
  </section>

  <FormAdd 
    :is-open="isFormOpen" 
    mode="create" 
    :loading="store.loading" 
    :errors="formErrors" 
    @close="closeForm" 
    @submit="handleCreateEvent" 
  />
</template>
