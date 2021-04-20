<template>
  <div class="flex flex-col items-center min-h-screen overflow-y-hidden">
    <header class="w-full pb-4 px-4 container mx-auto">
      <div
        class="flex items-center justify-between text-gray-800 dark:text-white bg-white dark:bg-gray-800 border-2 border-blue-500 shadow rounded p-4"
      >
        <slot name="page-header"> </slot>
      </div>
    </header>
    <main
      class="px-6 pt-4 pb-8 md:px-8 text-gray-800 dark:text-white container h-full"
      :class="{
        'space-y-0': spacing == 'none',
        'space-y-2': spacing == 'sm',
        'space-y-4': spacing == 'md',
        'space-y-8': spacing == 'lg',
      }"
    >
      <slot name="page-content"></slot>
    </main>
    <div>
      <slot name="modals"></slot>
    </div>
    <footer
      class="w-full mt-auto bg-gray-200 dark:bg-gray-900 border-t border-dashed border-gray-400 dark:border-gray-700 p-4 text-gray-700 dark:text-gray-200 space-y-1 text-sm"
    >
      <h3 class="text-base font-semibold">Minion</h3>
      <p>
        Please report any bugs or features requests to
        <a href="mailto:devin.s@priority1pos.com" class="underline"
          >devin.s@priority1pos.com</a
        >
      </p>
      <div class="flex flex-wrap items-center space-x-4">
        <nuxt-link to="/" class="underline">Home</nuxt-link>
        <nuxt-link :to="{ name: 'settings' }" class="underline"
          >Settings</nuxt-link
        >
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PageBody',
  props: {
    spacing: {
      type: String,
      required: false,
      default: 'md',
    },
  },
}
</script>
