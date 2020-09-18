<template>
  <PageBody>
    <template v-slot:page-header>
      <h1 class="text-xl">Customer Service Quality Report</h1>
      <ButtonLink
        :link="{ name: 'reports-csqr-id-edit', params: { id: 'new' } }"
        spacing="sm"
      >
        <span>New</span>
        <span class="font-bold text-xl">+</span>
      </ButtonLink>
    </template>
    <template v-slot:page-content>
      <HeaderAside>
        Complete transparency is key to our business. That transparency allows
        us to communicate better as a team and offers our clients a level of
        understanding that is unique to our identity. The Customer Service
        Quality Report is made to document client work. This process gives us
        insight into the scope and frequency of our work with specific clients.
        Without the CSQR, our work has no story.</HeaderAside
      >
      <div>
        <div
          class="flex items-center justify-between pb-4 border-b border-dashed border-gray-400"
        >
          <div class="flex items-center space-x-4">
            <h1 class="text-xl">Recent Reports</h1>
            <Loading v-if="loadingRecents" />
          </div>

          <ButtonLink
            :link="{ name: 'reports-csqr-list' }"
            theme="hollow"
            spacing="sm"
            >View all...</ButtonLink
          >
        </div>
        <ReportListItem
          v-for="(recent, index) in recents"
          :key="recent.id"
          :report="recent"
          :hideAuthor="true"
          :border="index !== recents.length - 1"
        />
      </div>
      <div>
        <div
          class="flex items-center justify-between pb-4 border-b border-dashed border-gray-400"
        >
          <div class="flex items-center space-x-4">
            <h1 class="text-xl">Drafts</h1>
            <Loading v-if="loadingDrafts" />
          </div>

          <ButtonLink
            :link="{ name: 'reports-csqr-drafts' }"
            theme="hollow"
            spacing="sm"
            >View all...</ButtonLink
          >
        </div>
        <div class="text-base">
          <ReportListItem
            v-for="(draft, index) in drafts"
            :key="draft.id"
            :report="draft"
            :hideAuthor="true"
            :editLink="true"
            :border="index !== drafts.length - 1"
          />
        </div>
      </div>
    </template>
  </PageBody>
</template>

<script>
import ButtonLink from '@/components/ui/buttonLink'
import HeaderAside from '@/components/ui/headerAside'
import Loading from '@/components/common/Loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
export default {
  name: 'CSQRPage',
  middleware: ['auth'],
  components: {
    ButtonLink,
    HeaderAside,
    Loading,
    PageBody,
    ReportListItem,
  },
  data() {
    return {
      drafts: [],
      recents: [],
      loadingDrafts: false,
      loadingRecents: false,
    }
  },
  created() {
    this.loadingDrafts = true
    this.loadingRecents = true
    this.$store
      .dispatch('api/get', '/reports/customer_service/drafts/recent/')
      .then((drafts) => {
        this.drafts = drafts
        this.loadingDrafts = false
      })
    this.recents = this.$store
      .dispatch('api/get', '/reports/customer_service/recent/')
      .then((recents) => {
        this.recents = recents
        this.loadingRecents = false
      })
  },
}
</script>
