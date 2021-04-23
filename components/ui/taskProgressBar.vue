<template>
  <div class="space-y-2">
    <div
      class="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded"
      v-if="totalTasks"
    >
      <div
        class="rounded h-8 w-full transition-transform ease-in-out duration-150"
        :class="{
          'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200':
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
        :style="`transform: scaleX(${
          completedTasks / totalTasks
        }); transform-origin: 0% 50%;`"
      ></div>
    </div>
    <div class="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded" v-else></div>
    <div class="flex items-center justify-between px-2">
      <p>{{ completedTasks }} / {{ totalTasks }} tasks complete</p>
      <p v-if="totalTasks">
        {{ ((completedTasks / totalTasks) * 100).toFixed(2) }}%
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskProgressBar',
  props: {
    completedTasks: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      requiured: true,
    },
    totalTasks: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style></style>
