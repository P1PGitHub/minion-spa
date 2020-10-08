<template>
  <div
    class="md:flex flex-wrap items-center pb-2 space-y-1 md:space-y-0 text-sm md:text-base"
    :class="{
      'border-b border-dashed border-gray-300': border,
    }"
  >
    <p class="w-full md:w-4/12 whitespace-no-wrap overflow-x-hidden">
      <span v-if="!value.id">*</span>
      {{ value.description }}
    </p>
    <p class="w-full md:w-3/12 whitespace-no-wrap overflow-x-hidden">
      {{ value.serial }}
    </p>
    <p class="w-full md:w-3/12 whitespace-no-wrap overflow-x-hidden">
      {{ value.model }}
    </p>
    <div
      class="w-full md:w-2/12 whitespace-no-wrap overflow-x-hidden flex space-x-2"
    >
      <ActionButton spacing="sm" theme="secondary" @click="copy" class="w-1/2">
        <inline-svg
          :src="require('@/assets/svg/content/copy.svg')"
          fill="fill-current"
          class="h-4 w-auto"
        ></inline-svg>
      </ActionButton>
      <ActionButton spacing="sm" theme="danger" @click="remove" class="w-1/2">
        <inline-svg
          :src="require('@/assets/svg/other/remove-r.svg')"
          fill="fill-current"
          class="h-4 w-auto text-red-800"
        ></inline-svg>
      </ActionButton>
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
export default {
  name: 'InventoryItem',
  components: {
    ActionButton,
  },
  props: {
    border: {
      type: Boolean,
      required: false,
      default: true,
    },
    index: {
      type: Number,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  methods: {
    copy() {
      this.$emit('copy', this.index)
    },
    remove() {
      this.$emit('remove', this.index)
    },
  },
}
</script>

<style></style>
