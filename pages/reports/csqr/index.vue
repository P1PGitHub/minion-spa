<template>
  <PageBody>
    <template v-slot:page-header>
      <h1 class="text-xl">Customer Service Quality Report</h1>
      <nuxt-link
        class="flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-1 px-4 rounded"
        :to="{ name: 'reports-csqr-new' }"
      >
        <span>New</span>
        <span class="font-bold text-xl">+</span>
      </nuxt-link>
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
          <h1 class="text-xl">Recent Reports</h1>
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
          class="flex items-center pb-4 border-b border-dashed border-gray-400"
        >
          <h1 class="text-xl">Drafts</h1>
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
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
export default {
  name: 'CSQRPage',
  middleware: ['auth'],
  components: {
    ButtonLink,
    HeaderAside,
    PageBody,
    ReportListItem,
  },
  data() {
    return {
      drafts: [],
      recents: [],
    }
  },
  async created() {
    this.drafts = await this.$store.dispatch(
      'api/get',
      '/reports/customer_service/drafts/'
    )
    this.recents = await this.$store.dispatch(
      'api/get',
      '/reports/customer_service/recent/'
    )
  },
}
</script>
