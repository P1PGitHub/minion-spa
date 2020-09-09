<template>
  <PageBody>
    <template v-slot:page-header>
      <h1 class="text-xl">CSQR Review</h1>
      <ButtonLink fontSize="sm" :link="{ name: 'reports-csqr' }"
        >Back</ButtonLink
      >
    </template>
    <template v-slot:page-content v-if="report">
      <FlexSection>
        <DashedSection class="w-full md:w-1/2" spacing="sm">
          <h2 class="text-xl text-blue-700">{{ report.company_name }}</h2>
          <FlexSection>
            <div class="w-1/2">
              <h4>{{ report.client_name }}</h4>
              <h4>{{ report.location }}</h4>
            </div>
            <div class="w-1/2">
              <h4>{{ report.service_type }}</h4>
              <h4 class="font-bold">{{ report.description }}</h4>
            </div>
          </FlexSection>
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
        currently viewing historical data.</HeaderAside
      >
    </template>
  </PageBody>
</template>

<script>
import AgreementClause from '@/components/ui/agreementClause'
import ButtonLink from '@/components/ui/buttonLink'
import HeaderAside from '@/components/ui/headerAside'
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import PageBody from '@/components/ui/pageBody'
export default {
  name: 'CSQRIDPreviewPage',
  middleware: ['auth'],
  components: {
    AgreementClause,
    ButtonLink,
    HeaderAside,
    DashedSection,
    FlexSection,
    PageBody,
  },
  data() {
    return {
      report: null,
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
