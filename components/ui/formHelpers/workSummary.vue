<template>
  <div class="space-y-4">
    <div class="flex items center justify-between">
      <SectionHeader text="Work Summary" />
      <ActionButton spacing="sm" theme="hollow" @click="generate">
        <inline-svg
          :src="require('@/assets/svg/other/time.svg')"
          fill="fill-current"
          class="h-6 w-auto text-gray-800 dark:text-white"
        ></inline-svg>
      </ActionButton>
    </div>

    <HeaderAside
      >Please include the reason for the service, the service provided, and the
      final results of the service.</HeaderAside
    >
    <textarea
      name="work-summary"
      id="work-summary"
      class="rounded w-full h-40 shadow-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600"
      :class="{
        'border-red-400': this.error,
        'border-blue-400': !this.error,
      }"
      placeholder="Replaced Term6 EMV Device with new Ingenico Lane3000"
      v-model="value"
      @input="update"
    ></textarea>
  </div>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import HeaderAside from '@/components/ui/headerAside'
import SectionHeader from '@/components/ui/sectionHeader'
export default {
  name: 'WorkSummaryFormHelper',
  components: {
    ActionButton,
    HeaderAside,
    SectionHeader,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      error: false,
    }
  },
  methods: {
    generate() {
      this.error = false
      this.$emit('generate')
    },
    update() {
      this.error = false
      this.$emit('input', this.value)
    },
    validate() {
      if (!this.value || this.value.length == 0) {
        this.error = true
        this.$root.$emit('showToast', {
          text: 'Please add a summary for this report.',
          type: 'error',
        })
        return false
      } else {
        this.error = false
        return true
      }
    },
  },
}
</script>

<style></style>
