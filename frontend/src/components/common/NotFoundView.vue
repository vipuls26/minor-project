<template>
  <section
    class="relative overflow-hidden bg-white px-4 py-16 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100 sm:px-6 lg:px-8"
  >
    <div
      class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_32%)] dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_28%)]"
    />

    <div class="mx-auto flex min-h-[calc(100vh-220px)] max-w-4xl items-center justify-center">
      <div
        class="w-full max-w-2xl rounded-3xl border border-zinc-200/80 bg-white/85 p-8 text-center shadow-2xl shadow-indigo-100/50 backdrop-blur dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-black/25 sm:p-12"
      >
        <span
          class="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
        >
          Error 404
        </span>

        <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base">
          The page you are looking for may have been moved, renamed, or never existed in the
          first place.
        </p>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
   
          <button
            type="button"
            class="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:border-indigo-600 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:text-indigo-400 sm:w-auto"
            @click="$router.back()"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  </section>
</template>
