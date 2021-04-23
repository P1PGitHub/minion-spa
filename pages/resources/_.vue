<template>
  <PageBody>
    <template v-slot:page-header>
      <div
        class="md:flex items-center justify-between w-full space-y-2 md:space-y-0"
      >
        <SectionHeader text="Files & Resources" bold size="lg" />
        <div class="flex items-center space-x-4">
          <ActionButton
            theme="hollow"
            spacing="sm"
            @click="
              $router.push({
                path: '/resources/',
              })
            "
            v-if="parentFolders.length"
          >
            <inline-svg
              :src="require('@/assets/svg/buttons/home.svg')"
              class="h-6 w-6"
            />
          </ActionButton>
          <ActionButton
            theme="danger"
            spacing="sm"
            v-if="parentFolders.length"
            @click="deleteFolder(baseRef.location.path)"
          >
            <inline-svg
              :src="require('@/assets/svg/file/folder-remove.svg')"
              class="h-6 w-6"
            />
          </ActionButton>
          <div class="relative">
            <ActionButton spacing="sm" theme="hollow" @click="toggleFolderForm">
              <inline-svg
                :src="require('@/assets/svg/file/folder-add.svg')"
                class="h-6 w-6"
              />
            </ActionButton>
            <transition
              enter-active-class="transition transform duration-200 ease-in-out"
              leave-active-class="transition transform duration-200 ease-in-out"
              enter-class="opacity-0 scale-75"
              enter-to-class="opacity-100 scale-100"
              leave-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-75"
            >
              <div
                class="absolute top-0 left-0 md:left-auto md:right-0 z-20 w-64 bg-white dark:bg-gray-800 border-2 border-blue-500 shadow p-4 rounded mt-10"
                v-show="openFolderForm"
              >
                <form @submit.prevent="uploadBlankFile" class="space-y-2">
                  <label
                    class="block text-lg font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap"
                    for="folder-name"
                  >
                    New Folder
                  </label>
                  <input
                    type="text"
                    class="w-64"
                    name="folder-name"
                    id="folder-name"
                    placeholder="Folder Name"
                    v-model="newFolder"
                    ref="newFolderInput"
                    :tabindex="openFolderForm ? 0 : -1"
                  />
                  <div class="flex items-center justify-between">
                    <ActionButton theme="hollow" spacing="sm" type="reset">
                      <inline-svg
                        :src="require('@/assets/svg/arrows/sync.svg')"
                        class="h-6 w-6"
                      />
                    </ActionButton>
                    <ActionButton spacing="sm" type="submit">
                      <inline-svg
                        :src="require('@/assets/svg/file/folder-add.svg')"
                        class="h-6 w-6"
                      />
                      <span>Create</span>
                    </ActionButton>
                  </div>
                </form>
              </div>
            </transition>
            <div
              class="fixed inset-0 z-10"
              @click="toggleFolderForm"
              v-if="openFolderForm"
            ></div>
          </div>

          <ActionButton spacing="sm" @click="openFileUploadModal">
            <inline-svg
              :src="require('@/assets/svg/file/upload.svg')"
              class="h-6 w-6"
            />
            <span>Upload</span>
          </ActionButton>
        </div>
      </div>
    </template>
    <template v-slot:page-content>
      <div
        class="px-4 py-2 bg-white dark:bg-gray-700 shadow rounded text-xl text-gray-600 dark:text-gray-200 flex items-center"
        v-if="$route.params.pathMatch"
      >
        <nuxt-link
          class="p-1 flex items-center mr-2 text-gray-400 dark:text-white hover:text-blue-600"
          :to="{
            path: `/resources/${parentFolders
              .slice(0, parentFolders.length - 1)
              .join('/')}`,
          }"
        >
          <inline-svg
            :src="require('@/assets/svg/arrows/arrow-left.svg')"
            class="h-6 w-6"
          />
        </nuxt-link>
        <span class="text-gray-400 mr-2">/</span>
        <p v-for="(folder, index) in parentFolders" :key="index">
          <nuxt-link
            v-if="index + 1 !== parentFolders.length"
            :to="{
              path: `/resources/${parentFolders.slice(0, index + 1).join('/')}`,
            }"
            class="hover:underline ml-1"
            >{{ folder }}</nuxt-link
          >
          <span class="mt-2 dark:text-white ml-2" v-else>{{ folder }} </span>
          <span class="ml-1 text-gray-400">/</span>
        </p>
      </div>
      <div
        class="px-4 py-2 bg-white dark:bg-gray-700 shadow rounded text-xl font-bold tracking-wide text-blue-600 dark:text-blue-400 flex items-center space-x-4"
      >
        <h3>Folders</h3>
        <Loading v-if="loadingFolders" />
      </div>
      <section class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <nuxt-link
          v-for="folder in folders"
          :key="folder.name"
          class="px-4 py-2 w-full group transition-colors duration-150 cursor-pointer flex md:flex-row items-center md:items-stretch space-x-4 md:space-x-8 rounded shadow bg-white dark:bg-gray-700 border-2 border-white dark:border-gray-700 hover:border-blue-500 text-gray-700 dark:text-white"
          :to="{
            path: $route.path + (parentFolders.length ? '/' : '') + folder.name,
          }"
        >
          <inline-svg
            :src="require('@/assets/svg/file/folder-solid.svg')"
            class="h-6 w-6 md:h-12 md:w-12 text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
          />
          <h3 class="text-xl font-bold tracking-wide py-2 truncate">
            {{ folder.name }}
          </h3>
        </nuxt-link>
        <div
          class="md:col-span-4 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded px-4 py-2 space-y-2"
          v-if="folders.length === 0 && !loadingFolders"
        >
          No folders to show here.
        </div>
      </section>
      <div
        class="px-4 py-2 bg-white dark:bg-gray-700 shadow rounded text-xl font-bold tracking-wide text-blue-600 dark:text-blue-400 flex items-center space-x-4"
      >
        <h3>Files</h3>
        <Loading v-if="loadingFiles" />
      </div>
      <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          v-for="(file, index) in files"
          :key="file.name"
          class="px-4 py-2 flex items-start w-full group transition-colors duration-150 cursor-pointer rounded shadow bg-white dark:bg-gray-700 border-2 border-white dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-white"
        >
          <a
            :href="file.download"
            download
            target="_blank"
            class="w-full h-full space-y-2"
          >
            <div class="flex items-center space-x-4">
              <inline-svg
                :src="require('@/assets/svg/file/image.svg')"
                class="h-8 w-8 md:h-12 md:w-12 text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
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
                class="h-8 w-8 md:h-12 md:w-12 text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
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
                class="h-8 w-8 md:h-12 md:w-12 text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
                v-else-if="file.name.split('.')[-1] === 'bak'"
              />
              <inline-svg
                :src="require('@/assets/svg/file/file.svg')"
                class="h-8 w-8 md:w-12 md:h-12 text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
                v-else
              />
              <div class="h-full w-full space-y-2 flex flex-col items-between">
                <h3 class="font-bold tracking-wide overflow-x-hidden">
                  {{ file.name }}
                </h3>
              </div>
            </div>
            <div class="flex items-center justify-between w-full text-gray-400">
              <p v-if="file.meta.size < 1000000" class="font-semibold">
                {{ (file.meta.size / 1000).toFixed(2) }} KB
              </p>
              <p v-else-if="file.meta.size < 1000000000" class="font-semibold">
                {{ (file.meta.size / 1000000).toFixed(2) }} MB
              </p>
              <p v-else class="font-semibold">
                {{ (file.meta.size / 1000000000).toFixed(2) }} GB
              </p>
              <p class="text-gray-400 leading-none text-sm">
                {{ file.meta.updated | moment('MMM D, YYYY h:ma') }}
              </p>
            </div>
          </a>
          <div
            class="pl-2 pt-1 md:pt-3 flex flex-col text-gray-200 dark:text-gray-600 h-full justify-between"
          >
            <button
              class="group-hover:text-blue-600"
              @click="openFileInfoModal(index)"
            >
              <inline-svg
                :src="require('@/assets/svg/buttons/info.svg')"
                class="h-6 w-6"
              />
            </button>
            <button class="group-hover:text-red-600" @click="deleteFile(index)">
              <inline-svg
                :src="require('@/assets/svg/content/trash.svg')"
                class="h-6 w-6"
              />
            </button>
          </div>
        </div>
        <div
          class="md:col-span-3 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded px-4 py-2 space-y-2"
          v-if="files.length === 0 && !loadingFiles"
        >
          No files to show here.
        </div>
      </section>
    </template>
    <template v-slot:modals>
      <FileInfoModal ref="fileInfoModal" @deleteFile="getFiles()" />
      <FileUploadModal
        :baseRef="baseRef"
        ref="fileUploadModal"
        @updateFiles="getFiles"
      />
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import FileInfoModal from '@/components/ui/modals/fileInfoModal'
import FileUploadModal from '@/components/ui/modals/fileUploadModal'
import Loading from '@/components/common/loading'
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
export default {
  name: 'Resources',
  components: {
    ActionButton,
    FileInfoModal,
    FileUploadModal,
    Loading,
    PageBody,
    SectionHeader,
  },
  middleware: ['auth'],
  data() {
    return {
      files: [],
      folders: [],
      loadingFiles: false,
      loadingFolders: false,
      newFolder: null,
      openFolderForm: false,
      parentFolders: this.$route.params.pathMatch
        ? this.$route.params.pathMatch.split('/')
        : [],
      baseRef: this.$fireStorage
        .ref()
        .child(
          `${this.$store.state.team.team.slug}/resources/${
            this.$route.params ? this.$route.params.pathMatch + '/' : ''
          }`
        ),
    }
  },
  methods: {
    deleteFile(index) {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: `Are you sure you want to delete file '${this.files[index].name}'? This cannot be undone.`,
      })
      this.$root.$once('modalClose', async (choice) => {
        if (!choice) {
          return
        }
        await this.baseRef.child(this.files[index].name).delete()
        this.getFiles()
      })
    },
    deleteFolder(folderPath) {
      this.$root.$emit('showModal', {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to delete this folder?',
      })
      this.$root.$once('modalClose', (choice) =>
        choice ? this.deleteFolderContents(folderPath, true) : ''
      )
    },
    async deleteFolderContents(folderPath, root) {
      if (root) {
        this.$root.$emit('showLoading')
      }
      const ref = this.$fireStorage.ref().child(folderPath)
      const { items, prefixes } = await ref.listAll()
      for (let item of items) {
        await this.$fireStorage.ref().child(item.location.path).delete()
      }
      for (let prefix of prefixes) {
        await this.deleteFolderContents(prefix.location.path, false)
      }

      if (root) {
        setTimeout(() => {
          this.$root.$emit('hideLoading')
          this.$router.push({
            path: `/resources/${this.parentFolders
              .slice(0, this.parentFolders.length - 1)
              .join('/')}`,
          })
        }, 1000)
      } else {
        return
      }
    },
    async getFiles() {
      this.loadingFiles = true
      this.loadingFolders = true
      this.files = []
      this.folders = []
      let fileRefs = await this.baseRef.listAll()
      for (const folder of fileRefs.prefixes) {
        let { items, prefixes } = await folder.listAll()
        let showFolder = Boolean(items.length) || Boolean(prefixes.length)
        if (showFolder) {
          this.folders.push({ name: folder.name, fullPath: folder.fullPath })
        }
      }
      this.loadingFolders = false
      for (const ref of fileRefs.items) {
        if (ref.name === '_blank') {
          continue
        }
        this.files.push({
          name: ref.name,
          meta: await ref.getMetadata(),
          download: await ref.getDownloadURL(),
        })
      }
      this.loadingFiles = false
    },
    toggleFolderForm() {
      this.openFolderForm = !this.openFolderForm
      if (this.openFolderForm) {
        setTimeout(() => this.$refs.newFolderInput.focus(), 125)
      }
    },
    async uploadBlankFile() {
      const newRef = this.baseRef.child(`${this.newFolder}/_blank`)
      await newRef.putString('')
      this.getFiles()
      this.openFolderForm = false
      this.newFolder = ''
    },
    openFileInfoModal(index) {
      this.$refs.fileInfoModal.open(this.files[index])
    },
    openFileUploadModal() {
      this.$refs.fileUploadModal.open()
    },
  },
  created() {
    this.getFiles()
  },
}
</script>

<style></style>
