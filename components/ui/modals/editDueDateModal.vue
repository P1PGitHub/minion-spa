<template>
  <Modal
    title="Edit Due Date"
    :subheading="subtitle"
    :icon="require('@/assets/svg/alerts/calendar-today.svg')"
    ref="modal"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <div class="space-y-4 mt-4">
      <div class="flex items-center justify-center">
        <v-date-picker
          v-model="newDueDate"
          title-position="left"
          :attributes="attributes"
          :is-dark="$colorMode.value == 'dark'"
          :model-config="modelConfig"
          timezone="UTC"
          ref="editDatePicker"
        ></v-date-picker>
      </div>
      <div class="flex items-center space-x-2">
        <ActionButton
          theme="hollow"
          type="button"
          @click="reset"
          :tabindex="tabIndex"
        >
          <inline-svg
            :src="require('@/assets/svg/arrows/sync.svg')"
            class="h-6 w-6 text-gray-800 dark:text-white"
          />
        </ActionButton>
        <ActionButton
          theme="primary"
          class="w-full"
          @click="save"
          :tabindex="tabIndex"
          >Save Due Date</ActionButton
        >
      </div>
    </div>
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
  name: 'EditDueDateModal',
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  props: {
    currentDueDate: {
      type: Date,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
  computed: {
    currentDueDateObj() {
      return moment(this.currentDueDate).utc().toDate()
    },
    attributes() {
      return [
        {
          key: 'current',
          dot: 'blue',
          dates: this.currentDueDateObj,
        },
        { key: 'today', highlight: 'gray', dates: new Date() },
      ]
    },
  },
  data() {
    return {
      isLoading: false,
      newDueDate: moment(this.currentDueDate).utc().toDate(),
      modelConfig: {
        timeAdjust: '04:00:00',
      },
      tabIndex: -1,
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.editDatePicker.focusDate(this.newDueDate)
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
    reset() {
      this.$refs.editDatePicker.updateValue(
        moment(this.currentDueDate).utc().toDate()
      )
      this.isLoading = false
    },
    save() {
      this.isLoading = true
      this.$emit('save', this.newDueDate)
    },
  },
}
</script>

<style></style>
