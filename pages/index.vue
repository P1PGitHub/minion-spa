<template>
  <PageBody>
    <template v-slot:page-header>
      <SectionHeader text="Bello!" />
      <div
        class="bg-blue-600 text-white px-4 py-2 rounded border border-blue-600 space-x-2 flex items-center"
      >
        <inline-svg
          :src="require('@/assets/svg/other/boy.svg')"
          class="h-6 w-auto text-white"
        ></inline-svg>
        <span>
          {{ $store.state.account.account.last_name }},
          {{ $store.state.account.account.first_name }}
        </span>
      </div>
    </template>
    <template v-slot:page-content>
      <FlexSection>
        <div class="w-full md:w-1/2">
          <SolidSection class="w-full">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <SectionHeader :text="today.format('ddd MMM Do')" />
                <Loading v-if="loadingLogs" />
              </div>

              <ActionButton
                spacing="sm"
                @click="$root.$emit('showJournalModal')"
                >Add +</ActionButton
              >
            </div>

            <HeaderAside v-if="(!loadingLogs && !logs.length)">
              No time tracking entries found for today.
            </HeaderAside>

            <TimeEntry v-for="log in logs" :key="log.id" :entry="log" />
            <ButtonLink
              :link="{ name: 'home' }"
              spacing="sm"
              theme="hollow"
              class="w-full"
              >View All...</ButtonLink
            >
          </SolidSection>
        </div>

        <div class="w-full md:w-1/2 space-y-4">
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
            <ButtonLink
              spacing="sm"
              theme="hollow"
              :link="{ name: 'reports-csqr-drafts' }"
              class="w-full"
              >View All...</ButtonLink
            >
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
            <ButtonLink
              spacing="sm"
              theme="hollow"
              :link="{ name: 'reports-csqr-list' }"
              >View All...</ButtonLink
            >
          </SolidSection>
        </div>
      </FlexSection>
    </template>
  </PageBody>
</template>

<script>
import moment from 'moment'
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import HeaderAside from '@/components/ui/headerAside'
import Loading from '@/components/common/Loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
import TimeEntry from '@/components/ui/timeEntry'
export default {
  name: 'HomePage',
  middleware: ['auth'],
  head: {
    title: 'Minion',
  },
  components: {
    ActionButton,
    ButtonLink,
    DashedSection,
    FlexSection,
    HeaderAside,
    Loading,
    PageBody,
    ReportListItem,
    SectionHeader,
    SolidSection,
    TimeEntry,
  },
  data() {
    return {
      loadingDrafts: false,
      loadingLogs: false,
      loadingRecents: false,
      drafts: [],
      recents: [],
      logs: [],
      today: moment(),
    }
  },
  created() {
    this.loadingDrafts = true
    this.loadingLogs = true
    this.loadingRecents = true
    this.$store
      .dispatch('api/get', '/reports/customer_service/drafts/recent/')
      .then((drafts) => {
        this.drafts = drafts.splice(0, 2)
        this.loadingDrafts = false
      })
    this.$store
      .dispatch('api/get', '/reports/customer_service/recent/')
      .then((recents) => {
        this.recents = recents.splice(0, 2)
        this.loadingRecents = false
      })
    this.$store
      .dispatch(
        'api/get',
        `/logs/entry/${moment()
          .set({ hour: 0, minute: 0 })
          .utc()
          .format('YYYYMMDDHHmm')}`
      )
      .then((logs) => {
        console.log(logs)
        this.logs = logs
        this.loadingLogs = false
      })
  },
}
</script>
