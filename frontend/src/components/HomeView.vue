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
  <section class="relative min-h-screen w-full overflow-hidden bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat transition-colors duration-300">
    <div class="absolute inset-0  from-slate-950/82 via-slate-900/68 to-blue-950/72 dark:from-slate-950/92 dark:via-slate-950/82 dark:to-sky-950/78"></div>
    <div class="absolute inset-0 backdrop-blur-[3px]"></div>
    <div class="absolute inset-0 "></div>

    <div class="relative min-h-screen py-12">
      <div class="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="space-y-6  border border-white/14 bg-white/8 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-md md:p-8">
          <div class="space-y-4">
            <h1 class="text-2xl font-bold leading-tight text-white drop-shadow-[0_10px_30px_rgba(15,23,42,0.55)] md:text-5xl">
              Plan, organize, and manage every event in one place.
            </h1>
            <p class="text-base text-slate-200 md:text-lg">
              From seamless ticketing to guest management, access all the tools you need to execute flawless experiences.
            </p>
          </div>

          <ul class="flex flex-wrap gap-4 text-sm font-medium text-slate-100">
            <li class="flex items-center gap-2"><span class="text-sky-300"> <i class="pi pi-map-marker"></i> </span> Best Location</li>
            <li class="flex items-center gap-2"><span class="text-sky-300"> <i class="pi pi-money-bill"></i></span> Fit in Budget </li>
            <li class="flex items-center gap-2"><span class="text-sky-300"><i class="pi pi-users"></i> </span> Proper seamless experince </li>
          </ul>

          <div class="flex flex-col gap-3 sm:flex-row">
            <BaseButton label="Create Event" variant="primary" html-type="button" @click="openForm" />
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
          
          </div>
        </div>

        <CalendarView :events="store.eventsData" :loading="store.requests.fetchEvents" />
      </div>
    </div>
  </section>

  <FormAdd 
    :is-open="isFormOpen" 
    mode="create" 
    :loading="store.requests.createEvent" 
    :errors="formErrors" 
    @close="closeForm" 
    @submit="handleCreateEvent" 
  />
</template>
