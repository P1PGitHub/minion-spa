<template>
  <div class="w-full md:flex items-center">
    <h3 class="w-full md:w-4/12 whitespace-no-wrap overflow-x-hidden">
      Description
    </h3>
    <h3 class="w-full md:w-3/12 whitespace-no-wrap overflow-x-hidden">
      Serial Number
    </h3>
    <h3 class="w-full md:w-3/12 whitespace-no-wrap overflow-x-hidden">
      Model Number
    </h3>
    <h3 class="w-full md:w-2/12 whitespace-no-wrap overflow-x-hidden">
      Actions
    </h3>
  </div>
</template>

<script>
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'InventoryHeader',
  components: {
    SolidSection,
  },
}
</script>

<style></style>
