<template>
  <section
    class="bg-white rounded shadow border border-blue-400"
    :class="{
      'p-1 space-y-0': spacing == 'none',
      'p-2 space-y-2': spacing == 'sm',
      'p-4 space-y-4': spacing == 'md',
      'p-4 space-y-8': spacing == 'lg',
      'md:flex items-center ': flex,
      'md:space-y-0 md:space-x-0': flex && spacing == 'none',
      'md:space-y-0 md:space-x-2': flex && spacing == 'sm',
      'md:space-y-0 md:space-x-4': flex && spacing == 'md',
      'md:space-y-0 md:space-x-8': flex && spacing == 'lg',
      'justify-center': flexCenter,
    }"
  >
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'SolidSection',
  props: {
    flex: {
      type: Boolean,
      required: false,
      default: false,
    },
    flexCenter: {
      type: Boolean,
      required: false,
      default: false,
    },
    spacing: {
      type: String,
      required: false,
      default: 'md',
    },
  },
}
</script>
