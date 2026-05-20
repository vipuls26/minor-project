<template>
    <div class="flex items-center justify-end">
        <label for="event-date-filter" class="sr-only">Filter events by date</label>
        <select id="event-date-filter" :value="modelValue"
            class="min-w-44 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            @change="emit('update:modelValue', $event.target.value)">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup>
defineProps({
    modelValue: { type: String, default: 'all' },
    options: {
        type: Array,
        default: () => [
            { label: 'today', value: 'today' },
            { label: 'tomorrow', value: 'tomorrow' },
            { label: 'next week', value: 'next_week' },
            { label: 'all', value: 'all' }
        ],
    },
})

const emit = defineEmits(['update:modelValue'])
</script>
