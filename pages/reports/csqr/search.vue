<template>
  <PageBody>
    <template v-slot:page-header>
      <h1 class="text-xl">CSQR Search</h1>
    </template>
    <template v-slot:page-content>
      <SolidSection>
        <div class="flex items-center justify-between">
          <SectionHeader size="lg" text="Search Parameters" />
          <ActionButton spacing="sm" @click="submitQuery">
            <inline-svg
              :src="require('@/assets/svg/buttons/search.svg')"
              class="h-6 w-auto"
            />
            <span>Search</span>
          </ActionButton>
        </div>

        <form
          @submit.prevent="submitQuery"
          class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4"
        >
          <fieldset>
            <label for="search-date-range">Date Range</label>
            <v-date-picker
              color="blue"
              :input-props="{
                class:
                  'form-input w-full mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600',
                id: 'searh-date-range',
                name: 'search-date-range',
              }"
              :is-dark="$colorMode.value == 'dark'"
              :max-date="new Date()"
              :popover="{ visibility: 'click' }"
              title-position="left"
              mode="range"
              v-model="query.dates"
            />
          </fieldset>
          <fieldset class="space-y-2">
            <label for="search-author">Report Author</label>
            <select
              name="search-author"
              id="search-author"
              class="form-select bg-gray-100 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              v-model="query.author"
              ><option :value="null">All Authors</option>
              <option disabled>---------------</option>
              <option
                :value="member.id"
                v-for="member in $store.state.team.members"
                :key="member.id"
                >{{ member.last_name }}, {{ member.first_name }}</option
              >
            </select>
          </fieldset>
          <fieldset class="space-y-2">
            <label for="search-client">Client</label>
            <select
              name="search-client"
              id="search-client"
              class="form-select w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              v-model="query.client"
            >
              <option :value="null">All Companies</option>
              <option
                :value="company.id"
                v-for="company in $store.state.team.cwCompanies"
                :key="company.id"
              >
                {{ company.name }}
              </option>
            </select>
          </fieldset>
          <fieldset class="flex items-center space-x-2 mt-2 md:mt-8">
            <input
              type="checkbox"
              name="search-include-drafts"
              id="search-include-drafts"
              class="form-checkbox rounded h-8 w-8 bg-gray-200 dark:bg-gray-600 border-gray-600"
              v-model="query.drafts"
            />
            <label for="search-include-drafts" class="text-lg"
              >Include Drafts</label
            >
          </fieldset>
        </form>
      </SolidSection>
      <SolidSection v-if="reports && reports.length">
        <ReportListItem
          v-for="(report, index) in reports"
          :key="report.id"
          :report="report"
          :border="index !== reports.length - 1"
          :draft="report.draft"
        />
      </SolidSection>
      <SolidSection v-else-if="reports === null" class="flex justify-center">
        <SectionHeader
          size="lg"
          text="Please select your parameters and press the Search button"
          bold
        />
      </SolidSection>
      <SolidSection v-else class="flex justify-center">
        <SectionHeader
          size="lg"
          text="Minion couldn't find any CSQ Reports with those parameters."
          bold
        />
      </SolidSection>
    </template>
  </PageBody>
</template>

<script>
import moment from 'moment'

import ActionButton from '@/components/ui/actionButton'
import PageBody from '@/components/ui/PageBody'
import ReportListItem from '@/components/ui/reportListItem'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection.vue'
export default {
  name: 'CSQRSearch',
  components: {
    ActionButton,
    PageBody,
    ReportListItem,
    SectionHeader,
    SolidSection,
  },
  middleware: ['auth'],
  data() {
    return {
      isLoading: false,
      query: {
        author: null,
        client: null,
        dates: {
          start: moment().subtract(7, 'days').toDate(),
          end: new Date(),
        },
        drafts: false,
      },
      reports: null,
    }
  },
  methods: {
    async submitQuery() {
      this.isLoading = true
      this.reports = await this.$store.dispatch('api/post', {
        url: '/reports/customer_service/query/',
        data: this.query,
      })
      this.isLoading = false
    },
  },
}
</script>

<style></style>
