<template>
  <div>
    <div
      class="fixed left-0 top-0 z-30 md:w-full max-w-128 max-h-128 md:max-h-full bg-white border-2 rounded shadow-lg mt-4 p-4 space-y-4 transform duration-300 ease-in-out overflow-y-scroll"
      :class="{
        '-translate-x-128': !show,
        'mx-4': show,
        'border-green-300': entry.resolved,
        'border-orange-300': !entry.resolved,
      }"
    >
      <div class="flex items-center justify-between">
        <SectionHeader text="New Journal Entry" />
        <ActionButton spacing="sm" theme="hollow" @click="reset"
          ><img src="@/assets/svg/arrows/sync.svg" alt="Reset Icon" class="h-4"
        /></ActionButton>
      </div>

      <div class="space-y-2">
        <label for="company-name" class="block">Company</label>
        <select
          name="company-name"
          id="company-name"
          class="form-select w-full bg-gray-100"
          v-model="entry.company_id"
        >
          <!-- 
        :class="{
        'border-red-400': this.errors.includes('company_id'),
        }"
        @change="onCompanyChange"
        @input="update" -->
          <option :value="null">Select a Company...</option>
          <option
            :value="company.id"
            v-for="company in $store.state.team.cwCompanies"
            :key="company.id"
            >{{ company.name }}</option
          >
        </select>
      </div>
      <div class="space-y-2">
        <label for="client-name" class="block">Client Name</label>
        <input
          name="client-name"
          id="client-name"
          placeholder="John Doe"
          class="form-input w-full bg-gray-100"
          v-model="entry.client_name"
        />
        <!-- :class="{
              'border-red-400': this.errors.includes('client_name'),
            }"
            @input="update" -->
      </div>

      <div class="space-y-2">
        <label for="description" class="block">Description</label>
        <input
          name="description"
          id="description"
          placeholder="John Doe"
          class="form-input w-full bg-gray-100"
          v-model="entry.description"
        />
        <!-- :class="{
              'border-red-400': this.errors.includes('client_name'),
            }"
            @input="update" -->
      </div>

      <div class="space-x-2 flex items-start">
        <div class="space-y-2 w-1/2">
          <label for="entry-start" class="block">Start</label>
          <TimePicker nameID="entry-start" v-model="entry.start" />
        </div>
        <div class="space-y-2 w-1/2">
          <label for="entry-end" class="block">End</label>
          <TimePicker nameID="entry-end" side="right" v-model="entry.end" />
        </div>

        <!-- :class="{
              'border-red-400': this.errors.includes('client_name'),
            }"
            @input="update" -->
      </div>

      <div class="space-y-2">
        <label for="summary" class="block">Summary</label>
        <textarea
          name="summary"
          id="summary"
          placeholder="John Doe"
          class="form-textarea w-full bg-gray-100 h-32"
          v-model="entry.summary"
        ></textarea>
        <!-- :class="{
              'border-red-400': this.errors.includes('client_name'),
            }"
            @input="update" -->
      </div>

      <div class="space-x-2 flex items-center">
        <input
          name="resolved"
          id="resolved"
          placeholder="John Doe"
          class="form-checkbox rounded-full bg-gray-200 border-gray-600"
          type="checkbox"
          v-model="entry.resolved"
        />
        <label for="resolved">Resolved</label>
        <!-- :class="{
              'border-red-400': this.errors.includes('client_name'),
            }"
            @input="update" -->
      </div>
      <FlexSection class="pb-4">
        <ActionButton
          spacing="sm"
          theme="hollow"
          class="w-full md:w-1/2"
          @click="close"
          >Close</ActionButton
        >
        <ActionButton spacing="sm" class="w-full md:w-1/2">Add</ActionButton>
      </FlexSection>
    </div>
    <div
      class="fixed inset-0 z-20 bg-white bg-opacity-50"
      tabindex="-1"
      v-show="show"
      @click="close"
    ></div>
  </div>
</template>

<script>
import moment from 'moment'
import ActionButton from '@/components/ui/actionButton'
import FlexSection from '@/components/ui/flexSection'
import SectionHeader from '@/components/ui/sectionHeader'
import TimePicker from '@/components/ui/timePicker'
export default {
  name: 'NewJournalModal',
  components: {
    ActionButton,
    FlexSection,
    SectionHeader,
    TimePicker,
  },
  data() {
    return {
      entry: {
        company_id: null,
        company_name: null,
        client_name: null,
        start: moment().subtract('30', 'minutes').format('HH:mm'),
        end: moment().format('HH:mm'),
        description: null,
        summary: null,
        followup: null,
        resolved: true,
      },
      show: false,
    }
  },
  methods: {
    close() {
      this.show = false
    },
    reset() {
      this.entry = {
        company_id: null,
        company_name: null,
        client_name: null,
        start: moment().subtract('30', 'minutes').format('HH:mm'),
        end: moment().format('HH:mm'),
        description: null,
        summary: null,
        followup: null,
        resolved: true,
      }
    },
  },
  created() {
    this.$root.$on('showJournalModal', () => (this.show = true))
  },
}
</script>
