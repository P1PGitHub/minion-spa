<template>
  <aside
    class="flex items-center p-4 bg-gray-200 border border-gray-400 rounded dark:bg-gray-700 dark:text-white dark:border-gray-700"
  >
    <p class="w-full">
      <slot></slot>
    </p>
  </aside>
</template>

<script>
export default {
  name: 'HeaderAside',
}
</script>
