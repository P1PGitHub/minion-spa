<template>
  <div
    class="p-2 space-y-1"
    :class="{ 'border-b border-dashed border-gray-400': border }"
  >
    <div class="flex items-center justify-between">
      <h3 class="font-bold">{{ report.company_name }}</h3>
      <div class="py-1 px-2 bg-gray-600 rounded" v-if="report.billable">
        <img
          src="@/assets/svg/other/dollar-white.svg"
          alt="billable icon"
          class="w-4 h-4"
        />
      </div>
    </div>

    <h5 class="text-gray-700">{{ report.client_name }}</h5>
    <div class="flex items-start justify-between">
      <p >{{ report.description }}</p>
      <ButtonLink
        :link="{
          name: 'reports-csqr-id',
          params: { id: report.id },
        }"
        spacing="sm"
      >
        <img
          src="@/assets/svg/other/eye-white.svg"
          alt="Edit Icon"
          class="w-4 h-4"
        />
        <span class="leading-none">View</span>
      </ButtonLink>
    </div>
    <div class="flex items-center space-x-2" v-if="authorName && !hideAuthor">
      <img src="@/assets/svg/other/user.svg" alt="user icon" />
      <p class="text-black">
        {{ authorName }}
      </p>
    </div>
  </div>
</template>

<script>
import ButtonLink from '@/components/ui/buttonLink'
export default {
  name: 'ReportListItem',
  components: {
    ButtonLink,
  },
  props: {
    border: {
      type: Boolean,
      required: false,
      default: true,
    },
    hideAuthor: {
      type: Boolean,
      required: false,
      default: false
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
