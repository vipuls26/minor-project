<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <p class="text-sm text-zinc-500 dark:text-zinc-400">
      Page {{ currentPage }} of {{ totalPages }}
    </p>

    <div class="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
      <button
        type="button"
        class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-indigo-600 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:text-indigo-500 sm:w-auto sm:py-2.5"
        :disabled="currentPage === 1"
        @click="goToPreviousPage"
      >
        <i class="pi pi-arrow-left text-xs" aria-hidden="true"></i>
        Previous
      </button>

      <button
        type="button"
        class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-indigo-600 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:text-indigo-500 sm:w-auto sm:py-2.5"
        :disabled="currentPage === totalPages"
        @click="goToNextPage"
      >
        Next
        <i class="pi pi-arrow-right text-xs" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:currentPage'])

function goToPreviousPage() {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

function goToNextPage() {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}
</script>
