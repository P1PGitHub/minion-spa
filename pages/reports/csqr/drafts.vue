<template>
  <PageBody>
    <template v-slot:page-header>
      <div class="flex items-center space-x-4">
        <SectionHeader bold size="lg" text="Team CSQR Reports" />
        <Loading v-if="isLoading" />
      </div>
      <ButtonLink fontSize="sm" :link="{ name: 'reports-csqr' }" theme="hollow"
        >Back</ButtonLink
      >
    </template>
    <template v-slot:page-content>
      <SolidSection>
        <SectionHeader :bold="true" text="All Drafts" size="lg" />

        <ReportListItem
          v-for="(report, index) in reports"
          :key="report.id"
          :draft="true"
          :report="report"
          :editLink="true"
          :border="index !== reports.length - 1"
          @reload="getCurrent"
        />

        <div class="flex items-center justify-end space-x-2">
          <ActionButton theme="hollow" spacing="sm" @click="getPrevious"
            >&lt;</ActionButton
          >
          <ActionButton theme="primary" spacing="sm"
            >{{ currentPage }} / {{ maxPage }}</ActionButton
          >
          <ActionButton theme="hollow" spacing="sm" @click="getNext"
            >&gt;</ActionButton
          >
        </div>
      </SolidSection>
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
import Loading from '@/components/common/loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'CSQRList',
  middleware: ['auth'],
  head: {
    title: 'Minion - CSQR Drafts',
  },
  components: {
    ActionButton,
    ButtonLink,
    Loading,
    PageBody,
    ReportListItem,
    SectionHeader,
    SolidSection,
  },
  data() {
    return {
      isLoading: true,
      reports: [],
      currentPage: 1,
      maxPage: 1,
    }
  },
  methods: {
    async getCurrent() {
      let reportResponse = await this.$store.dispatch(
        'api/get',
        `/reports/customer_service/drafts/?page=${this.currentPage}`
      )
      this.maxPage = Math.ceil(reportResponse.count / 25)
      this.reports = reportResponse.results
      this.isLoading = false
    },
    async getNext() {
      if (this.currentPage < this.maxPage) {
        this.isLoading = true
        let reportResponse = await this.$store.dispatch(
          'api/get',
          `/reports/customer_service/drafts/?page=${this.currentPage + 1}`
        )
        this.reports = reportResponse.results
        this.currentPage++
        this.maxPage = Math.ceil(reportResponse.count / 25)
        this.isLoading = false
      }
    },
    async getPrevious() {
      if (this.currentPage > 1) {
        this.isLoading = true
        let reportResponse = await this.$store.dispatch(
          'api/get',
          `/reports/customer_service/drafts/?page=${this.currentPage - 1}`
        )
        this.reports = reportResponse.results
        this.currentPage--
        this.maxPage = Math.ceil(reportResponse.count / 25)
        this.isLoading = false
      }
    },
  },
  async created() {
    await this.getCurrent()
  },
}
</script>
