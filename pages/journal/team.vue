<template>
  <PageBody>
    <template v-slot:page-header>
      <div class="space-y-2 w-full">
        <div class="w-full flex items-center justify-between">
          <SectionHeader
            size="lg"
            :text="$store.state.team.team.name + `'s Journal`"
          />
          <ActionButton spacing="sm" theme="hollow" v-if="!showPicker">
            <inline-svg
              :src="require('@/assets/svg/other/eye.svg')"
              fill="fill-current"
              class="h-6 w-auto text-gray-800 dark:text-white"
              @click="togglePicker"
            ></inline-svg>
          </ActionButton>
        </div>
        <p v-if="dateRange.start.getTime() == dateRange.end.getTime()">
          {{ dateRange.start | moment('ddd MMM Do, YYYY') }}
        </p>
        <p v-else>
          {{ dateRange.start | moment('ddd MMM Do, YYYY') }} -
          {{ dateRange.end | moment('ddd MMM Do, YYYY') }}
        </p>
      </div>
    </template>
    <template v-slot:page-content>
      <div class="md:flex items-start space-y-4 md:space-x-4 md:space-y-0">
        <JournalDatePicker
          ref="journalDatePicker"
          @hide="togglePickerBtn"
          @update="update"
        />
        <div class="w-full">
          <JournalLogs
            :dateRange="dateRange"
            :teamLog="true"
            ref="jounalLogs"
            @download="download"
          />
        </div>
      </div>
    </template>
  </PageBody>
</template>

<script>
import ActionButton from "@/components/ui/actionButton"
import Loading from '@/components/common/loading'
import JournalDatePicker from "@/components/ui/journalDatePicker"
import JournalLogs from '@/components/ui/journalLogs'
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
import moment from 'moment'
export default {
  name: 'JournalTeam',
  middleware: ['admin', 'auth'],
  components: {
    ActionButton,
    Loading,
    JournalDatePicker,
    JournalLogs,
    PageBody,
    SectionHeader,
  },
  data() {
    let showPickerLS = true
    if (process.browser) {
      showPickerLS = localStorage.getItem('showPicker')
      if (showPickerLS == null) {
        showPickerLS = true
      } else {
        showPickerLS = showPickerLS == 'true'
      }
    }
    return {
      dateRange: {
        start: moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate(),
        end: moment()
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .toDate(),
      },
      loading: false,
      logs: [],
      logOrdering: 'ASC',
      showPicker: showPickerLS,
    }
  },
  methods: {
    download() {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to download this activity report?',
      })
      this.$root.$once('modalClose', (choice) => {
        if (choice) {
          this.$store
            .dispatch(
              'api/get',
              `/logs/entry/team/${moment(this.dateRange.start)
                .set({ hour: 0, minute: 0 })
                .utc()
                .format('YYYYMMDDHHmm')}/${moment(this.dateRange.end)
                .set({ hour: 0, minute: 0 })
                .utc()
                .format('YYYYMMDDHHmm')}/download/`
            )
            .then((data) => {
              let ref = this.$fireStorage.ref().child(data.ref)
              ref.getDownloadURL().then((url) => {
                const link = document.createElement('a')
                link.href = url
                link.download = `${data.name}.xlsx`
                document.body.appendChild(link)
                link.click()
                link.remove()
              })
            })
        }
      })
    },
    setDisplayDateRange() {
      this.displayDateRange = {
        start: moment(this.dateRange.start)
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .format('ddd MMM D, YYYY'),
        end: moment(this.dateRange.end)
          .set({ hour: 0, minute: 0, second: 0, milliseconds: 0 })
          .format('ddd MMM D, YYYY'),
      }
    },
    togglePicker() {
      this.$refs.journalDatePicker.toggle()
      this.showPicker = true
    },
    togglePickerBtn() {
      this.showPicker = false
    },
    update(dateRange) {
      this.dateRange = dateRange
      this.$refs.jounalLogs.getLogs(dateRange)
    },
  },
}
</script>
