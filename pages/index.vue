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

              <div class="flex items-center space-x-2">
                <ActionButton
                  spacing="sm"
                  theme="hollow"
                  @click="toggleLogOrder"
                >
                  <inline-svg
                    :src="require('@/assets/svg/arrows/arrow-up.svg')"
                    class="h-6 w-auto"
                    v-if="logOrdering == 'ASC'"
                  ></inline-svg>
                  <inline-svg
                    :src="require('@/assets/svg/arrows/arrow-down.svg')"
                    class="h-6 w-auto"
                    v-else
                  ></inline-svg>
                </ActionButton>
                <ActionButton
                  spacing="sm"
                  @click="$root.$emit('showJournalModal')"
                  >Add +</ActionButton
                >
              </div>
            </div>

            <HeaderAside v-if="(!loadingLogs && !logs.length)">
              No time tracking entries found for today.
            </HeaderAside>
            <div class="space-y-4">
              <TimeEntry v-for="log in logs" :key="log.id" :entry="log" />
            </div>

            <ButtonLink
              :link="{ name: 'journal' }"
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
              :draft="true"
              :report="draft"
              :hideAuthor="true"
              :editLink="true"
              :border="index !== drafts.length - 1"
              @reload="getDrafts"
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
              :link="{ name: 'reports-csqr-list-page', params: { page: 1 } }"
              class="w-full"
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
import Loading from '@/components/common/loading'
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
      logOrdering: 'ASC',
      today: moment(),
    }
  },
  methods: {
    getDrafts() {
      this.loadingDrafts = true
      this.$store
        .dispatch('api/get', '/reports/customer_service/drafts/recent/')
        .then((drafts) => {
          this.drafts = drafts.splice(0, 2)
          this.loadingDrafts = false
        })
    },
    getLogs() {
      this.loadingLogs = true
      let ordering = localStorage.getItem('logOrdering')
      if (ordering) {
        this.logOrdering = ordering
      }
      this.$store
        .dispatch(
          'api/get',
          `/logs/entry/${moment()
            .set({ hour: 0, minute: 0 })
            .utc()
            .format('YYYYMMDDHHmm')}/`
        )
        .then((logs) => {
          this.logs = logs
          if (this.logOrdering == 'DESC') {
            this.logs.reverse()
          }
          this.loadingLogs = false
        })
    },
    getRecents() {
      this.loadingRecents = true
      this.$store
        .dispatch('api/get', '/reports/customer_service/recent/')
        .then((recents) => {
          this.recents = recents.splice(0, 2)
          this.loadingRecents = false
        })
    },
    toggleLogOrder() {
      if (this.logOrdering == 'ASC') {
        this.logOrdering = 'DESC'
      } else {
        this.logOrdering = 'ASC'
      }
      localStorage.setItem('logOrdering', this.logOrdering)
      this.logs.reverse()
    },
  },
  created() {
    this.getDrafts()
    this.getLogs()
    this.getRecents()
    this.$root.$on('updateEntries', () => {
      this.getLogs()
    })
  },
}
</script>
