<template>
  <div
    class="pb-2 relative"
    :class="{
      'border-b border-gray-400 dark:border-gray-600': !hideBorder,
    }"
  >
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-lg">{{ client.client_name }}</h3>
      <button
        class="p-1 flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-red-700 dark:hover:text-red-400"
        @click="deleteClient"
      >
        <inline-svg
          class="h-4 w-4"
          :src="require('@/assets/svg/content/trash.svg')"
        />
      </button>
    </div>

    <div
      class="mt-2 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded p-2 space-y-2"
      v-if="client.contact_name"
    >
      <div class="flex items-center space-x-2">
        <inline-svg
          :src="require('@/assets/svg/other/user.svg')"
          class="h-6 w-6"
        />
        <h4 class="font-semibold">{{ client.contact_name }}</h4>
      </div>
      <div class="flex items-center space-x-2" v-if="client.contact_email">
        <inline-svg
          :src="require('@/assets/svg/other/mail.svg')"
          class="h-6 w-6"
        />
        <h4>{{ client.contact_email }}</h4>
      </div>
      <div class="flex items-center space-x-2" v-if="client.contact_phone">
        <inline-svg
          :src="require('@/assets/svg/other/smartphone.svg')"
          class="h-6 w-6"
        />
        <h4>
          {{
            `(${client.contact_phone.substring(
              0,
              3
            )}) ${client.contact_phone.substring(
              3,
              6
            )}-${client.contact_phone.substring(6)}`
          }}
        </h4>
      </div>
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
import Loading from '@/components/common/loading'
export default {
  name: 'ClientListItem',
  props: {
    client: {
      type: Object,
      required: true,
    },
    hideBorder: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    projectID: {
      type: Number,
      required: true,
    },
  },
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    deleteClient() {
      this.isLoading = true
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: `Are you sure you want to remove Client '${this.client.client_name}' from this project?`,
      })
      this.$root.$once('modalClose', async (choice) => {
        if (choice) {
          await this.$store.dispatch(
            'api/delete',
            `/projects/clients/${this.client.id}/`
          )
          this.$emit('deleteClient', this.client.id)
        }
        this.isLoading = false
      })
    },
  },
}
</script>
