<template>
  <h1
    :class="{
      'font-bold': bold,
      'text-blue-700 dark:text-blue-300': color == 'primary',
      'text-black dark:text-white': color == 'black',
      'text-gray-700 dark:text-gray-300': color == 'gray',
      'text-xs md:text-sm': size == 'xxs',
      'text-sm md:text-base': size == 'xs',
      'text-md md:text-lg': size == 'sm',
      'text-lg md:text-xl': size == 'md',
      'text-xl md:text-2xl': size == 'lg',
      'text-2xl md:text-4xl': size == 'xl',
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
