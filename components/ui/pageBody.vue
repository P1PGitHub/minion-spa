<template>
  <div class="flex flex-col items-center min-h-screen">
    <header
      class="flex items-center justify-between w-full pb-4 px-2 border-b border-dashed border-gray-400 text-gray-800 dark:text-white"
    >
      <slot name="page-header"> </slot>
    </header>
    <main
      class="px-6 py-4 md:px-8 text-gray-800 dark:text-white container h-full"
      :class="{
        'space-y-0': spacing == 'none',
        'space-y-2': spacing == 'sm',
        'space-y-4': spacing == 'md',
        'space-y-8': spacing == 'lg',
      }"
    >
      <slot name="page-content"></slot>
    </main>
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
