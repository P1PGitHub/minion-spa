<template>
  <PageBody>
    <template v-slot:page-header>
      <h1 class="text-xl md:space-x-2" v-if="$route.params.id == 'new'">
        New CSQR Report
      </h1>
      <h1 class="text-xl md:space-x-2" v-else>
        <span>
          CSQR Draft Edit
        </span>
        <span
          v-if="report"
          class="block md:inline text-base text-gray-700 dark:text-gray-300"
        >
          {{ report.created_at | moment('ddd MMM DD, YYYY - HH:mm') }}</span
        >
      </h1>
      <ButtonLink fontSize="sm" :link="{ name: 'reports-csqr' }"
        >Back</ButtonLink
      >
    </template>
    <template v-slot:page-content v-if="Object.keys(report).length > 0">
      <RouteLeaveConfirm
        :override="false"
        allowText="Exit"
        denyText="Cancel"
        ref="routeLeaveConfirm"
      />
      <ClientDetailsFormHelper v-model="clientDetails" ref="clientDetails" />
      <TimeRecordsFormHelper
        v-model="report.time_records"
        :reportID="String($route.params.id)"
        ref="timeRecords"
      />
      <InventoryUsedFormHelper v-model="report.inventory_checkouts" />
      <WorkSummaryFormHelper
        v-model="report.summary"
        ref="workSummary"
        @generate="generateSummary"
      />
      <AdditionalInfoFormHelper v-model="addInfo" />
      <FlexSection>
        <ActionButton
          spacing="sm"
          theme="hollow"
          @click="save(true)"
          class="w-full md:w-1/2"
          >Save as Draft</ActionButton
        >
        <ActionButton spacing="sm" @click="save" class="w-full md:w-1/2"
          >Save & Preview</ActionButton
        >
      </FlexSection>
    </template>
  </PageBody>
</template>

<script>
import moment from 'moment'
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
  head: {
    title: 'Minion - CSQR Edit',
  },
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
      report: {},
      addInfo: {},
      clientDetails: {},
    }
  },
  methods: {
    buildReport() {
      let clientDetialsValid = this.$refs.clientDetails.validate()
      let timeRecordsValid = this.$refs.timeRecords.validate()
      let workSummaryValid = this.$refs.workSummary.validate()
      if (clientDetialsValid && timeRecordsValid && workSummaryValid) {
        return {
          ...this.report,
          ...this.addInfo,
          ...this.clientDetails,
        }
      } else {
        return null
      }
    },
    generateSummary() {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message:
          "Are you sure you want to replace the work summary with the notes for this report's time records?",
      })
      this.$root.$once('modalClose', (choice) => {
        if (choice) {
          let newSummary = ''
          this.report.time_records.forEach((timeRecord) => {
            newSummary += moment(timeRecord.start).format('MMM DD, YYYY')
            newSummary += '\n'
            if (timeRecord.notes) {
              newSummary += timeRecord.notes
            } else {
              newSummary += 'No notes provided.'
            }
            newSummary += '\n\n'
          })
          this.report.summary = newSummary.trim()
        }
      })
    },
    async save(pushDrafts) {
      let reportObj = this.buildReport()
      if (reportObj) {
        this.$root.$emit('showLoading')
        if (this.$route.params.id !== 'new') {
          await Promise.all([this.clearInventory(), this.clearTimeRecords()])
        }
        await this.saveReport(reportObj, pushDrafts)
        this.$root.$emit('hideLoading')
      }
    },
    async saveReport(reportObj, pushDrafts) {
      let inventory = [...reportObj.inventory_checkouts]
      let timeRecords = [...reportObj.time_records]
      delete reportObj.inventory_checkouts
      delete reportObj.time_records
      let updateResponse
      if (this.$route.params.id !== 'new') {
        updateResponse = await this.$store.dispatch('api/put', {
          url: `/reports/customer_service/${reportObj.id}/`,
          data: reportObj,
        })
      } else {
        updateResponse = await this.$store.dispatch('api/post', {
          url: `/reports/customer_service/`,
          data: reportObj,
        })
        reportObj.id = updateResponse.id
      }

      let inventoryResponse = await this.$store.dispatch('api/post', {
        url: `/reports/${reportObj.id}/inventory/`,
        data: inventory,
      })
      let timeRecordResponse = await this.$store.dispatch('api/post', {
        url: `/reports/${reportObj.id}/time_entry/`,
        data: timeRecords,
      })
      this.$refs.routeLeaveConfirm.setOverride(true)
      if (pushDrafts) {
        this.$router.push({
          name: 'reports-csqr-drafts',
        })
      } else {
        this.$router.push({
          name: 'reports-csqr-id',
          params: { id: updateResponse.id },
        })
      }
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
    if (this.$route.params.id !== 'new') {
      this.report = await this.$store.dispatch(
        'api/get',
        `/reports/customer_service/${this.$route.params.id}/`
      )
      this.report.last_edited_by = this.$store.state.account.account.id
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
        followup: this.report.followup,
      }
    } else {
      this.report = {
        draft: true,
        inventory_checkouts: [],
        report_type: 'CUSTOMER_SERVICE',
        summary: '',
        team: this.$store.state.team.team.id,
        last_edited_by = this.$store.state.account.account.id,
        time_records: [
          {
            end: new Date(),
            start: moment().subtract(1, 'hours').toDate(),
            report: this.reportID,
            users: [],
          },
        ],
      }
      this.clientDetails = {
        company_id: null,
        company_name: null,
        location: null,
        client_name: null,
        service_type: null,
        description: null,
      }
      this.addInfo = {
        billable: false,
        completed: false,
        pictures: false,
        reviewed: false,
        satisfied: false,
        tested: false,
        followup: null,
      }
    }

    this.$root.$emit('hideLoading')
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.routeLeaveConfirm.confirm(next)
  },
}
</script>
