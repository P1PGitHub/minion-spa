<template>
  <Modal
    :title="file ? file.name : ''"
    :icon="this.icon"
    ref="modal"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <template v-if="file">
      <div class="mt-4 p-2 bg-gray-200 dark:bg-gray-700 bg-opacity-50 rounded">
        <p class="font-semibold text-lg">{{ file.name }}</p>
        <p class="text-gray-600 text-sm dark:text-gray-300">
          {{ file.meta.fullPath }}
        </p>
      </div>
      <div class="mt-4 p-2 bg-gray-200 dark:bg-gray-700 bg-opacity-50 rounded">
        <p class="font-semibold text-lg truncate">
          {{ file.meta.contentType }}
        </p>
        <p
          class="text-sm text-gray-500 dark:text-gray-300"
          v-if="file.meta.size < 1000000"
        >
          {{ (file.meta.size / 1000).toFixed(2) }} KB
        </p>
        <p
          v-else-if="file.meta.size < 1000000000"
          class="text-sm text-gray-500 dark:text-gray-300"
        >
          {{ (file.meta.size / 1000000).toFixed(2) }} MB
        </p>
        <p v-else class="text-sm text-gray-500 dark:text-gray-300">
          {{ (file.meta.size / 1000000000).toFixed(2) }} GB
        </p>
      </div>
      <div
        class="mt-4 p-2 bg-gray-200 dark:bg-gray-700 bg-opacity-50 rounded"
        v-if="file.meta.customMetadata"
      >
        <p class="font-semibold text-lg">
          {{ file.meta.customMetadata.userFirstName }}
          {{ file.meta.customMetadata.userLastName }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-300">
          {{ file.meta.updated | moment('MMM D, YYYY h:ma') }}
        </p>
      </div>
      <div class="mt-4 w-full flex items-center space-x-2">
        <ActionButton theme="danger" spacing="sm" @click="deleteFile">
          <inline-svg
            :src="require('@/assets/svg/content/trash.svg')"
            class="h-6 w-6"
          />
        </ActionButton>
        <a
          theme="hollow"
          spacing="sm"
          class="w-full flex items-center justify-center font-bold rounded whitepsace-no-wrap space-x-2 px-2 py-1 text-gray-800 border border-gray-800 hover:bg-gray-200 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-700"
          ref="downloadButton"
          target="_blank"
          download
          :href="file.download"
        >
          <inline-svg
            :src="require('@/assets/svg/buttons/software-download.svg')"
            class="h-6 w-6"
          />
          <span>Download</span>
        </a>
      </div>
    </template>
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
  name: 'FileInfoModal',
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  data() {
    return {
      tabIndex: -1,
      file: null,
      isLoading: false,
      icon: require('@/assets/svg/file/file.svg'),
      icons: [
        require('@/assets/svg/file/image.svg'),
        require('@/assets/svg/file/document.svg'),
        require('@/assets/svg/file/database.svg'),
        require('@/assets/svg/file/file.svg'),
      ],
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.downloadButton.focus()
        }, 25)
      }
    },
  },
  methods: {
    close() {
      this.$refs.modal.close()
    },
    async deleteFile() {
      this.isLoading = true
      await this.$fireStorage.ref().child(this.file.meta.fullPath).delete()
      this.$emit('deleteFile')
      this.isLoading = false
      this.close()
    },
    open(file) {
      this.file = file
      this.icon = this.getIcon()
      this.$refs.modal.open()
    },
    getIcon() {
      if (!this.file) {
        return this.icons[3]
      }
      if (
        this.file.meta.contentType === 'image/png' ||
        this.file.meta.contentType === 'image/jpeg' ||
        this.file.meta.contentType === 'image/jpg' ||
        this.file.meta.contentType === 'image/svg+xml' ||
        this.file.meta.contentType === 'image/gif'
      ) {
        return this.icons[0]
      } else if (
        this.file.meta.contentType === 'application/msword' ||
        this.file.meta.contentType ===
          'application/vnd.openxmlformats-officedocument.wordprocessing' ||
        this.file.meta.contentType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        this.file.meta.contentType === 'application/pdf' ||
        this.file.meta.contentType === '	application/vnd.ms-powerpoint' ||
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        this.file.meta.contentType === 'application/rtf'
      ) {
        return this.icons[1]
      } else if (this.file.name.split('.')[-1] === 'bak') {
        return this.icons[2]
      } else {
        return this.icons[3]
      }
    },
  },
}
</script>

<style></style>
