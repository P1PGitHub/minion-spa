<template>
  <div>
    <div
      class="flex items-center px-2 py-1 border-b border-dashed border-gray-400 text-sm md:text-base"
    >
      <span class="w-1/3">Description</span>
      <span class="w-1/3">Model Number</span>
      <span class="w-1/3">Quantity</span>
    </div>
    <div
      class="space-x-1 flex items-center px-2 py-1 text-sm md:text-base"
      :class="{
        'border-b border-dashed border-gray-400':
          index !== consolidatedItems.length - 1,
      }"
      v-for="(item, index) in consolidatedItems"
      :key="index"
    >
      <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
        item.description
      }}</span>
      <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
        item.model
      }}</span>
      <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
        item.quantity
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryConsolidatedList',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      consolidatedItems: [],
    }
  },
  created() {
    this.items.forEach((item) => {
      let itemIndex = this.consolidatedItems.findIndex((cItem) => {
        return (
          item.description == cItem.description && item.model == cItem.model
        )
      })
      if (itemIndex != -1) {
        this.consolidatedItems[itemIndex] = {
          ...this.consolidatedItems[itemIndex],
          quantity: this.consolidatedItems[itemIndex].quantity + 1,
        }
      } else {
        this.consolidatedItems.push({
          description: item.description,
          model: item.model,
          quantity: 1,
        })
      }
    })
  },
}
</script>
