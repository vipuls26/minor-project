<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>

    <div
      class="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition focus-within:border-sky-500 dark:bg-slate-950"
      :class="error ? 'border-red-600 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'"
    >
    <select
  :id="id"
  :value="modelValue"
  class="min-w-0 w-full appearance-none border-0 bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-slate-900 outline-none dark:bg-slate-900 dark:text-slate-100"
  @change="$emit('update:modelValue', $event.target.value)"
>
  <option
    class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
    value="active"
  >
    Active
  </option>

  <option
    class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
    value="inactive"
  >
    Inactive
  </option>
</select>

      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center border-l border-slate-300 bg-slate-100 text-slate-500 transition group-focus-within:border-sky-500 group-focus-within:text-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
      >
        <i class="pi pi-chevron-down text-xs"></i>
      </div>
    </div>

    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Status'
  },
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
