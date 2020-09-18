<template>
  <DashedSection>
    <SectionHeader text="Work Summary" />
    <HeaderAside
      >Please include the reason for the service, the service provided, and the
      final results of the service.</HeaderAside
    >
    <textarea
      name="work-summary"
      id="work-summary"
      class="form-textarea w-full h-40 shadow border"
      :class="{
        'border-red-400': this.error,
        'border-blue-400': !this.error,
      }"
      placeholder="Replaced Term6 EMV Device with new Ingenico Lane3000"
      v-model="value"
      @input="update"
    ></textarea>
  </DashedSection>
</template>

<script>
import DashedSection from '@/components/ui/dashedSection'
import HeaderAside from '@/components/ui/headerAside'
import SectionHeader from '@/components/ui/sectionHeader'
export default {
  name: 'WorkSummaryFormHelper',
  components: {
    DashedSection,
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
    update() {
      this.error = false
      this.$emit('input', this.value)
    },
    validate() {
      if (!this.value) {
        this.error = true
        this.$root.$emit('showToast', {
          text: 'Please add a summary for this csqr.',
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
