<template>
  <PageBody>
    <template v-slot:page-header>
      <SectionHeader text="Your Dashboard" />
      <div
        class="bg-blue-600 text-white px-4 py-2 rounded border border-blue-600 space-x-2 flex items-center"
      >
        <img src="@/assets/svg/other/boy-white.svg" alt="Account Icon" />
        <span>
          {{ $store.state.account.account.last_name }},
          {{ $store.state.account.account.first_name }}
        </span>
      </div>
    </template>
    <template v-slot:page-content>
      <FlexSection>
        <SolidSection class="w-full md:w-1/2"> </SolidSection>
        <DashedSection class="w-full md:w-1/2">
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="CSQR Drafts" />
              <Loading v-if="loadingDrafts" />
            </div>
            <ReportListItem
              v-for="(draft, index) in drafts"
              :key="draft.id"
              :report="draft"
              :hideAuthor="true"
              :editLink="true"
              :border="index !== drafts.length - 1"
            />
            <ButtonLink spacing="sm" theme="hollow">View All...</ButtonLink>
          </SolidSection>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Recent CSQRs" />
              <Loading v-if="loadingRecents" />
            </div>

            <ReportListItem
              v-for="(recent, index) in recents"
              :key="recent.id"
              :report="recent"
              :hideAuthor="true"
              :border="index !== recents.length - 1"
            />
            <ButtonLink spacing="sm" theme="hollow">View All...</ButtonLink>
          </SolidSection>
        </DashedSection>
      </FlexSection>
    </template>
  </PageBody>
</template>

<script>
import ButtonLink from '@/components/ui/buttonLink'
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import HeaderAside from '@/components/ui/headerAside'
import Loading from '@/components/common/Loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'HomePage',
  middleware: ['auth'],
  head: {
    title: 'Minion',
  },
  components: {
    ButtonLink,
    DashedSection,
    FlexSection,
    HeaderAside,
    Loading,
    PageBody,
    ReportListItem,
    SectionHeader,
    SolidSection,
  },
  data() {
    return {
      loadingDrafts: false,
      loadingRecents: false,
      drafts: [],
      recents: [],
    }
  },
  created() {
    this.loadingDrafts = true
    this.loadingRecents = true
    this.$store
      .dispatch('api/get', '/reports/customer_service/drafts/recent/')
      .then((drafts) => {
        this.drafts = drafts.splice(0, 2)
        this.loadingDrafts = false
      })
    this.recents = this.$store
      .dispatch('api/get', '/reports/customer_service/recent/')
      .then((recents) => {
        this.recents = recents.splice(0, 2)
        this.loadingRecents = false
      })
  },
}
</script>
