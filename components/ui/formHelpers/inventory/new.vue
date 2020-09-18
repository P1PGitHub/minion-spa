<template>
  <SolidSection :flex="true" spacing="sm">
    <div class="w-full md:w-4/12 space-y-2">
      <label for="inventory-description" class="block whitespace-no-wrap"
        >Description</label
      >
      <input
        name="inventory-description"
        id="inventory-description"
        type="text"
        class="form-input w-full bg-gray-100"
        :class="{
          'border-red-400': error,
        }"
        placeholder="Ingenico Lane3000"
        v-model="item.description"
      />
    </div>
    <div class="w-full md:w-3/12 space-y-2">
      <label for="inventory-sn" class="block whitespace-no-wrap overflow-hidden"
        >Serial Number</label
      >
      <input
        name="inventory-sn"
        id="inventory-sn"
        type="text"
        class="form-input w-full bg-gray-100"
        :class="{
          'border-red-400': error,
        }"
        placeholder="123456789-00"
        v-model="item.serial"
      />
    </div>
    <div class="w-full md:w-3/12 space-y-2">
      <label
        for="inventory-model-number"
        class="block whitespace-no-wrap overflow-hidden"
        >Model Number</label
      >
      <input
        name="inventory-model-number"
        id="inventory-model-number"
        type="text"
        class="form-input w-full bg-gray-100"
        :class="{
          'border-red-400': error,
        }"
        placeholder="LANE3000-1234"
        v-model="item.model"
      />
    </div>
    <div class="w-full md:w-2/12 space-y-2">
      <h3>Actions</h3>
      <div class="flex items-stretch space-x-2">
        <ActionButton theme="danger" spacing="sm" @click="reset" class="w-1/3"
          ><img src="@/assets/svg/other/remove-r.svg" alt="Reset Icon"
        /></ActionButton>
        <ActionButton spacing="sm" @click="add" class="w-2/3"
          ><span>Add</span> <span>+</span></ActionButton
        >
      </div>
    </div>
  </SolidSection>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'InventoryNewForm',
  components: {
    ActionButton,
    SolidSection,
  },
  data() {
    return {
      error: false,
      item: {
        description: null,
        model: null,
        serial: null,
      },
    }
  },
  methods: {
    add() {
      this.error = false
      if (this.item.description && this.item.model && this.item.serial) {
        this.$emit('add', this.item)
        this.reset()
      } else {
        this.error = true
        this.$root.$emit('showToast', {
          text:
            'Please fill out all fields for the new item coming from our inventory.',
          type: 'error',
        })
      }
    },
    reset() {
      this.error = false
      this.item = { description: null, model: null, serial: null }
    },
    set(newItem) {
      this.error = false
      this.item = {
        description: newItem.description,
        model: newItem.model,
        serial: newItem.serial,
      }
    },
  },
}
</script>
