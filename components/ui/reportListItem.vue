<template>
  <div
    class="p-2 bg-gray-100 dark:bg-gray-700 border-2 border-blue-400 rounded space-y-1 text-gray-800 dark:text-white relative"
  >
    <h3
      class="font-bold text-blue-800 dark:text-white text-lg space-x-2 flex items-center"
    >
      <span>
        {{ report.company_name }}
      </span>
      <span v-if="draft" class="inline-block p-1 bg-blue-600 rounded">
        <inline-svg
          :src="require('@/assets/svg/design/edit-white.svg')"
          class="h-4 w-auto"
        />
      </span>
    </h3>

    <h5 class="text-gray-700 dark:text-gray-200">{{ report.client_name }}</h5>
    <p>{{ report.description }}</p>

    <div class="flex flex-wrap items-center justify-between">
      <div class="flex items-center space-x-2" v-if="authorName && !hideAuthor">
        <inline-svg
          :src="require('@/assets/svg/other/user.svg')"
          fill="fill-current"
          class="h-6 w-auto text-gray-800 dark:text-white"
        ></inline-svg>
        <p class="text-black dark:text-gray-200">
          {{ authorName }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <div class="p-1 bg-blue-600 rounded" v-if="report.billable">
          <inline-svg
            :src="require('@/assets/svg/other/dollar.svg')"
            fill="fill-current"
            class="text-white h-5 w-auto"
          ></inline-svg>
        </div>
        <div class="flex items-center space-x-2 p-1 rounded text-sm">
          <inline-svg
            :src="require('@/assets/svg/other/time.svg')"
            fill="fill-current"
            class="h-4 w-auto"
          ></inline-svg>
          <p>
            {{ report.created_at | moment('M/D/YYYY HH:mm') }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <div class="absolute top-0 right-0 -mt-2 -mr-2">
        <button
          class="rounded-full h-6 w-6 bg-blue-600 flex items-center justify-center text-white italic"
          @click="toggle"
        >
          <inline-svg
            :src="require('@/assets/svg/buttons/more.svg')"
            fill="fill-current"
            class="h-6 w-auto"
          ></inline-svg>
        </button>
        <div
          class="absolute rounded-lg bg-white dark:bg-gray-800 border-2 border-blue-300 top-0 right-0 shadow w-32 mt-8 z-30"
          v-if="contextOpen"
        >
          <button
            class="w-full px-2 py-1 flex items-center space-x-2 border-b border-blue-300 hover:text-blue-600"
            v-if="draft"
            @click="pushEdit"
          >
            <inline-svg
              :src="require('@/assets/svg/design/edit.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Edit</span>
          </button>
          <button
            class="w-full px-2 py-1 flex items-center space-x-2 border-b border-blue-300 hover:text-blue-600"
            v-else
            @click="pushView"
          >
            <inline-svg
              :src="require('@/assets/svg/other/eye.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>View</span>
          </button>
          <button
            class="w-full px-2 py-1 flex items-center space-x-2 border-b border-blue-300 hover:text-blue-600"
            v-if="!draft"
            @click="download"
          >
            <inline-svg
              :src="require('@/assets/svg/buttons/software-download.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Download</span>
          </button>
          <button
            class="w-full px-2 py-1 flex items-center space-x-2 border-b border-blue-300 hover:text-blue-600"
            v-if="draft"
            @click="deleteReport"
          >
            <inline-svg
              :src="require('@/assets/svg/content/trash.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Delete</span>
          </button>
          <button
            class="w-full px-2 py-1 flex items-center space-x-2 hover:text-blue-600"
            @click="toggle"
          >
            <inline-svg
              :src="require('@/assets/svg/other/close.svg')"
              fill="fill-current"
              class="h-4 w-auto"
            ></inline-svg>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
export default {
  name: 'ReportListItem',
  components: {
    ActionButton,
    ButtonLink,
  },
  props: {
    border: {
      type: Boolean,
      required: false,
      default: true,
    },
    draft: {
      type: Boolean,
      required: false,
      default: false,
    },
    editLink: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideAuthor: {
      type: Boolean,
      required: false,
      default: false,
    },
    report: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      authorName: null,
      editorName: null,
      contextOpen: false,
    }
  },
  methods: {
    close() {
      this.contextOpen = false
    },
    async deleteReport() {
      this.close()
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to delete this report?',
      })
      this.$root.$once('modalClose', (choice) => {
        if (choice) {
          let response = this.$store
            .dispatch('api/delete', `/reports/${this.report.id}/`)
            .then(() => {
              this.reloadReports()
            })
        }
      })
    },
    async download() {
      this.close()
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to download this report?',
      })
      this.$root.$once('modalClose', (choice) => {
        if (choice) {
          let refString = `${this.$store.state.team.team.slug}/reports/csqr/${this.report.id}.xlsx`
          let ref = this.$fireStorage.ref().child(refString)
          let downloadurl = ref.getDownloadURL().then((url) => {
            const link = document.createElement('a')
            link.href = url
            link.download = `${this.report.id}.xlsx`
            document.body.appendChild(link)
            link.click()
          })
        }
      })
    },
    pushEdit() {
      this.close()
      this.$router.push({
        name: 'reports-csqr-id-edit',
        params: { id: this.report.id },
      })
    },
    pushView() {
      this.close()
      this.$router.push({
        name: 'reports-csqr-id',
        params: { id: this.report.id },
      })
    },
    reloadReports() {
      this.$emit('reload')
    },
    toggle() {
      this.contextOpen = !this.contextOpen
    },
  },
  created() {
    if (this.report.author) {
      let authorObj = this.$store.state.team.members.find(
        (member) => member.id == this.report.author
      )
      if (authorObj) {
        this.authorName = `${authorObj.last_name}, ${authorObj.first_name}`
      }
    }
  },
}
</script>
