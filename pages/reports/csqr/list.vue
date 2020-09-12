<template>
  <PageBody>
    <template v-slot:page-header>
      <div class="flex items-center space-x-4">
        <h1 class="text-xl">Team CSQR Reports</h1>
        <Loading v-if="isLoading" />
      </div>
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
        <ButtonLink theme="hollow" spacing="sm">&lt;</ButtonLink>
        <ButtonLink theme="primary" spacing="sm">1 / 4</ButtonLink>
        <ButtonLink theme="hollow" spacing="sm">&gt;</ButtonLink>
      </div>
    </template>
  </PageBody>
</template>

<script>
import ButtonLink from '@/components/ui/buttonLink'
import Loading from '@/components/common/Loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
export default {
  name: 'CSQRList',
  components: {
    ButtonLink,
    Loading,
    PageBody,
    ReportListItem,
  },
  data() {
    return {
      isLoading: true,
      reports: [],
    }
  },
  async created() {
    this.reports = await this.$store.dispatch(
      'api/get',
      '/reports/customer_service/simple/'
    )
    this.isLoading = false
  },
}
</script>
