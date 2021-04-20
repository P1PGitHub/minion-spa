<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar />
    <NotificationSlideOver />
    <JournalEntryModal />
    <ModalConfirm />
    <Toast />
    <PageLoading />
    <Nuxt class="pt-18" />
  </div>
</template>

<script>
import JournalEntryModal from '@/components/ui/modals/journalEntryModal'
import ModalConfirm from '@/components/ui/modalConfirm'
import Navbar from '@/components/common/Navbar'
import NotificationSlideOver from '@/components/ui/notificationSlideOver'
import PageLoading from '@/components/ui/pageLoading'
import Toast from '@/components/ui/toast'
export default {
  name: 'DefaultLayout',
  components: {
    JournalEntryModal,
    ModalConfirm,
    Navbar,
    NotificationSlideOver,
    PageLoading,
    Toast,
  },
  data() {
    return {
      compactNav: false,
    }
  },
}
</script>

<style lang="postcss">
html {
  background-color: #edf2f7;
}

html.dark {
  background-color: #1a202c;
}

input[type='text'],
input[type='password'],
input[type='email'],
input[type='tel'] {
  @apply form-input rounded p-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600;
}

input[type='checkbox'] {
  @apply form-checkbox rounded-full h-6 w-6 bg-gray-200 border-gray-600;
}

textarea {
  @apply form-textarea rounded p-2 w-full bg-gray-100 dark:bg-gray-700 border border-gray-600 dark:text-white;
}

.select {
  @apply form-select appearance-none rounded p-2 w-full bg-gray-100 dark:bg-gray-700 border border-gray-600 dark:text-white;
}

.multiselect {
  @apply form-multiselect p-2 appearance-none rounded w-full bg-gray-100 dark:bg-gray-700 border border-gray-600 dark:text-white;
}
</style>
