<template>
  <div
    class="space-x-1 flex items-center px-2 py-1 text-sm md:text-base"
    :class="{
      'border-b border-dashed border-gray-400': border,
    }"
  >
    <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
      item.description
    }}</span>
    <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
      item.serial
    }}</span>
    <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
      item.model
    }}</span>
  </div>
</template>

<script>
export default {
  name: 'InventoryListItem',
  props: {
    border: {
      type: Boolean,
      required: false,
      default: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>
