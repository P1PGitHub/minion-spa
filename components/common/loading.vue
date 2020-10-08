<template>
  <inline-svg
    :src="require('@/assets/svg/other/spinner-two-theme.svg')"
    class="w-auto animate-spin"
    :class="{
      'h-4': size == 'sm',
      'h-6': size == 'md',
      'h-8': size == 'lg',
      'h-12': size == 'xl',
      'h-20': size == '2xl',
    }"
  ></inline-svg>
</template>

<script>
export default {
  name: 'LoadingIcon',
  props: {
    size: {
      type: String,
      required: false,
      default: 'md',
    },
  },
}
</script>
