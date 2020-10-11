<template>
  <PageBody>
    <template v-slot:page-header>
      <div class="w-full flex items-center justify-between">
        <SectionHeader size="lg" text="Today" />
        <ActionButton spacing="sm" theme="hollow" v-if="!showPicker">
          <inline-svg
            :src="require('@/assets/svg/other/eye.svg')"
            fill="fill-current"
            class="h-6 w-auto text-gray-800 dark:text-white"
            @click="togglePicker"
          ></inline-svg>
        </ActionButton>
      </div>
    </template>
    <template v-slot:page-content>
      <div
        class="w-full md:flex items-start space-y-4 md:space-x-4 md:space-y-0"
      >
        <div
          class="w-auto space-y-2 flex flex-col items-center md:items-start"
          v-show="showPicker"
        >
          <div>
            <v-date-picker
              color="teal"
              :is-dark="$colorMode.value == 'dark'"
              is-inline
              mode="range"
              title-position="left"
              :value="dateRange"
            />
          </div>
          <div class="w-full max-w-sm flex items-center space-x-2">
            <ActionButton spacing="sm" theme="hollow">&lt;</ActionButton>
            <ActionButton spacing="sm" theme="hollow">
              <inline-svg
                :src="require('@/assets/svg/other/eye.svg')"
                fill="fill-current"
                class="h-6 w-auto text-gray-600"
                @click="togglePicker"
              ></inline-svg>
            </ActionButton>
            <ActionButton spacing="sm" class="w-full">Today</ActionButton>
            <ActionButton spacing="sm" theme="hollow">&gt;</ActionButton>
          </div>
        </div>
        <div class="w-full">
          <SolidSection>
            <div class="flex items-center space-x-2">
              <SectionHeader text="Journal Entries" />
              <Loading v-if="loading" />
            </div>
            <HeaderAside v-if="(!loading && !logs.length)">
              No time tracking entries found for today.
            </HeaderAside>
            <div class="space-y-4" v-else>
              <TimeEntry v-for="log in logs" :key="log.id" :entry="log" />
            </div>
          </SolidSection>
        </div>
      </div>
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import Loading from '@/components/common/loading'
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'

import moment from 'moment'
export default {
  name: 'Today',
  middleware: ['auth'],
  components: {
    ActionButton,
    Loading,
    PageBody,
    SectionHeader,
    SolidSection,
  },
  data() {
    return {
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      loading: false,
      logs: [],
      logOrdering: 'ASC',
      showPicker: true,
    }
  },
  methods: {
    getLogs() {
      this.loading = true
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
          this.loading = false
        })
    },
    togglePicker() {
      this.showPicker = !this.showPicker
    },
  },
}
</script>
