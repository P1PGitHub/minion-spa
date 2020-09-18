<template>
  <DashedSection>
    <SectionHeader text="Client & Job Details" />
    <SolidSection>
      <FlexSection>
        <div class="w-full md:w-1/2 space-y-2">
          <label for="company-name" class="block">Company</label>
          <select
            name="company-name"
            id="company-name"
            class="form-select w-full bg-gray-100"
            :class="{
              'border-red-400': this.errors.includes('company_id'),
            }"
            @change="onCompanyChange"
            v-model="value.company_id"
            @input="update"
          >
            <option :value="null">Select a Company...</option>
            <option
              :value="company.id"
              v-for="company in $store.state.team.cwCompanies"
              :key="company.id"
              >{{ company.name }}</option
            >
          </select>
        </div>
        <div class="w-full md:w-1/2 space-y-2">
          <label for="location" class="block">Location</label>
          <input
            name="location"
            id="location"
            class="form-input w-full bg-gray-100"
            :class="{
              'border-red-400': this.errors.includes('location'),
            }"
            placeholder="Short Island, NY"
            v-model="value.location"
            @input="update"
          />
        </div>
      </FlexSection>
      <FlexSection>
        <div class="w-full md:w-1/2 space-y-2">
          <label for="client-name" class="block">Client Name</label>
          <input
            name="client-name"
            id="client-name"
            class="form-input w-full bg-gray-100"
            :class="{
              'border-red-400': this.errors.includes('client_name'),
            }"
            placeholder="John Doe"
            v-model="value.client_name"
            @input="update"
          />
        </div>
        <div class="w-full md:w-1/2 space-y-2">
          <label for="job-type" class="block">Job Type</label>
          <select
            name="job-type"
            id="job-type"
            class="form-select w-full bg-gray-100"
            :class="{
              'border-red-400': this.errors.includes('service_type'),
            }"
            placeholder="Service Trip"
            v-model="value.service_type"
            @input="update"
          >
            <option :value="null" selected>Please select a job type...</option>
            <option value="INSTALL">Installation</option>
            <option value="SALES">Sales</option>
            <option value="SERVICE">Service Call</option>
            <option value="TRAINING">Training</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </FlexSection>
      <div class="space-y-2">
        <label for="description" class="block">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          class="form-input w-full bg-gray-100"
          :class="{
            'border-red-400': this.errors.includes('description'),
          }"
          placeholder="Ingenico & Printer Installation"
          v-model="value.description"
          @input="update"
        />
      </div>
    </SolidSection>
  </DashedSection>
</template>

<script>
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'ClientDetailsFormHelper',
  components: {
    DashedSection,
    FlexSection,
    SectionHeader,
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
    onCompanyChange() {
      this.value.company_name = null
      if (this.value.company_id) {
        let company = this.$store.state.team.cwCompanies.find(
          (company) => company.id == this.value.company_id
        )
        this.value.company_name = company.name
        this.value.client_name = null
        this.value.location = null
        if (company.address && company.address.city != 'NA') {
          if (company.address.state) {
            this.value.location = `${company.address.city}, ${company.address.state}`
          } else {
            this.value.location = company.address.state
          }
        }
        if (company.contact) {
          this.value.client_name = company.contact.name
        }
      } else {
        console.log('no company selected')
      }
      this.update()
    },
    update() {
      this.$emit('input', this.value)
    },
    validate() {
      this.errors = []
      Object.keys(this.value).forEach((key) => {
        console.log(key)
        if (typeof this.value[key] == 'object' && this.value[key] !== null) {
          if (!this.value[key].id) {
            this.errors.push(key)
          }
        } else if (!this.value[key]) {
          this.errors.push(key)
        }
      })
      if (this.errors.length) {
        this.$root.$emit('showToast', {
          text: 'Please clear errors in the Client & Job Details section.',
          type: 'error',
        })
        return false
      } else {
        return true
      }
    },
  },
}
</script>
