<template>
  <aside
    class="flex items-center p-4 bg-gray-200 border border-gray-400 rounded"
  >
    <p class="w-full">
      <slot></slot>
    </p>
  </aside>
</template>

<script>
export default {
  name: 'Aside',
}
</script>
