<template>
  <nuxt-link
    class="flex items-center justify-center font-bold rounded"
    :class="{
      'text-sm': fontSize == 'sm',
      'text-md': fontSize == 'md',
      'text-lg': fontSize == 'lg',
      'space-x-0 px-2 py-1': spacing == 'none',
      'space-x-2 px-2 py-1': spacing == 'sm',
      'space-x-4 px-4 py-2': spacing == 'md',
      'space-x-8 px-8 py-4': spacing == 'lg',
      'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700':
        theme == 'primary',
      'bg-white text-teal-700 border border-teal-700 hover:bg-teal-200':
        theme == 'secondary',
      'text-gray-800 border border-gray-800 hover:bg-gray-200':
        theme == 'hollow',
      'text-white border border-white hover:bg-gray-400 hover:bg-opacity-25':
        theme == 'hollow-light',
      'cursor-not-allowed': disable,
    }"
    :to="link"
    tag="button"
    :disabled="disable"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script>
export default {
  name: 'buttonLink',
  props: {
    disable: {
      type: Boolean,
      required: false,
      default: false,
    },
    link: {
      type: Object,
      required: false,
      default: () => {
        return {
          name: 'index',
        }
      },
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
