<template>
  <DashedSection>
    <SectionHeader text="Additional Information" />
    <SolidSection>
      <FlexSection>
        <div class="w-full md:w-1/2 space-x-2 flex items-center">
          <input
            type="checkbox"
            name="billable"
            id="billable"
            class="form-checkbox bg-gray-100 rounded-full border-gray-400"
            v-model="value.billable"
            @input="update"
          />
          <label for="billable">Billable Job?</label>
        </div>
        <div class="w-full md:w-1/2 space-x-2 flex items-center">
          <input
            type="checkbox"
            name="completed"
            id="completed"
            class="form-checkbox bg-gray-100 rounded-full border-gray-400"
            v-model="value.completed"
            @input="update"
          />
          <label for="completed">Job Complete?</label>
        </div>
      </FlexSection>
      <FlexSection>
        <div class="w-full md:w-1/2 space-x-2 flex items-center">
          <input
            type="checkbox"
            name="tested"
            id="tested"
            class="form-checkbox bg-gray-100 rounded-full border-gray-400"
            v-model="value.tested"
            @input="update"
          />
          <label for="tested">Completed Tests?</label>
        </div>
        <div class="w-full md:w-1/2 space-x-2 flex items-center">
          <input
            type="checkbox"
            name="pictures"
            id="pictures"
            class="form-checkbox bg-gray-100 rounded-full border-gray-400"
            v-model="value.pictures"
            @input="update"
          />
          <label for="pictures">Pictures Taken?</label>
        </div>
      </FlexSection>
      <FlexSection>
        <div class="w-full md:w-1/2 space-x-2 flex items-center">
          <input
            type="checkbox"
            name="reviewed"
            id="reviewed"
            class="form-checkbox bg-gray-100 rounded-full border-gray-400"
            v-model="value.reviewed"
            @input="update"
          />
          <label for="reviewed">Reviewed Job with Client?</label>
        </div>
        <div class="w-full md:w-1/2 space-x-2 flex items-center">
          <input
            type="checkbox"
            name="satisfied"
            id="satisfied"
            class="form-checkbox bg-gray-100 rounded-full border-gray-400"
            v-model="value.satisfied"
            @input="update"
          />
          <label for="satisfied">Client Satisfied?</label>
        </div>
      </FlexSection>
      <div
        class="w-full md:flex items-center space-y-2 md:space-x-2 md:space-y-0"
      >
        <label for="follow-up-notes" class="whitespace-no-wrap"
          >Follow Up?</label
        >
        <input
          type="text"
          class="form-input w-full bg-gray-100 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Return with New Printer"
          v-model="value.followup"
          @input="update"
        />
      </div>
    </SolidSection>
  </DashedSection>
</template>

<script>
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'AdditionalInfoFormHelper',
  components: {
    DashedSection,
    FlexSection,
    SolidSection,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      errors: [],
    }
  },
  methods: {
    update() {
      this.$emit('input', this.value)
    },
  },
}
</script>
