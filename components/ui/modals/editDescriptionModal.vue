<template>
  <Modal
    title="Edit Project Details"
    :subheading="subtitle"
    ref="editDescriptionModal"
    :icon="require('@/assets/svg/content/details-more.svg')"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <form @submit.prevent="saveDetails" class="space-y-4 mt-4">
      <fieldset class="space-y-2">
        <label for="project-status" class="block"> Status </label>
        <select
          name="project-status"
          id="project-status"
          class="select"
          v-model="status"
          :tabindex="tabIndex"
          ref="projectStatus"
        >
          <option
            :value="stat.value"
            v-for="stat in $store.state.project.projectStatusChoices"
            :key="stat.value"
          >
            {{ stat.text }}
          </option>
        </select>
      </fieldset>
      <fieldset class="space-y-2">
        <label for="project-summary" class="block">Summary</label>
        <input
          type="text"
          name="project-summary"
          id="project-summart"
          v-model="summary"
          :tabindex="tabIndex"
        />
      </fieldset>
      <fieldset class="space-y-2">
        <label for="project-description" class="block">Description</label>
        <textarea
          name="project-description"
          id="project-description"
          class="w-full h-48"
          v-model="description"
          :tabindex="tabIndex"
        ></textarea>
      </fieldset>
      <div class="flex items-center space-x-2">
        <ActionButton
          theme="hollow"
          type="button"
          @click="reset"
          :tabindex="tabIndex"
        >
          <inline-svg
            :src="require('@/assets/svg/arrows/sync.svg')"
            class="h-6 w-6"
          />
        </ActionButton>
        <ActionButton
          theme="primary"
          class="w-full"
          type="submit"
          :tabindex="tabIndex"
          >Save Edits</ActionButton
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
  name: 'EditDescriptionModal',
  props: {
    initialDescription: {
      type: String,
      required: true,
    },
    initialStatus: {
      type: String,
      required: true,
    },
    initialSummary: {
      type: String,
      required: true,
    },
    projectID: {
      type: Number,
      required: true,
    },
    subtitle: {
      type: String,
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
      status: null,
      description: '',
      summary: '',
      tabIndex: -1,
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.projectStatus.focus()
        }, 25)
      }
    },
  },
  methods: {
    close() {
      this.$refs.editDescriptionModal.close()
    },
    open() {
      this.$refs.editDescriptionModal.open()
    },
    reset() {
      this.description = this.initialDescription
      this.status = this.initialStatus
      this.summary = this.initialSummary
      this.isLoading = false
    },
    saveDetails() {
      if (!this.description || !this.summary || this.isLoading) {
        return
      }
      this.isLoading = true
      this.$emit('save', {
        description: this.description,
        status: this.status,
        summary: this.summary,
      })
    },
  },
  created() {
    this.description = this.initialDescription
    this.status = this.initialStatus
    this.summary = this.initialSummary
  },
}
</script>

<style></style>
