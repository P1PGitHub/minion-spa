<template>
  <div>
    <div
      class="fixed left-0 top-0 py-4 pb-16 md:pb-4 z-30 transform duration-300 ease-in-out h-screen"
      :class="{ '-translate-x-128': !show, 'mx-4': show }"
    >
      <div
        class="md:w-full max-h-full max-w-128 bg-white dark:bg-gray-900 dark:text-white border-2 rounded shadow-lg p-4 space-y-4 overflow-y-auto z-40"
        :class="{
          'border-green-300': entry.resolved,
          'border-orange-300': !entry.resolved,
        }"
      >
        <div class="flex items-center justify-between">
          <div class="flex md:items-center space-x-2">
            <SectionHeader text="Edit Journal Entry" v-if="entry.id" />
            <SectionHeader text="New Journal Entry" v-else />

            <Loading v-if="$store.state.isLoading" class="mt-1 md:mt-0" />
          </div>
          <ActionButton
            spacing="sm"
            theme="hollow"
            @click="reset"
            :tabindex="tabIndex"
          >
            <inline-svg
              :src="require('@/assets/svg/arrows/sync.svg')"
              fill="fill-current"
              class="h-4 w-auto text-gray-800 dark:text-white"
            ></inline-svg>
          </ActionButton>
        </div>

        <div class="space-y-2">
          <label for="company-id" class="block">Company</label>
          <select
            name="company-id"
            id="company-id"
            class="select"
            :class="{
              'border-red-400 dark:border-red-400': this.errors.includes(
                'company_id'
              ),
            }"
            v-model="entry.company_id"
            @change="onCompanyChange"
            :tabindex="tabIndex"
            ref="companyID"
          >
            <option :value="null">Select a Company...</option>
            <option
              :value="company.id"
              v-for="company in $store.state.team.cwCompanies"
              :key="company.id"
            >
              {{ company.name }}
            </option>
          </select>
        </div>
        <div class="space-y-2">
          <label for="client-name" class="block">Client Name</label>
          <input
            name="client-name"
            id="client-name"
            type="text"
            placeholder="John Doe"
            class="rounded p-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            :class="{
              'border-red-400 dark:border-red-400': this.errors.includes(
                'client_name'
              ),
            }"
            v-model="entry.client_name"
            :tabindex="tabIndex"
          />
        </div>

        <div class="space-y-2">
          <label for="description" class="block">Description</label>
          <input
            name="description"
            id="description"
            type="text"
            placeholder="UTG Reset"
            class="rounded p-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            :class="{
              'border-red-400 dark:border-red-400': this.errors.includes(
                'description'
              ),
            }"
            v-model="entry.description"
            :tabindex="tabIndex"
          />
        </div>

        <div>
          <label for="journal-entry-date" class="block w-full">Date</label>
          <v-date-picker
            v-model="entry.date"
            color="blue"
            :is-dark="$colorMode.value == 'dark'"
            :popover="{ visibility: 'focus' }"
            :max-date="new Date()"
            title-position="left"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <input
                class="rounded p-2 mt-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                id="journal-entry-date"
                type="text"
                :value="inputValue"
                v-on="inputEvents"
                :tabindex="tabIndex"
              />
            </template>
          </v-date-picker>
        </div>

        <div class="space-x-2 flex items-start">
          <div class="space-y-2 w-1/2">
            <label for="entry-start" class="block">Start</label>
            <v-date-picker
              v-model="entry.start"
              color="blue"
              :is-dark="$colorMode.value == 'dark'"
              :popover="{ visibility: 'focus' }"
              title-position="left"
              mode="time"
              ref="entryStartTimepicker"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <input
                  class="rounded p-2 mt-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  id="entry-start"
                  type="text"
                  :value="inputValue"
                  v-on="inputEvents"
                  :tabindex="tabIndex"
                />
              </template>
            </v-date-picker>
          </div>
          <div class="space-y-2 w-1/2">
            <label for="entry-end" class="block">End</label>
            <v-date-picker
              v-model="entry.end"
              color="blue"
              :is-dark="$colorMode.value == 'dark'"
              :popover="{ visibility: 'focus' }"
              title-position="left"
              mode="time"
              ref="entryEndTimepicker"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <input
                  class="rounded mt-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  id="entry-end"
                  type="text"
                  :value="inputValue"
                  v-on="inputEvents"
                  :tabindex="tabIndex"
                />
              </template>
            </v-date-picker>
          </div>
        </div>

        <div class="space-y-2">
          <label for="summary" class="block">Summary</label>
          <textarea
            name="summary"
            id="summary"
            placeholder="Restarted UTG and FPOS."
            class="rounded w-full bg-gray-100 h-32 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            :class="{
              'border-red-400 dark:border-red-400': this.errors.includes(
                'summary'
              ),
            }"
            v-model="entry.summary"
            :tabindex="tabIndex"
          ></textarea>
        </div>

        <div
          class="flex items-center space-x-2 p-2 border bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-600 rounded"
        >
          <input
            name="resolved"
            id="resolved"
            class="rounded-full bg-gray-200 border-gray-600"
            type="checkbox"
            v-model="entry.resolved"
            :tabindex="tabIndex"
          />
          <label for="resolved">Resolved</label>
        </div>
        <FlexSection class="pb-4">
          <ActionButton
            spacing="sm"
            theme="hollow"
            class="w-full md:w-1/2"
            @click="close"
            :disable="isLoading"
            :tabindex="tabIndex"
            >Close</ActionButton
          >
          <ActionButton
            spacing="sm"
            class="w-full md:w-1/2"
            :disable="isLoading"
            @click="saveEntry"
            :tabindex="tabIndex"
          >
            <span v-if="entry.id">Update</span>
            <span v-else>Add</span>
          </ActionButton>
        </FlexSection>
      </div>
    </div>
    <div
      class="fixed inset-0 z-20 bg-gray-400 bg-opacity-25"
      tabindex="-1"
      v-show="show"
      @click="close"
    ></div>
  </div>
</template>

<script>
import moment from 'moment'
import ActionButton from '@/components/ui/actionButton'
import FlexSection from '@/components/ui/flexSection'
import Loading from '@/components/common/loading'
import SectionHeader from '@/components/ui/sectionHeader'
import TimePicker from '@/components/ui/timePicker'
export default {
  name: 'NewJournalModal',
  components: {
    ActionButton,
    FlexSection,
    Loading,
    SectionHeader,
    TimePicker,
  },
  data() {
    return {
      entry: {
        company_id: null,
        company_name: null,
        client_name: null,
        date: new Date(),
        start: moment().subtract('30', 'minutes').toDate(),
        end: moment().toDate(),
        description: null,
        summary: null,
        resolved: true,
      },
      errors: [],
      isLoading: false,
      show: false,
      tabIndex: -1,
    }
  },
  watch: {
    'entry.date': function (newVal) {
      this.entry.start.setFullYear(
        newVal.getFullYear(),
        newVal.getMonth(),
        newVal.getDate()
      )
      this.entry.end.setFullYear(
        newVal.getFullYear(),
        newVal.getMonth(),
        newVal.getDate()
      )
      this.$refs.entryStartTimepicker.updateValue(this.entry.start)
      this.$refs.entryEndTimepicker.updateValue(this.entry.end)
    },
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.companyID.focus()
        }, 25)
      }
    },
  },
  methods: {
    close() {
      this.show = false
      this.tabIndex = -1
      document.body.style.overflow = 'auto'
    },
    formatEntry() {
      return {
        ...this.entry,
        team: this.$store.state.team.team.id,
        user: this.$store.state.account.account.id,
      }
    },
    onCompanyChange() {
      this.entry.company_name = null
      if (this.entry.company_id) {
        let company = this.$store.state.team.cwCompanies.find(
          (company) => company.id == this.entry.company_id
        )
        this.entry.company_name = company.name
        this.entry.client_name = null
        if (company.contact) {
          this.entry.client_name = company.contact.name
        }
      } else {
        console.log('no company selected')
      }
    },
    open() {
      this.show = true
      this.tabIndex = 0
      document.body.style.overflow = 'hidden'
    },
    reset() {
      this.errors = []
      this.entry = {
        company_id: null,
        company_name: null,
        client_name: null,
        date: moment().set({ hours: 0, minutes: 0, seconds: 0 }).toDate(),
        start: moment().subtract('30', 'minutes').toDate(),
        end: moment().toDate(),
        description: null,
        summary: null,
        resolved: true,
      }
    },
    async saveEntry() {
      this.isLoading = true
      if (this.validate()) {
        let formattedEntry = this.formatEntry()
        try {
          if (formattedEntry.id) {
            await this.$store.dispatch('api/put', {
              url: `/logs/entry/id/${formattedEntry.id}/`,
              data: formattedEntry,
            })
            this.$root.$emit('showToast', {
              text: `Time Entry for ${this.entry.company_name} has been updated.`,
              type: 'success',
            })
          } else {
            await this.$store.dispatch('api/post', {
              url: `/logs/entry/`,
              data: formattedEntry,
            })
            this.$root.$emit('showToast', {
              text: `Time Entry for ${this.entry.company_name} has been added.`,
              type: 'success',
            })
          }
          this.$root.$emit('updateEntries')
          this.close()
          this.reset()
        } catch (err) {
          console.log(err)
          this.$root.$emit('showToast', {
            text: 'Uh oh! Something went wrong here...',
            type: 'error',
          })
        }
      }
      this.isLoading = false
    },
    validate() {
      this.errors = []
      Object.keys(this.entry).forEach((key) => {
        if (this.entry[key] == null) {
          this.errors.push(key)
        }
      })
      let followupIndex = this.errors.indexOf('followup')
      if (followupIndex >= 0) {
        this.errors.splice(followupIndex, 1)
      }
      if (this.errors.length) {
        this.$root.$emit('showToast', {
          text: 'Please correct errors in the new journal entry.',
          type: 'error',
        })
        return false
      } else {
        return true
      }
    },
  },
  mounted() {
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Esc' || event.key === 'Escape') {
        if (this.show) {
          this.close()
        }
      }
    })
  },
  created() {
    this.$root.$on('showJournalModal', () => {
      if (this.entry.id) {
        this.reset()
      }
      this.open()
    })
    this.$root.$on('editJournalEntry', async (id) => {
      try {
        let entry = await this.$store.dispatch(
          'api/get',
          `/logs/entry/id/${id}/`
        )
        this.entry = {
          ...entry,
          date: moment(entry.start)
            .set({ hours: 0, minutes: 0, seconds: 0 })
            .toDate(),
          start: moment(entry.start).toDate(),
          end: moment(entry.end).toDate(),
        }
        this.open()
      } catch (err) {
        console.log(err)
      }
    })
  },
}
</script>
