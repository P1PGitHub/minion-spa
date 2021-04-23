<template>
  <Modal
    title="Upload Files"
    :icon="require('@/assets/svg/file/file.svg')"
    ref="modal"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <form @submit.prevent class="mt-4 space-y-4">
      <fieldset class="space-y-2">
        <label
          for="file-input"
          class="block p-2 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer text-center hover:bg-blue-200 dark:hover:bg-blue-700 focus:ring-2 focus:outline-none"
          ref="fileInputLabel"
          :tabindex="tabIndex"
          @keyup.enter="$refs.fileInput.click"
          @keyup.space="$refs.fileInput.click"
          >Choose Files</label
        >
        <input
          type="file"
          name="file-input"
          id="file-input"
          multiple
          class="hidden"
          tabindex="-1"
          ref="fileInput"
          @change="onChange"
          :disabled="isLoading"
        />
      </fieldset>
    </form>
    <div class="mt-4 space-y-2 max-h-48 md:max-h-96 overflow-y-auto">
      <div>
        <div
          v-for="(file, index) in files"
          :key="index"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'border-b': index + 1 !== files.length }"
        >
          <div class="flex items-center space-x-2">
            <inline-svg
              :src="require('@/assets/svg/file/image.svg')"
              class="h-6 w-6"
              v-if="
                file.file.type === 'image/png' ||
                file.file.type === 'image/jpeg' ||
                file.file.type === 'image/jpg' ||
                file.file.type === 'image/svg+xml' ||
                file.file.type === 'image/gif'
              "
            />
            <inline-svg
              :src="require('@/assets/svg/file/document.svg')"
              class="h-6 w-6"
              v-else-if="
                file.file.type === 'application/msword' ||
                file.file.type ===
                  'application/vnd.openxmlformats-officedocument.wordprocessing' ||
                file.file.type ===
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.file.type === 'application/pdf' ||
                file.file.type === '	application/vnd.ms-powerpoint' ||
                file.file.type ===
                  'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                file.file.type === 'application/rtf'
              "
            />
            <inline-svg
              :src="require('@/assets/svg/file/database.svg')"
              class="h-6 w-6"
              v-else-if="file.file.name.split('.')[-1] === 'bak'"
            />
            <inline-svg
              :src="require('@/assets/svg/file/file.svg')"
              class="h-6 w-6"
              v-else
            />
            <p class="truncate">{{ file.file.name }}</p>
          </div>
          <div class="flex items-center justify-between pr-2">
            <p
              class="text-sm text-gray-500 pl-8"
              v-if="file.file.size < 1000000"
            >
              {{ (file.file.size / 1000).toFixed(2) }} KB
            </p>
            <p
              v-else-if="file.file.size < 1000000000"
              class="text-sm text-gray-500 pl-8"
            >
              {{ (file.file.size / 1000000).toFixed(2) }} MB
            </p>
            <p v-else class="text-sm text-gray-500 pl-8">
              {{ (file.file.size / 1000000000).toFixed(2) }} GB
            </p>
            <button
              class="text-gray-500 hover:text-red-500"
              @click="removeFile(index)"
              v-if="file.state === 'PAUSED'"
            >
              <inline-svg
                :src="require('@/assets/svg/content/trash.svg')"
                class="h-4 w-4"
              />
            </button>
          </div>
          <div class="w-full mt-2">
            <div class="flex items-center space-x-2">
              <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  class="rounded h-4 w-full transition-transform ease-in-out duration-150"
                  :class="{
                    'bg-blue-800 text-white dark:bg-blue-300 dark:text-gray-800':
                      file.state === 'RUNNING',
                    'bg-green-800 text-white dark:bg-green-300 dark:text-gray-800':
                      file.state === 'COMPLETED',
                    'bg-red-800 text-white dark:bg-red-300 dark:text-gray-800':
                      file.state === 'ERROR',
                  }"
                  :style="`transform: scaleX(${file.progress}); transform-origin: 0% 50%;`"
                ></div>
              </div>

              <div>
                <inline-svg
                  :src="require('@/assets/svg/multimedia/pause.svg')"
                  class="h-4 w-4 text-gray-500"
                  v-if="file.state === 'PAUSED'"
                />
                <inline-svg
                  :src="require('@/assets/svg/file/upload.svg')"
                  class="h-4 w-4 text-gray-500"
                  v-else-if="file.state === 'RUNNING'"
                />
                <span
                  class="text-gray-500"
                  v-else-if="file.state === 'COMPLETED'"
                  >&check;</span
                >
                <span class="text-gray-500" v-else>&times;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between mt-2" v-if="files.length">
      <p>{{ files.length }} files</p>
      <p v-if="totalFileSize < 1000000000">
        {{ (totalFileSize / 1000000).toFixed(2) }} MB
      </p>
      <p v-else>{{ (totalFileSize / 1000000000).toFixed(2) }} GB</p>
    </div>
    <div class="flex items-center space-x-2 mt-2" v-if="isLoading">
      <Loading size="sm" />
      <p>Uploading</p>
    </div>
    <div class="flex items-center space-x-2 mt-2" v-if="files.length">
      <ActionButton
        theme="hollow"
        spacing="sm"
        :tabindex="tabIndex"
        @click="reset"
      >
        <inline-svg
          :src="require('@/assets/svg/arrows/sync.svg')"
          class="h-6 w-6 text-gray-800 dark:text-white"
        />
      </ActionButton>
      <ActionButton
        spacing="sm"
        class="w-full"
        :tabindex="tabIndex"
        @click="uploadFiles"
        >Upload</ActionButton
      >
    </div>
  </Modal>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import Loading from '@/components/common/loading'
import Modal from '@/components/ui/modal'
export default {
  name: 'FileUploadModal',
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  props: {
    baseRef: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      files: [],
      totalFileSize: 0,
      isLoading: false,
      tabIndex: -1,
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.fileInputLabel.focus()
        }, 25)
      } else {
        this.reset()
      }
    },
  },
  methods: {
    close() {
      this.$refs.modal.close()
    },
    onChange() {
      this.files = []
      ;[...this.$refs.fileInput.files].forEach((file) => {
        this.totalFileSize += file.size
        this.files.push({ file, state: 'PAUSED', progress: 0.0 })
      })
    },
    open() {
      this.$refs.modal.open()
    },
    reset() {
      this.$refs.fileInput.value = ''
      this.files = []
      this.totalFileSize = 0
    },
    uploadFiles() {
      this.isLoading = true
      const uploadTasks = []
      this.files.forEach((file) => {
        uploadTasks.push(
          this.baseRef.child(file.file.name).put(file.file, {
            customMetadata: {
              userID: this.$store.state.account.account.id,
              userFirstName: this.$store.state.account.account.first_name,
              userLastName: this.$store.state.account.account.last_name,
            },
          })
        )
      })
      uploadTasks.forEach((task, index) => {
        task.on(
          'state_changed',
          (snapshot) => {
            this.files[index].state = 'RUNNING'
            this.files[index].progress =
              snapshot.bytesTransferred / snapshot.totalBytes
          },
          () => {
            this.files[index].state = 'ERROR'
          },
          () => {
            this.files[index].state = 'COMPLETED'
            let isComplete = true
            this.files.forEach((file) => {
              isComplete = isComplete && file.state === 'COMPLETED'
            })
            if (isComplete) {
              this.isLoading = false
              this.$emit('updateFiles')
              setTimeout(() => this.close(), 2500)
            }
          }
        )
      })
    },
  },
}
</script>

<style></style>
