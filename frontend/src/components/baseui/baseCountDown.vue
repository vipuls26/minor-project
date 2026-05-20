<template>
  <div
    v-if="status === 'upcoming'"
    class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300"
  >
    <slot name="icon">
      <i class="pi pi-stopwatch"></i>
    </slot>
    <span>{{ timeLeft }}</span>
  </div>
  <div
    v-else-if="status === 'started'"
    class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
  >
    <slot name="started">
      <span>Live now</span>
    </slot>
  </div>
  <div
    v-else
    class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
  >
    <slot name="ended">
      <span>Ended</span>
    </slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  targetDate: {
    type: [String, Date, Number],
    required: true
  },
  endDate: {
    type: [String, Date, Number],
    default: null
  }
});

const emit = defineEmits(['expired']);
const distance = ref(0);
const endDistance = ref(null);
let timer = null;

const updateTimer = () => {
  const start = new Date(props.targetDate).getTime();
  const now = new Date().getTime();
  distance.value = Math.max(0, start - now);
  endDistance.value = props.endDate ? new Date(props.endDate).getTime() - now : null;

  if (start - now <= 0 && !props.endDate) {
    clearInterval(timer);
    emit('expired');
  }
};

const status = computed(() => {
  if (distance.value > 0) {
    return 'upcoming';
  }

  if (endDistance.value !== null && endDistance.value <= 0) {
    return 'ended';
  }

  return 'started';
});

const timeLeft = computed(() => {
  if (status.value !== 'upcoming') return '00:00:00';

  const days = Math.floor(distance.value / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance.value % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance.value % (1000 * 60)) / 1000);

  const pad = (num) => String(num).padStart(2, '0');

  return days > 0 
    ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});

updateTimer();

onMounted(() => {
  timer = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
