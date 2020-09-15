<template>
  <PageBody>
    <template v-slot:page-header>
      <h1 class="text-xl md:space-x-2">
        <span>
          CSQR Review
        </span>
        <span v-if="report" class="block md:inline text-base text-gray-700">
          {{ report.created_at | moment('ddd MMM DD, YYYY - HH:mm') }}</span
        >
      </h1>
      <ButtonLink fontSize="sm" :link="{ name: 'reports-csqr' }" theme="hollow"
        >Back</ButtonLink
      >
    </template>
    <template v-slot:page-content v-if="report">
      <FlexSection>
        <DashedSection class="w-full md:w-1/2" spacing="sm">
          <h2 class="text-xl text-blue-700">{{ report.company_name }}</h2>
          <h4>{{ report.client_name }}</h4>
          <h4>{{ report.location }}</h4>
          <h4>{{ report.service_type }}</h4>
          <h4 class="font-bold">{{ report.description }}</h4>
        </DashedSection>
        <DashedSection class="w-full md:w-1/2">
          <h2 class="text-xl text-blue-700">Additional Information</h2>
          <FlexSection spacing="sm">
            <div class="w-full md:w-1/2 space-y-2">
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  class="form-checkbox border-gray-600 rounded-full"
                  v-model="report.billable"
                  disabled
                />
                <span>Billable Job?</span>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  class="form-checkbox border-gray-600 rounded-full"
                  v-model="report.completed"
                  disabled
                />
                <span>Job Complete?</span>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  class="form-checkbox border-gray-600 rounded-full"
                  v-model="report.tested"
                  disabled
                />
                <span>Completed Tests?</span>
              </div>
            </div>
            <div class="w-full md:w-1/2 space-y-2">
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  class="form-checkbox border-gray-600 rounded-full"
                  v-model="report.pictures"
                  disabled
                />
                <span>Pictures Taken?</span>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  class="form-checkbox border-gray-600 rounded-full"
                  v-model="report.reviewed"
                  disabled
                />
                <span>Reviewed Job with Client?</span>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  class="form-checkbox border-gray-600 rounded-full"
                  v-model="report.satisfied"
                  disabled
                />
                <span>Client Satisfied?</span>
              </div>
            </div>
          </FlexSection>
        </DashedSection>
      </FlexSection>
      <DashedSection spacing="none" v-if="report.time_records.length">
        <h2 class="text-xl text-blue-700">
          Time Records
        </h2>
        <TimeRecordView
          v-for="(record, index) in report.time_records"
          :key="record.id"
          :record="record"
          :border="index !== report.time_records.length - 1"
        />
      </DashedSection>
      <DashedSection spacing="none" v-if="report.inventory_checkouts.length">
        <div class="flex items-center justify-between">
          <h2 class="text-xl text-blue-700">
            Inventory Used
          </h2>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              name="count-view"
              id="count-view"
              class="form-checkbox rounded-full border-gray-600"
              v-model="inventoryCountView"
            />
            <label for="count-view">Count View</label>
          </div>
        </div>

        <div v-if="inventoryCountView">
          <InventoryConsolidatedList :items="report.inventory_checkouts" />
        </div>
        <div v-else>
          <InventoryListHeader />
          <InventoryListItem
            v-for="(item, index) in report.inventory_checkouts"
            :key="item.id"
            :item="item"
            :border="index !== report.inventory_checkouts.length - 1"
          />
        </div>
      </DashedSection>
      <DashedSection>
        <h2 class="text-xl text-blue-700">Work Summary</h2>
        <p>{{ report.summary }}</p>
      </DashedSection>
      <DashedSection>
        <h2 class="text-xl text-blue-700">Client Agreement</h2>
        <AgreementClause :client="report.client_name" />
        <HeaderAside>
          <img :src="signURL" alt="Client Signature" class="h-24" />
          <h4 class="font-bold text-teal-700 mt-4">{{ report.client_name }}</h4>
        </HeaderAside>
      </DashedSection>

      <HeaderAside>
        This report has already been signed and processed by Minion. You are
        currently viewing historical data.
      </HeaderAside>
    </template>
  </PageBody>
</template>

<script>
import AgreementClause from '@/components/ui/agreementClause'
import ButtonLink from '@/components/ui/buttonLink'
import HeaderAside from '@/components/ui/headerAside'
import InventoryConsolidatedList from '@/components/ui/inventoryConsolidatedList'
import InventoryListHeader from '@/components/ui/inventoryListHeader'
import InventoryListItem from '@/components/ui/inventoryListItem'
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import PageBody from '@/components/ui/pageBody'
import TimeRecordView from '@/components/ui/timeRecordView'
export default {
  name: 'CSQRIDPreviewPage',
  middleware: ['auth'],
  components: {
    AgreementClause,
    ButtonLink,
    HeaderAside,
    InventoryConsolidatedList,
    InventoryListHeader,
    InventoryListItem,
    DashedSection,
    FlexSection,
    PageBody,
    TimeRecordView,
  },
  data() {
    return {
      inventoryCountView: false,
      report: null,
      reportCreatedData: null,
      signURL: null,
    }
  },
  async created() {
    if (this.$route.params.id) {
      this.$root.$emit('showLoading')
      this.report = await this.$store.dispatch(
        'api/get',
        `/reports/customer_service/${this.$route.params.id}/`
      )
      this.signURL = await this.$fireStorage
        .ref()
        .child(this.report.signature.ref)
        .getDownloadURL()
      this.$root.$emit('hideLoading')
    }
  },
}
</script>
