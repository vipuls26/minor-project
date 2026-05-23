# Frontend Guide

This frontend is built with Vue 3, Vue Router, and Pinia.

If the code feels unfamiliar, start with these files in this order:

1. `src/main.js`
   This is the app entry point. It creates Vue, adds Pinia, adds the router, and mounts the app.
2. `src/App.vue`
   This is the main layout. It shows the header, page content, footer, and notifications.
3. `src/router/index.js`
   This decides which page component loads for each URL.
4. `src/pages/HomeView.vue`
   This is the landing page and the easiest place to follow create-event flow.
5. `src/components/event/EventView.vue`
   This shows the full event list, filtering, pagination, and edit dialogs.
6. `src/stores/useEventStore.js`
   This is the shared data layer. It talks to the backend API and stores event data.

## Quick Mental Model

- Pages handle screen-level behavior.
- Components handle reusable UI.
- The Pinia store handles API calls and shared state.
- Modals collect form input and send it back up to the page.

## Folder Map

- `src/pages`
  Top-level screens loaded by the router.
- `src/components`
  Reusable parts of the UI such as cards, modals, and buttons.
- `src/stores`
  Shared state and backend requests.
- `src/api`
  Axios setup for talking to the Laravel backend.
- `src/services`
  Small app helpers like notifications.

## Running The App

```sh
npm install
npm run dev
```

## Small Reading Tips

- Read the `<script setup>` part before the `<template>` in Vue files.
- Look for `ref(...)` values first. Those are the small pieces of data the component controls.
- Look for `onMounted(...)` next. That is where data is usually loaded.
- Look for functions starting with `handle` or `open` or `close`. Those usually map directly to button clicks.
