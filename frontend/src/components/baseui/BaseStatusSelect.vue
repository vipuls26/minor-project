<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>

    <div
      class="relative overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm transition focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 dark:border-slate-600 dark:bg-slate-950 dark:shadow-none dark:focus-within:ring-sky-950"
    >
      <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="min-w-0 w-full appearance-none border-0 bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-slate-700 outline-none [color-scheme:light] dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
      >
        <i class="pi pi-chevron-down text-sm"></i>
      </div>
    </div>
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
  options: {
    type: Array,
    default: () => [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]
  }
})

defineEmits(['update:modelValue'])
</script>
