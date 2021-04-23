<template>
  <div
    class="p-2"
    :class="{
      'text-red-700 dark:text-red-400': update.status === 'URGENT',
      'text-green-700 dark:text-green-400': update.status === 'POSITIVE',
      'text-gray-500 dark:text-gray-500': update.status === 'REMARK',
      'border-b border-gray-200 dark:border-gray-700': !hideBorder,
    }"
  >
    <h3 class="">{{ update.title }}</h3>
    <div
      v-if="update.message && !hideMessage"
      class="p-2 mt-2 text-gray-600 dark:text-gray-300 text-sm rounded bg-gray-200 dark:bg-gray-700"
    >
      <p class="whitespace-pre-wrap">{{ update.message }}</p>
    </div>
    <div v-if="!hideMessage" class="text-gray-500 text-sm mt-2 pl-4">
      {{ update.created_at | moment('MMM D, YYYY h:ma') }}
    </div>
    <div
      class="text-sm text-gray-600 dark:text-gray-500 mt-2"
      v-if="!hideProject"
    >
      <nuxt-link
        class="p-1 flex items-center space-x-2 hover:underline"
        :to="{ name: 'projects-id', params: { id: update.project.id } }"
      >
        <inline-svg
          :src="require('@/assets/svg/content/clipboard.svg')"
          class="h-5 w-5"
        />
        <p class="overflow-x-hidden whitespace-no-wrap">
          {{ update.project.summary }}
        </p>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import ButtonLink from '@/components/ui/buttonLink'
export default {
  name: 'UpdateListItem',
  props: {
    update: {
      type: Object,
      required: true,
    },
    hideBorder: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    hideMessage: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    hideProject: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  components: {
    ButtonLink,
  },
}
</script>
