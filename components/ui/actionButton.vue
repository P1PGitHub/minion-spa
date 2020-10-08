<template>
  <button
    class="flex items-center justify-center font-bold rounded whitepsace-no-wrap"
    :class="{
      'text-sm': fontSize == 'sm',
      'text-md': fontSize == 'md',
      'text-lg': fontSize == 'lg',
      'space-x-0 px-2 py-1': spacing == 'none',
      'space-x-2 px-2 py-1': spacing == 'sm',
      'space-x-4 px-4 py-2': spacing == 'md',
      'space-x-8 px-8 py-4': spacing == 'lg',
      'cursor-not-allowed': disabled,
      'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700':
        theme == 'primary',
      'bg-white text-teal-700 border border-teal-700 hover:bg-teal-200 dark:text-teal-800 dark:bg-teal-400 dark:border-teal-600 dark:hover:bg-teal-600 dark:hover:text-white':
        theme == 'secondary',
      'text-gray-800 border border-gray-800 hover:bg-gray-200 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-700':
        theme == 'hollow',
      'text-white border border-white hover:bg-gray-400 hover:bg-opacity-25 dark:border-gray-800 dark:text-gray-800 dark:hover:bg-gray-200':
        theme == 'hollow-light',
      ' bg-red-200 text-red-800 border border-red-300 hover:bg-red-300':
        theme == 'danger',
    }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'buttonLink',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    fontSize: {
      type: String,
      required: false,
      default: 'md',
    },
    spacing: {
      type: String,
      required: false,
      default: 'md',
    },
    theme: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
}
</script>
