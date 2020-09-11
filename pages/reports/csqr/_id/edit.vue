<template>
  <PageBody>
    <template v-slot:page-header>
      <h1 class="text-xl md:space-x-2">
        <span>
          CSQR Draft Edit
        </span>
        <span v-if="report" class="block md:inline text-base text-gray-700">
          {{ report.created_at | moment('ddd MMM DD, YYYY - HH:mm') }}</span
        >
      </h1>
      <ButtonLink fontSize="sm" :link="{ name: 'reports-csqr' }"
        >Back</ButtonLink
      >
    </template>
    <template v-slot:page-content v-if="report">
      <RouteLeaveConfirm
        :override="false"
        allowText="Exit"
        denyText="Cancel"
        ref="routeLeaveConfirm"
      />
    </template>
  </PageBody>
</template>

<script>
import PageBody from '@/components/ui/pageBody'
import RouteLeaveConfirm from '@/components/common/RouteLeaveConfirm'
export default {
  name: 'CSQRIDEditPage',
  middleware: ['auth'],
  components: {
    PageBody,
    RouteLeaveConfirm,
  },
  data() {
    return {
      report: null,
    }
  },
  async created() {
    this.$root.$emit('showLoading')
    this.report = await this.$store.dispatch(
      'api/get',
      `/reports/customer_service/${this.$route.params.id}/`
    )
    console.log(this.report)
    // this.signURL = await this.$fireStorage
    //   .ref()
    //   .child(this.report.signature.ref)
    //   .getDownloadURL()
    this.$root.$emit('hideLoading')
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.routeLeaveConfirm.confirm(next)
  },
}
</script>
