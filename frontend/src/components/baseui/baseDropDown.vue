<script setup>
const props = defineProps({
    modelValue: { type: String, default: 'all' },
    options: {
        type: Array,
        default: () => [
            { label: 'today', value: 'today' },
            { label: 'tomorrow', value: 'tomorrow' },
            { label: 'next week', value: 'next_week' },
            { label: 'all', value: 'all' },
        ],
    },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex items-center justify-end">
        <label for="event-date-filter" class="sr-only">Filter events by date</label>

        <div
            class="group relative min-w-44 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.45)] transition-all duration-200 focus-within:-translate-y-px focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/15 dark:border-slate-700/80 dark:bg-slate-900/90 dark:focus-within:border-sky-400 dark:focus-within:ring-sky-400/10">
            <select id="event-date-filter" :value="modelValue"
                class="min-w-0 w-full appearance-none border-0 bg-transparent px-4 py-3 pr-12 text-sm font-medium text-slate-700 outline-none dark:bg-slate-900 dark:text-slate-100"
                @change="emit('update:modelValue', $event.target.value)">
                <option v-for="option in props.options" :key="option.value" :value="option.value"
                    class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                    {{ option.label }}
                </option>
            </select>

            <div
                class="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l border-slate-200 bg-slate-50/90 text-slate-500 transition group-focus-within:border-sky-500 group-focus-within:text-sky-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                <i class="pi pi-chevron-down text-xs"></i>
            </div>
        </div>
    </div>
</template>
