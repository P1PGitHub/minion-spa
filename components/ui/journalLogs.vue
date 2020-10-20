<template>
  <SolidSection v-if="logs">
    <div
      class="space-y-2 md:flex flex-grow-0 items-center justify-between md:space-y-0"
    >
      <div class="flex items-center space-x-2">
        <SectionHeader text="Journal Entries" />
        <Loading v-if="loading" />
      </div>
      <div class="flex items-center justify-between space-x-2">
        <div class="flex items-center space-x-2">
          <ActionButton spacing="sm" theme="hollow" @click="showDetails">
            <inline-svg
              :src="require('@/assets/svg/content/details-more.svg')"
              class="h-6 w-auto"
            ></inline-svg>
          </ActionButton>
          <ActionButton
            spacing="sm"
            theme="hollow"
            @click="collapseUserView"
            v-if="teamLog"
          >
            <inline-svg
              :src="require('@/assets/svg/other/eye.svg')"
              class="h-6 w-auto"
              :class="{
                'text-gray-600': !hiddenUsers.length,
                'text-blue-800 dark:text-white': hiddenUsers.length,
              }"
            ></inline-svg>
          </ActionButton>
          <ActionButton spacing="sm" theme="hollow" @click="toggleLogOrder">
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
        </div>

        <ActionButton spacing="sm" @click="$root.$emit('showJournalModal')"
          >Add +</ActionButton
        >
      </div>
    </div>

    <HeaderAside v-if="(!loading && !logs.length)">
      No time tracking entries found for today.
    </HeaderAside>
    <div class="space-y-4" v-else-if="displayUsers">
      <template v-for="user in logs">
        <div
          class="p-2 flex items-center justify-between space-x-2 bg-blue-200 border border-blue-400 dark:bg-blue-700 dark:border-blue-700 rounded"
          :key="user.id"
        >
          <div class="flex items-center space-x-2">
            <inline-svg
              :src="require('@/assets/svg/other/user.svg')"
              fill="fill-current"
              class="h-6 w-auto text-blue-800 dark:text-blue-200"
            />
            <p class="text-lg font-bold text-blue-800 dark:text-white">
              {{ user.last_name }}, {{ user.first_name }}
            </p>
          </div>

          <button class="appearance-none">
            <inline-svg
              :src="require('@/assets/svg/other/eye.svg')"
              fill="fill-current"
              class="h-6 w-auto"
              :class="{
                'text-blue-800 dark:text-white': hiddenUsers.includes(user.id),
                'text-blue-400': !hiddenUsers.includes(user.id),
              }"
              @click="toggleHide(user.id)"
            />
          </button>
        </div>
        <div
          v-if="user.work_entries.length && !hiddenUsers.includes(user.id)"
          :key="'timeEntryGroup-' + user.id"
          class="space-y-4"
        >
          <TimeEntry
            v-for="log in user.work_entries"
            :editButton="user.id == $store.state.account.account.id"
            :key="log.id"
            :displayDate="true"
            :entry="log"
            ref="journalEntry"
          />
        </div>
        <div
          :key="'timeEntryGroup-' + user.id"
          v-else-if="!hiddenUsers.includes(user.id)"
        >
          <HeaderAside spacing="sm">
            No time tracking entries found for today.
          </HeaderAside>
        </div>
      </template>
    </div>
    <div class="space-y-4" v-else>
      <TimeEntry
        v-for="log in logs"
        :key="log.id"
        :displayDate="true"
        :entry="log"
        ref="journalEntry"
      />
    </div>
    <div class="w-full flex items-center justify-between">
      <ButtonLink
        :link="{ name: 'journal' }"
        spacing="sm"
        theme="hollow"
        v-if="teamLog"
      >
        <inline-svg
          :src="require('@/assets/svg/other/user.svg')"
          fill="fill-current"
          class="h-6 w-auto fill-current"
        />
        <span
          >{{ $store.state.account.account.last_name }},
          {{ $store.state.account.account.first_name }}</span
        >
      </ButtonLink>
      <ButtonLink
        :link="{ name: 'journal-team' }"
        spacing="sm"
        theme="hollow"
        v-else-if="$store.state.account.account.report_admin"
      >
        <inline-svg
          :src="require('@/assets/svg/other/user-list.svg')"
          fill="fill-current"
          class="h-6 w-auto fill-current"
        />
        <span>{{ $store.state.team.team.name }}</span>
      </ButtonLink>
      <ActionButton spacing="sm" theme="hollow">
        <inline-svg
          :src="require('@/assets/svg/buttons/software-download.svg')"
          fill="fill-current"
          class="h-6 w-auto fill-current"
        />
      </ActionButton>
    </div>
  </SolidSection>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
import SolidSection from '@/components/ui/solidSection'
import TimeEntry from '@/components/ui/timeEntry'
import moment from 'moment'

export default {
  name: 'JournalLogs',
  middleware: ['auth'],
  props: {
    teamLog: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    ActionButton,
    ButtonLink,
    SolidSection,
    TimeEntry,
  },
  data() {
    return {
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      displayUsers: false,
      hiddenUsers: [],
      loading: false,
      logs: [],
      logOrdering: 'ASC',
    }
  },
  methods: {
    collapseUserView() {
      if (this.hiddenUsers.length == 0) {
        this.hiddenUsers = []
        this.logs.forEach((user) => {
          if (!user.work_entries.length) {
            this.hiddenUsers.push(user.id)
          }
        })
      } else {
        this.hiddenUsers = []
      }
    },
    getLogs(dateRange = null) {
      this.loading = true
      if (dateRange) {
        this.dateRange = dateRange
      }
      if (process.browser) {
        let ordering = localStorage.getItem('logOrdering')
        if (ordering) {
          this.logOrdering = ordering
        }
      }
      if (this.teamLog) {
        this.$store
          .dispatch(
            'api/get',
            `/logs/entry/team/${moment(this.dateRange.start)
              .set({ hour: 0, minute: 0 })
              .utc()
              .format('YYYYMMDDHHmm')}/${moment(this.dateRange.end)
              .set({ hour: 0, minute: 0 })
              .utc()
              .format('YYYYMMDDHHmm')}/`
          )
          .then((logs) => {
            this.displayUsers = true
            this.logs = logs
            if (this.logOrdering == 'DESC') {
              this.logs.forEach((user) => {
                user.work_entries = user.work_entries.reverse()
              })
            }
            this.loading = false
          })
      } else {
        this.$store
          .dispatch(
            'api/get',
            `/logs/entry/range/${moment(this.dateRange.start)
              .set({ hour: 0, minute: 0 })
              .utc()
              .format('YYYYMMDDHHmm')}/${moment(this.dateRange.end)
              .set({ hour: 0, minute: 0 })
              .utc()
              .format('YYYYMMDDHHmm')}/`
          )
          .then((logs) => {
            this.displayUsers = false
            this.logs = logs
            if (this.logOrdering == 'DESC') {
              this.logs.reverse()
            }
            this.loading = false
          })
      }
    },
    showDetails() {
      if (this.$refs.journalEntry) {
        let viewStatus = true
        for (let logVM of this.$refs.journalEntry) {
          if (!logVM.view) {
            viewStatus = false
            break
          }
        }
        if (viewStatus) {
          this.$refs.journalEntry.forEach((logVM) => {
            logVM.closeDetails()
          })
        } else {
          this.$refs.journalEntry.forEach((logVM) => {
            logVM.openDetails()
          })
        }
      }
    },
    toggleHide(userID) {
      if (this.hiddenUsers.includes(userID)) {
        this.hiddenUsers.splice(this.hiddenUsers.indexOf(userID), 1)
      } else {
        this.hiddenUsers.push(userID)
      }
    },
    toggleLogOrder() {
      if (this.logOrdering == 'ASC') {
        this.logOrdering = 'DESC'
      } else {
        this.logOrdering = 'ASC'
      }
      localStorage.setItem('logOrdering', this.logOrdering)
      if (this.teamLog) {
        this.logs.forEach((user) => {
          user.work_entries.reverse()
        })
      } else {
        this.logs.reverse()
      }
    },
  },
  async created() {
    this.$root.$on('updateEntries', () => {
      this.getLogs()
    })
    await this.getLogs()
  },
}
</script>