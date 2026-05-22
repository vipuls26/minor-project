import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/useThemeStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

useThemeStore(pinia).initializeTheme()

app.mount('#app')
