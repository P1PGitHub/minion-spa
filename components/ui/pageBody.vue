<template>
  <div class="flex flex-col items-center px-4">
    <section
      class="flex items-center justify-between w-full pb-4 border-b border-dashed border-gray-400"
    >
      <slot name="page-header"> </slot>
    </section>
    <main
      class="px-2 py-4 md:px-4 text-gray-800 container"
      :class="{
        'space-y-0': spacing == 'none',
        'space-y-2': spacing == 'sm',
        'space-y-4': spacing == 'md',
        'space-y-8': spacing == 'lg',
      }"
    >
      <slot name="page-content"></slot>
    </main>
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
