<template>
  <PageBody>
    <template v-slot:page-header v-if="report">
      <h1 class="text-xl md:space-x-2">
        <span>
          CSQR Review
        </span>
        <span
          v-if="report"
          class="block md:inline text-base text-gray-700 dark:text-gray-300"
        >
          {{ report.created_at | moment('ddd MMM DD, YYYY - HH:mm') }}</span
        >
      </h1>
      <ButtonLink
        fontSize="sm"
        :link="prevPage"
        theme="hollow"
        v-if="report.draft"
        >Back</ButtonLink
      >
      <ButtonLink fontSize="sm" :link="prevPage" theme="hollow" v-else
        >Back</ButtonLink
      >
    </template>
    <template v-slot:page-content v-if="report">
      <FlexSection>
        <SolidSection class="w-full md:w-1/2">
          <div class="space-y-2">
            <h2 class="text-xl text-blue-700 dark:text-blue-300">
              {{ report.company_name }}
            </h2>
            <h4>{{ report.client_name }}</h4>
            <h4>{{ report.location }}</h4>
            <h4>{{ report.service_type }}</h4>
            <h4>{{ report.description }}</h4>
          </div>
        </SolidSection>
        <SolidSection class="w-full md:w-1/2">
          <h2 class="text-xl text-blue-700 dark:text-blue-300">
            Additional Information
          </h2>
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
        </SolidSection>
      </FlexSection>
      <SolidSection v-if="report.time_records.length">
        <h2 class="text-xl text-blue-700 dark:text-blue-300">
          Time Records
        </h2>
        <TimeRecordView
          v-for="(record, index) in report.time_records"
          :key="record.id"
          :record="record"
          :border="index !== report.time_records.length - 1"
        />
      </SolidSection>
      <SolidSection v-if="report.inventory_checkouts.length">
        <div class="flex items-center justify-between">
          <h2 class="text-xl text-blue-700 dark:text-blue-300">
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
      </SolidSection>
      <SolidSection>
        <h2 class="text-xl text-blue-700 dark:text-blue-300">Work Summary</h2>
        <p class="whitespace-pre-wrap">{{ report.summary }}</p>
      </SolidSection>
      <SolidSection v-if="report.followup">
        <h2 class="text-xl text-blue-700 dark:text-blue-300">Followup Notes</h2>
        <p class="whitespace-pre-wrap">{{ report.followup }}</p>
      </SolidSection>
      <SolidSection v-if="report.draft">
        <SectionHeader text="Client Agreement" />
        <div class="flex items-start space-x-4">
          <input
            type="checkbox"
            name="client-agreement"
            id="client-agreement"
            class="form-checkbox rounded-full border-gray-600 mt-1"
            v-model="clientAgreement"
            :disabled="clientAgreement"
          />
          <AgreementClause :client="report.client_name" />
        </div>
        <SignPad v-if="clientAgreement" @save="saveSignature" />
        <SignPreview
          :data="signData"
          :clientName="report.client_name"
          @clear="clearSignData"
          v-if="signData"
        />
      </SolidSection>
      <SolidSection v-else>
        <h2 class="text-xl text-blue-700 dark:text-blue-300">
          Client Agreement
        </h2>
        <AgreementClause :client="report.client_name" />
        <HeaderAside v-if="report.signature">
          <img :src="signURL" alt="Client Signature" class="h-24" />
          <h4 class="font-bold text-teal-700 mt-4 dark:text-teal-300">
            {{ report.client_name }}
          </h4>
        </HeaderAside>
      </SolidSection>

      <FlexSection v-if="report.draft">
        <div class="w-full md:w-1/2">
          <ActionButton theme="hollow" class="w-full" @click="saveDraft"
            >Save as Draft</ActionButton
          >
        </div>
        <div class="w-full md:w-1/2">
          <ActionButton class="w-full" :disabled="!signFile" @click="publish"
            >Publish</ActionButton
          >
        </div>
      </FlexSection>
      <HeaderAside v-else>
        This report has already been signed and processed by Minion. You are
        currently viewing historical data.
      </HeaderAside>
    </template>
  </PageBody>
</template>

<script>
var slugify = require('slugify')
import moment from 'moment'
import AgreementClause from '@/components/ui/agreementClause'
import ButtonLink from '@/components/ui/buttonLink'
import HeaderAside from '@/components/ui/headerAside'
import InventoryConsolidatedList from '@/components/ui/inventoryConsolidatedList'
import InventoryListHeader from '@/components/ui/inventoryListHeader'
import InventoryListItem from '@/components/ui/inventoryListItem'
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import PageBody from '@/components/ui/pageBody'
import SolidSection from '@/components/ui/solidSection'
import SignPad from '@/components/ui/signPad'
import SignPreview from '@/components/ui/signPreview'
import SectionHeader from '@/components/ui/sectionHeader'
import TimeRecordView from '@/components/ui/timeRecordView'
export default {
  name: 'CSQRIDPreviewPage',
  middleware: ['auth'],
  head: {
    title: 'Minion - CSQR Preview',
  },
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
    SectionHeader,
    SignPad,
    SignPreview,
    SolidSection,
    TimeRecordView,
  },
  data() {
    return {
      clientAgreement: false,
      inventoryCountView: false,
      prevPage: {},
      report: null,
      reportCreatedData: null,
      signData: null,
      signFile: null,
      signID: null,
      signURL: null,
    }
  },
  methods: {
    clearSignData() {
      this.signData = null
      this.signFile = null
      this.clientAgreement = false
    },
    async publish() {
      if (this.signFile) {
        this.$root.$emit('showLoading')
        await this.uploadSignature()
        let reportCopy = { ...this.report }
        delete reportCopy.inventory_checkouts
        delete reportCopy.time_records
        let reportResponse = await this.$store.dispatch('api/put', {
          url: `/reports/customer_service/${this.report.id}/`,
          data: { ...reportCopy, draft: false, signatureID: this.signID },
        })
        this.$root.$emit('hideLoading')
        this.$router.push({ name: 'reports-csqr' })
      }
    },
    async saveDraft() {
      this.$root.$emit('showLoading')
      let reportCopy = { ...this.report }
      delete reportCopy.inventory_checkouts
      delete reportCopy.time_records
      let reportResponse = await this.$store.dispatch('api/put', {
        url: `/reports/customer_service/${this.report.id}/`,
        data: { ...reportCopy, draft: true },
      })
      this.$root.$emit('hideLoading')
      this.$router.push({ name: 'reports-csqr-drafts' })
    },
    async uploadSignature() {
      if (this.signFile) {
        let signRefString = `${
          this.$store.state.team.team.slug
        }/signatures/${slugify(
          this.report.company_name.toLowerCase()
        )}/${slugify(this.report.client_name.toLowerCase())}/${moment().format(
          'YYYYMMDD-HHmmSS'
        )}.png`
        let signRef = this.$fireStorage.ref().child(signRefString)

        let signResponseData = await this.$store.dispatch('api/post', {
          url: '/reports/sign/',
          data: {
            ref: signRefString,
            company: this.report.company_name,
            client: this.report.client_name,
          },
        })
        this.signID = signResponseData.id

        return await signRef.put(this.signFile)
      }
    },
    saveSignature(data) {
      if (data) {
        let arr = data.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        this.signData = data
        this.signFile = new File([u8arr], 'signature.png', {
          type: mime,
        })
      } else {
        this.signFile = null
      }
    },
  },
  async created() {
    if (this.$route.params.id) {
      this.$root.$emit('showLoading')
      this.report = await this.$store.dispatch(
        'api/get',
        `/reports/customer_service/${this.$route.params.id}/`
      )
      if (this.report.draft) {
        this.report.last_edited_by = this.$store.state.account.account.id
      }
      if (this.report.signature) {
        this.signURL = await this.$fireStorage
          .ref()
          .child(this.report.signature.ref)
          .getDownloadURL()
      }
      this.$root.$emit('hideLoading')
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevPage = { name: from.name, params: from.params }
    })
  },
}
</script>
