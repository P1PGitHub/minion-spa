<template>
  <section
    class="p-4 border border-dashed border-gray-400 rounded"
    :class="{
      'space-y-0': spacing == 'none',
      'space-y-2': spacing == 'sm',
      'space-y-4': spacing == 'md',
      'space-y-8': spacing == 'lg',
      'flex items-center': flex,
      'justify-center': flexCenter,
    }"
  >
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'DashedSection',
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
