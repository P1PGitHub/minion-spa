<template>
  <section
    class="md:flex items-stretch w-full"
    :class="{
      'space-y-0 md:space-x-0': spacing == 'none',
      'space-y-2 md:space-y-0 md:space-x-2': spacing == 'sm',
      'space-y-4 md:space-y-0 md:space-x-4': spacing == 'md',
      'space-y-8 md:space-y-0 md:space-x-8': spacing == 'lg',
    }"
  >
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'FlexSection',
  props: {
    spacing: {
      type: String,
      required: false,
      default: 'md',
    },
  },
}
</script>
