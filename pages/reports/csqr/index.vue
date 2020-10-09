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
      <div>
        <div
          class="flex items-center justify-between pb-4 border-b border-dashed border-gray-400"
        >
          <div class="flex items-center space-x-4">
            <h1 class="text-xl">Recent Reports</h1>
            <Loading v-if="loadingRecents" />
          </div>

          <ButtonLink
            :link="{ name: 'reports-csqr-list-page', params: { page: 1 } }"
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
        <HeaderAside v-if="recents.length == 0 && !loadingRecents" class="mt-4"
          >No reports to display.</HeaderAside
        >
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
          <HeaderAside v-if="drafts.length == 0 && !loadingDrafts" class="mt-4"
            >No reports to display.</HeaderAside
          >
        </div>
      </div>
    </template>
  </PageBody>
</template>

<script>
import ButtonLink from '@/components/ui/buttonLink'
import HeaderAside from '@/components/ui/headerAside'
import Loading from '@/components/common/loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
export default {
  name: 'CSQRPage',
  middleware: ['auth'],
  head: {
    title: 'Minion - CSQR',
  },
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
