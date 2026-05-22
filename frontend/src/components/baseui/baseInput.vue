<script setup>
defineProps({
  label: String,
  required: {
    type: Boolean,
    default: false,
  },
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
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
      {{ label }}<span v-if="required" class="ml-1 text-red-600" aria-hidden="true">*</span>
    </label>
    <div class="relative w-full">
      <div v-if="icon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 dark:text-zinc-400">
        <i :class="`pi ${icon}`"></i>
      </div>

      <input :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full rounded-xl border bg-zinc-50 px-4 py-2.5 text-zinc-900 outline-none transition-colors focus:border-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-100 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-indigo-500 dark:focus-visible:ring-indigo-950"
        :class="[
          error ? 'border-red-600 dark:border-red-500' : 'border-zinc-200/90 dark:border-white/10',
          icon ? 'pl-11' : 'px-4'
        ]" :min="min" />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
