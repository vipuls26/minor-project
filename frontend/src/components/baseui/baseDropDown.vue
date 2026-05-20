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
            class="group relative min-w-44 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-sky-500 dark:border-slate-600 dark:bg-slate-900">
            <select id="event-date-filter" :value="modelValue"
                class="min-w-0 w-full appearance-none border-0 bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-slate-700 outline-none dark:bg-slate-900 dark:text-slate-100"
                @change="emit('update:modelValue', $event.target.value)">
                <option v-for="option in props.options" :key="option.value" :value="option.value"
                    class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                    {{ option.label }}
                </option>
            </select>

            <div
                class="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center border-l border-slate-300 bg-slate-100 text-slate-500 transition group-focus-within:border-sky-500 group-focus-within:text-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <i class="pi pi-chevron-down text-xs"></i>
            </div>
        </div>
    </div>
</template>
