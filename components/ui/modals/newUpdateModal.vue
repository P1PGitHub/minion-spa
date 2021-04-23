<template>
  <Modal
    ref="newUpdateModal"
    title="New Update"
    :subheading="subtitle"
    :icon="require('@/assets/svg/multimedia/album.svg')"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <form @submit.prevent="postUpdate" class="space-y-4">
      <fieldset class="space-y-2">
        <label for="update-title" class="block">Title</label>
        <input
          name="update-title"
          id="update-title"
          type="text"
          placeholder="Don't forget to..."
          v-model="value.title"
          :tabindex="tabIndex"
          ref="updateTitle"
        />
      </fieldset>
      <fieldset class="space-y-2">
        <label for="update-message" class="block">Message</label>
        <textarea
          name="update-message"
          id="update-message"
          placeholder="Lorem ipsum dolor sit amet..."
          rows="5"
          class="w-full"
          v-model="value.message"
          :tabindex="tabIndex"
        ></textarea>
      </fieldset>
      <fieldset class="space-y-2">
        <label for="update-status">Status</label>
        <select
          name="update-status"
          id="update-status"
          class="select"
          v-model="value.status"
          :tabindex="tabIndex"
        >
          <option
            :value="status.value"
            v-for="status in $store.state.project.updateStatusChoices"
            :key="status.value"
          >
            {{ status.text }}
          </option>
        </select>
      </fieldset>
      <div class="flex items-center space-x-2">
        <ActionButton theme="hollow" @click="reset" :tabindex="tabIndex">
          <inline-svg
            :src="require('@/assets/svg/arrows/sync.svg')"
            class="h-6 w-6 text-gray-800 dark:text-white"
          />
        </ActionButton>
        <ActionButton
          theme="primary"
          class="w-full"
          @click="postUpdate"
          :tabindex="tabIndex"
          >Add Update</ActionButton
        >
      </div>
    </form>
    <div
      class="absolute inset-0 z-50 flex items-center justify-center bg-opacity-25 bg-gray-400"
      v-if="isLoading"
    >
      <Loading size="xl" />
    </div>
  </Modal>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import Loading from '@/components/common/loading'
import Modal from '@/components/ui/modal'
export default {
  name: 'NewUpdateModal',
  props: {
    projectID: {
      type: Number,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  data() {
    return {
      isLoading: false,
      tabIndex: -1,
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.updateTitle.focus()
        }, 25)
      }
    },
    value() {
      this.$emit.update('input', this.value)
    },
  },
  methods: {
    close() {
      this.$refs.newUpdateModal.close()
    },
    open() {
      this.$refs.newUpdateModal.open()
    },
    async postUpdate() {
      if (this.isLoading || !this.validate()) {
        return
      }
      this.isLoading = true
      const updateResponse = await this.$store.dispatch('api/post', {
        url: `/projects/${this.projectID}/updates/`,
        data: {
          ...this.value,
          project: this.projectID,
        },
      })
      this.isLoading = false
      this.$emit('addUpdate', updateResponse)
      this.close()
      this.reset()
    },
    reset() {
      this.value.title = ''
      this.value.message = ''
      this.value.status = 'INFO'
    },
    validate() {
      return this.value.title !== ''
    },
  },
}
</script>
