<template>
  <Modal
    title="New Project"
    :icon="require('@/assets/svg/content/clipboard.svg')"
    ref="modal"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <form @submit.prevent="postProject" class="space-y-4 mt-4">
      <fieldset class="space-y-2">
        <label for="project-summary" class="block">Summary</label>
        <input
          type="text"
          name="project-summary"
          id="project-summary"
          placeholder="Lorem ipsum dolor sit amet..."
          ref="projectSummary"
          v-model="project.summary"
          :tabindex="tabIndex"
        />
      </fieldset>
      <fieldset class="space-y-2">
        <label for="project-due-date" class="block">Due Date</label>
        <v-date-picker
          color="blue"
          :is-dark="$colorMode.value == 'dark'"
          :popover="{ visibility: 'focus' }"
          title-position="left"
          mode="date"
          ref="dueDatePicker"
          v-model="project.due_date"
          :attributes="attributes"
        >
          <template v-slot="{ inputValue, inputEvents }">
            <input
              id="project-due-date"
              name="project-due-date"
              type="text"
              :value="inputValue"
              v-on="inputEvents"
              :tabindex="tabIndex"
            />
          </template>
        </v-date-picker>
      </fieldset>
      <fieldset class="space-y-2">
        <label for="project-status" class="block">Status</label>
        <select
          name="project-status"
          id="project-status"
          class="select"
          v-model="project.status"
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
        <label for="project-description" class="block">Description</label>
        <textarea
          name="project-description"
          id="project-description"
          class="h-32 w-full"
          placeholder="Enim ut sem viverra aliquet eget sit amet. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique..."
          v-model="project.description"
          :tabindex="tabIndex"
        ></textarea>
      </fieldset>
      <div class="flex items-center space-x-2">
        <ActionButton
          theme="hollow"
          @click="reset"
          :tabindex="tabIndex"
          type="button"
        >
          <inline-svg
            :src="require('@/assets/svg/arrows/sync.svg')"
            class="h-6 w-6 text-gray-800 dark:text-white"
          />
        </ActionButton>
        <ActionButton
          theme="primary"
          class="w-full"
          type="submit"
          :tabindex="tabIndex"
          >Create Project</ActionButton
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
import moment from 'moment'
export default {
  name: 'NewProjectModal',
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  data() {
    return {
      isLoading: false,
      tabIndex: -1,
      attributes: [{ key: 'today', highlight: 'gray', dates: new Date() }],
      project: {
        summary: '',
        description: '',
        due_date: moment().add(2, 'weeks').toDate(),
        status: this.$store.state.project.projectStatusChoices[0].value,
        active: true,
        team: this.$store.state.team.team.id,
      },
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.projectSummary.focus()
        }, 25)
      }
    },
  },
  methods: {
    close() {
      this.$refs.modal.close()
    },
    open() {
      this.$refs.modal.open()
    },
    async postProject() {
      if (!this.validate()) {
        return
      }
      this.isLoading = true
      let project = await this.$store.dispatch('api/post', {
        url: '/projects/',
        data: this.project,
      })
      this.$router.push({ name: 'projects-id', params: { id: project.id } })
    },
    reset() {
      this.project = {
        summary: '',
        description: '',
        due_date: moment().add(2, 'weeks').toDate(),
        status: this.$store.state.project.projectStatusChoices[0].value,
        active: true,
        team: this.$store.state.team.team.id,
      }
    },
    validate() {
      if (!this.project.summary || !this.project.description) {
        this.$root.$emit('showToast', {
          text:
            'Please fill out the Summary and Description fields before submitting the new project.',
          type: 'error',
        })
        return false
      } else {
        return true
      }
    },
  },
}
</script>

<style></style>
