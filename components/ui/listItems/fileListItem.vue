<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between">
      <button
        class="flex items-center space-x-2 hover:underline focus:underline"
        @click="downloadFile()"
      >
        <inline-svg
          :src="require('@/assets/svg/file/image.svg')"
          class="h-6 w-6"
          v-if="
            file.meta.contentType === 'image/png' ||
            file.meta.contentType === 'image/jpeg' ||
            file.meta.contentType === 'image/jpg' ||
            file.meta.contentType === 'image/svg+xml' ||
            file.meta.contentType === 'image/gif'
          "
        />
        <inline-svg
          :src="require('@/assets/svg/file/document.svg')"
          class="h-6 w-6"
          v-else-if="
            file.meta.contentType === 'application/msword' ||
            file.meta.contentType ===
              'application/vnd.openxmlformats-officedocument.wordprocessing' ||
            file.meta.contentType ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.meta.contentType === 'application/pdf' ||
            file.meta.contentType === '	application/vnd.ms-powerpoint' ||
            file.meta.contentType ===
              'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            file.meta.contentType === 'application/rtf'
          "
        />
        <inline-svg
          :src="require('@/assets/svg/file/database.svg')"
          class="h-6 w-6"
          v-else-if="file.name.split('.')[-1] === 'bak'"
        />
        <inline-svg
          :src="require('@/assets/svg/file/file.svg')"
          class="h-6 w-6"
          v-else
        />
        <p>{{ file.name }}</p>
      </button>
      <button
        class="p-1 flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-red-700 dark:hover:text-red-400"
        @click="deleteFile"
      >
        <inline-svg
          class="h-4 w-4"
          :src="require('@/assets/svg/content/trash.svg')"
        />
      </button>
    </div>
    <div class="flex items-center text-sm space-x-2 text-gray-500 pl-8">
      <p v-if="file.meta.size < 1000000">
        {{ (file.meta.size / 1000).toFixed(2) }} KB
      </p>
      <p v-else-if="file.meta.size < 1000000000">
        {{ (file.meta.size / 1000000).toFixed(2) }} MB
      </p>
      <p v-else>{{ (file.meta.size / 1000000000).toFixed(2) }} GB</p>
      <p>{{ file.meta.updated | moment('MMM D, YYYY h:ma') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileListItem',
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteFile() {
      this.$emit('deleteFile')
    },
    downloadFile() {
      const link = document.createElement('a')
      link.href = this.file.download
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  },
}
</script>

<style></style>
