<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  error: String,
  id: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  min: [String, Number],
  icon: String
});

defineEmits(['update:modelValue']);



</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    <div class="relative w-full">
      <div v-if="icon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
        <i :class="`pi ${icon}`"></i>
      </div>

      <input :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500" :class="[
          error ? 'border-red-600 dark:border-red-500' : 'border-slate-200 dark:border-slate-700',
          icon ? 'pl-11' : 'px-4' 
        ]" :min="min" />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
