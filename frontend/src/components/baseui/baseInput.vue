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
    <label v-if="label" :for="id" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    <div class="relative w-full">
      <div v-if="icon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
        <i :class="`pi ${icon}`"></i>
      </div>

      <input :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full rounded-2xl border bg-white/95 px-4 py-3.5 text-slate-900 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:-translate-y-px focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15 dark:bg-slate-950/90 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-400/15" :class="[
          error ? 'border-red-600 focus:border-red-600 focus:ring-red-500/15 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/15' : 'border-slate-200 dark:border-slate-700',
          icon ? 'pl-11' : 'px-4' 
        ]" :min="min" />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
