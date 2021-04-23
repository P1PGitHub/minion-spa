<template>
  <div
    class="flex items-center justify-between p-2 relative"
    :class="{
      'border-b border-gray-400 dark:border-gray-600': showBorder,
    }"
  >
    <h4 class="font-semibold text-lg">
      {{ member.account.first_name }}
      {{ member.account.last_name.substring(0, 1) }}
    </h4>
    <div class="flex items-center space-x-2">
      <button
        class="p-1 flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-red-700 dark:hover:text-red-400"
        v-if="$store.state.account.account.report_admin"
        @click="deleteMember"
      >
        <inline-svg
          class="h-4 w-4"
          :src="require('@/assets/svg/content/trash.svg')"
        />
      </button>
    </div>
    <div
      class="absolute inset-0 flex items-center justify-center bg-opacity-25 bg-gray-400 rounded"
      v-if="isLoading"
    >
      <Loading />
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import Loading from '@/components/common/loading'

export default {
  name: 'MemberListItem',
  props: {
    showBorder: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    member: {
      type: Object,
      required: true,
    },
  },
  components: {
    ActionButton,
    Loading,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    async deleteMember() {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: `Are you sure you want to remove member '${
          this.member.account.first_name
        } ${this.member.account.last_name.substring(0, 1)}' from this project?`,
      })
      this.$root.$once('modalClose', async (choice) => {
        if (choice) {
          await this.$store.dispatch(
            'api/delete',
            `/projects/members/${this.member.id}/`
          )
          this.$emit('deleteMember', this.member.id)
        }
        this.isLoading = false
      })
    },
  },
}
</script>

<style></style>
