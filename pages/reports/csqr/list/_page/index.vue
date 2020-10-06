<template>
  <PageBody>
    <template v-slot:page-header>
      <div class="flex items-center space-x-4">
        <h1 class="text-xl">Team CSQR Reports</h1>
        <Loading v-if="isLoading" />
      </div>
      <ButtonLink fontSize="sm" :link="{ name: 'reports-csqr' }" theme="hollow"
        >Back</ButtonLink
      >
    </template>
    <template v-slot:page-content>
      <div>
        <ReportListItem
          v-for="(report, index) in reports"
          :key="report.id"
          :report="report"
          :border="index !== reports.length - 1"
        />
      </div>
      <div class="flex items-center justify-end space-x-2">
        <ButtonLink
          theme="hollow"
          spacing="sm"
          :link="{
            name: 'reports-csqr-list-page',
            params: { page: currentPage - 1 },
          }"
          :disable="!(currentPage > 1)"
          >&lt;</ButtonLink
        >
        <ActionButton theme="primary" spacing="sm"
          >{{ currentPage }} / {{ maxPage }}</ActionButton
        >
        <ButtonLink
          theme="hollow"
          spacing="sm"
          :link="{
            name: 'reports-csqr-list-page',
            params: {
              page: currentPage + 1,
            },
          }"
          :disable="currentPage >= maxPage"
          >&gt;</ButtonLink
        >
      </div>
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
import Loading from '@/components/common/Loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
export default {
  name: 'CSQRList',
  middleware: ['auth'],
  head: {
    title: 'Minion - CSQR',
  },
  components: {
    ActionButton,
    ButtonLink,
    Loading,
    PageBody,
    ReportListItem,
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
    async getNext() {
      if (this.currentPage < this.maxPage) {
        this.isLoading = true
        let reportResponse = await this.$store.dispatch(
          'api/get',
          `/reports/customer_service/simple?page=${this.currentPage + 1}`
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
          `/reports/customer_service/simple?page=${this.currentPage - 1}`
        )
        this.reports = reportResponse.results
        this.currentPage--
        this.maxPage = Math.ceil(reportResponse.count / 25)
        this.isLoading = false
      }
    },
  },
  async created() {
    this.currentPage = this.$route.params.page
    try {
      let reportResponse = await this.$store.dispatch(
        'api/get',
        `/reports/customer_service/simple?page=${this.currentPage}`
      )
      this.maxPage = Math.ceil(reportResponse.count / 25)
      this.reports = reportResponse.results
      this.isLoading = false
    } catch (err) {
      console.log(err)
      this.$route.params.page = 1
      this.currentPage = 1
      let reportResponse = await this.$store.dispatch(
        'api/get',
        `/reports/customer_service/simple?page=${this.currentPage}`
      )
      this.maxPage = Math.ceil(reportResponse.count / 25)
      this.reports = reportResponse.results
      this.isLoading = false
    }
  },
}
</script>
