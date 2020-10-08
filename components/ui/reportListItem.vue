<template>
  <div
    class="p-2 space-y-1 text-gray-800 dark:text-white"
    :class="{
      'border-b border-dashed border-gray-400 dark:border-gray-600': border,
    }"
  >
    <div class="flex items-center justify-between">
      <h3 class="font-bold">{{ report.company_name }}</h3>
      <div class="py-1 px-2 bg-gray-600 rounded" v-if="report.billable">
        <inline-svg
          :src="require('@/assets/svg/other/dollar.svg')"
          fill="fill-current"
          class="text-white h-4 w-auto"
        ></inline-svg>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <h5 class="text-gray-700 dark:text-gray-200">{{ report.client_name }}</h5>
      <ActionButton
        @click="download"
        spacing="sm"
        theme="hollow"
        v-if="!editLink"
      >
        <inline-svg
          :src="require('@/assets/svg/arrows/arrow-down-r.svg')"
          fill="fill-current"
          class="h-4 w-auto text-gray-800 dark:text-white"
        ></inline-svg>
      </ActionButton>
    </div>

    <div class="flex items-start justify-between">
      <p>{{ report.description }}</p>
      <ButtonLink
        :link="{
          name: 'reports-csqr-id-edit',
          params: { id: report.id },
        }"
        spacing="sm"
        v-if="editLink"
      >
        <inline-svg
          :src="require('@/assets/svg/design/edit.svg')"
          fill="fill-current"
          class="text-white h-4 w-auto"
        ></inline-svg>
        <span class="leading-none">Edit</span>
      </ButtonLink>
      <ButtonLink
        :link="{
          name: 'reports-csqr-id',
          params: { id: report.id },
        }"
        spacing="sm"
        v-else
      >
        <inline-svg
          :src="require('@/assets/svg/other/eye.svg')"
          fill="fill-current"
          class="text-white h-4 w-auto"
        ></inline-svg>
        <span class="leading-none">View</span>
      </ButtonLink>
    </div>
    <div class="flex items-center justify-between">
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
        <inline-svg
          :src="require('@/assets/svg/other/time.svg')"
          fill="fill-current"
          class="h-6 w-auto text-gray-800 dark:text-white"
        ></inline-svg>
        <p class="text-gray-700 dark:text-gray-400">
          {{ report.created_at | moment('M/D/YYYY HH:mm') }}
        </p>
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
    }
  },
  methods: {
    async download() {
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
            console.log(url)
          })
        }
      })
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
