<template>
  <h1
    :class="{
      'font-bold': bold,
      'text-blue-700': color == 'primary',
      'text-black': color == 'black',
      'text-gray-700': color == 'gray',
      'text-lg': size == 'sm',
      'text-xl': size == 'md',
      'text-2xl': size == 'lg',
      'text-4xl': size == 'xl',
    }"
  >
    {{ text }}
  </h1>
</template>

<script>
export default {
  name: 'SectionHeader',
  props: {
    bold: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    size: {
      type: String,
      required: false,
      default: 'md',
    },
    text: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>
