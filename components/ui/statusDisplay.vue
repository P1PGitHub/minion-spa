<template>
  <div
    class="rounded text-sm md:text-base"
    :class="{
      'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200':
        status === 'PROPOSED',
      'bg-blue-800 text-white dark:bg-blue-300 dark:text-gray-800':
        status === 'IN PROGRESS',
      'bg-teal-800 text-white dark:bg-teal-300 dark:text-gray-800':
        status === 'AWAITING CUSTOMER' || status === 'AWAITING SUPPORT',
      'bg-purple-800 text-white dark:bg-purple-300 dark:text-gray-800':
        status === 'UNDER REVIEW',
      'bg-green-800 text-white dark:bg-green-300 dark:text-gray-800':
        status === 'COMPLETED',
      'bg-red-800 text-white dark:bg-red-300 dark:text-gray-800':
        status === 'CANCELLED',
    }"
  >
    <button
      tabindex="-1"
      @click="$emit('click')"
      class="flex items-center space-x-2 px-4 py-2"
    >
      <inline-svg
        :src="require('@/assets/svg/content/clipboard.svg')"
        class="h-4 w-4 md:h-6 md:w-6"
        v-if="status === 'PROPOSED'"
      />
      <inline-svg
        :src="require('@/assets/svg/other/time.svg')"
        class="h-4 w-4 md:h-6 md:w-6"
        v-else-if="status === 'IN PROGRESS'"
      />
      <inline-svg
        :src="require('@/assets/svg/other/user.svg')"
        class="h-4 w-4 md:h-6 md:w-6"
        v-else-if="status === 'AWAITING CUSTOMER'"
      />
      <inline-svg
        :src="require('@/assets/svg/other/smartphone.svg')"
        class="h-4 w-4 md:h-6 md:w-6"
        v-else-if="status === 'AWAITING SUPPORT'"
      />
      <inline-svg
        :src="require('@/assets/svg/buttons/search.svg')"
        class="h-4 w-4 md:h-6 md:w-6"
        v-else-if="status === 'UNDER REVIEW'"
      />
      <inline-svg
        :src="require('@/assets/svg/other/check.svg')"
        class="h-4 w-4 md:h-6 md:w-6"
        v-else-if="status === 'COMPLETED'"
      />
      <inline-svg
        :src="require('@/assets/svg/other/close.svg')"
        class="h-4 w-4 md:h-6 md:w-6"
        v-else-if="status === 'CANCELLED'"
      />
      <span class="whitespace-nowrap">
        {{ statusText }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'StatusDisplay',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    statusText() {
      return this.$store.state.project.projectStatusChoices.find(
        (stat) => stat.value === this.status
      ).text
    },
  },
}
</script>
