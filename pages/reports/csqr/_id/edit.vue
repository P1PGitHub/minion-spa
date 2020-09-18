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
      <ClientDetailsFormHelper v-model="clientDetails" ref="clientDetails" />
      <TimeRecordsFormHelper
        v-model="report.time_records"
        :reportID="report.id"
        ref="timeRecords"
      />
      <InventoryUsedFormHelper v-model="report.inventory_checkouts" />
      <WorkSummaryFormHelper v-model="report.summary" ref="workSummary" />
      <AdditionalInfoFormHelper v-model="addInfo" />
      <ActionButton spacing="sm" @click="save" class="w-full"
        >Save & Preview</ActionButton
      >
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import AdditionalInfoFormHelper from '@/components/ui/formHelpers/additionalInfo'
import ClientDetailsFormHelper from '@/components/ui/formHelpers/clientDetails'
import InventoryUsedFormHelper from '@/components/ui/formHelpers/inventoryUsed'
import PageBody from '@/components/ui/pageBody'
import RouteLeaveConfirm from '@/components/common/RouteLeaveConfirm'
import TimeRecordsFormHelper from '@/components/ui/formHelpers/timeRecords'
import WorkSummaryFormHelper from '@/components/ui/formHelpers/workSummary'
export default {
  name: 'CSQRIDEditPage',
  middleware: ['auth'],
  components: {
    ActionButton,
    AdditionalInfoFormHelper,
    ClientDetailsFormHelper,
    InventoryUsedFormHelper,
    PageBody,
    RouteLeaveConfirm,
    TimeRecordsFormHelper,
    WorkSummaryFormHelper,
  },
  data() {
    return {
      report: null,
      addInfo: {},
      clientDetails: {},
    }
  },
  methods: {
    buildReport() {
      if (
        this.$refs.clientDetails.validate() &&
        this.$refs.timeRecords.validate() &&
        this.$refs.workSummary.validate()
      ) {
        return {
          ...this.report,
          ...this.addInfo,
          ...this.clientDetails,
        }
      } else {
        return null
      }
    },
    async save() {
      let reportObj = this.buildReport()
      if (reportObj) {
        this.$root.$emit('showLoading')
        await Promise.all([this.clearInventory(), this.clearTimeRecords()])
        await this.saveReport(reportObj)
        this.$root.$emit('hideLoading')
      }
    },
    async saveReport(reportObj) {
      console.log(reportObj)
      let inventory = [...reportObj.inventory_checkouts]
      let timeRecords = [...reportObj.time_records]
      delete reportObj.inventory_checkouts
      delete reportObj.time_records
      let updateResponse = await this.$store.dispatch('api/put', {
        url: `/reports/customer_service/${reportObj.id}/`,
        data: reportObj,
      })
      let inventoryResponse = await this.$store.dispatch('api/post', {
        url: `/reports/${reportObj.id}/inventory/`,
        data: inventory,
      })
      let timeRecordResponse = await this.$store.dispatch('api/post', {
        url: `/reports/${reportObj.id}/time_entry/`,
        data: timeRecords,
      })
      this.$refs.routeLeaveConfirm.setOverride(true)
      this.$router.push({
        name: 'reports-csqr-id',
        params: { id: updateResponse.id },
      })
    },
    async clearInventory() {
      let clearResponse = await this.$store.dispatch(
        'api/delete',
        `/reports/${this.report.id}/inventory/clear/`
      )
    },
    async clearTimeRecords() {
      let clearResponse = await this.$store.dispatch(
        'api/delete',
        `/reports/${this.report.id}/time_entry/clear/`
      )
    },
  },

  async created() {
    this.$root.$emit('showLoading')
    this.report = await this.$store.dispatch(
      'api/get',
      `/reports/customer_service/${this.$route.params.id}/`
    )
    this.clientDetails = {
      company_id: this.report.company_id,
      company_name: this.report.company_name,
      location: this.report.location,
      client_name: this.report.client_name,
      service_type: this.report.service_type,
      description: this.report.description,
    }
    this.addInfo = {
      billable: this.report.billable,
      completed: this.report.completed,
      pictures: this.report.pictures,
      reviewed: this.report.reviewed,
      satisfied: this.report.satisfied,
      tested: this.report.tested,
    }
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
