<template>
  <div v-if="status === 'upcoming'">
    <slot name="icon">
      <i class="pi pi-stopwatch"></i>
    </slot>
    <span> : {{ timeLeft }}</span>
  </div>
  <div v-else-if="status === 'started'">
    <slot name="started">
      <span>Event started!</span>
    </slot>
  </div>
  <div v-else>
    <slot name="ended">
      <span>Event ended!</span>
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
