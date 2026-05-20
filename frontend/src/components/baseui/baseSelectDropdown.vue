<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    
    <select
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
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
  }
})

defineEmits(['update:modelValue'])
</script>
