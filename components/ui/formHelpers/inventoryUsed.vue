<template>
  <div class="space-y-4">
    <SectionHeader text="Inventory Used" />
    <SolidSection spacing="sm">
      <InventoryHeader
        :class="{ 'pb-2 border-b border-dashed border-gray-400': value.length }"
      />
      <InventoryItem
        v-for="(item, index) in value"
        :key="index"
        v-model="value[index]"
        :index="index"
        :border="index !== value.length - 1"
        @copy="copy"
        @remove="remove"
      />
      <HeaderAside v-if="value.length == 0">
        No inventory items to display.
      </HeaderAside>
    </SolidSection>
    <InventoryNew @add="add" ref="newItem" />
  </div>
</template>

<script>
import HeaderAside from '@/components/ui/headerAside'
import InventoryHeader from '@/components/ui/formHelpers/inventory/header'
import InventoryItem from '@/components/ui/formHelpers/inventory/item'
import InventoryNew from '@/components/ui/formHelpers/inventory/new'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'InventoryUsedFormHelper',
  components: {
    HeaderAside,
    InventoryHeader,
    InventoryItem,
    InventoryNew,
    SectionHeader,
    SolidSection,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  methods: {
    add(item) {
      this.value.push(item)
    },
    copy(index) {
      this.$refs.newItem.set(this.value[index])
    },
    remove(index) {
      this.value.splice(index, 1)
    },
    update() {
      this.$emit('input', this.value)
    },
  },
}
</script>

<style></style>
