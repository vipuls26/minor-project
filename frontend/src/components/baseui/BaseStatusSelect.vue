<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
      {{ label }}<span v-if="required" class="ml-1 text-red-600" aria-hidden="true">*</span>
    </label>

    <div
      class="relative overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-50 shadow-sm transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-white/10 dark:bg-zinc-900 dark:shadow-none dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-950"
    >
      <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="min-w-0 w-full appearance-none border-0 bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-zinc-900 outline-none dark:bg-zinc-900 dark:text-zinc-100"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l border-zinc-200/90 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400"
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
  required: {
    type: Boolean,
    default: false
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
