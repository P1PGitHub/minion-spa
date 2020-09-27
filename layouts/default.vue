<template>
  <div
    class="min-h-screen bg-gray-100"
    :class="{ 'overflow-y-hidden': scrollLock }"
  >
    <Navbar />
    <JournalEntryModal />
    <Modal />
    <Toast />
    <PageLoading />
    <Nuxt class="pt-22" />
  </div>
</template>

<script>
import JournalEntryModal from '@/components/ui/journalEntryModal'
import Modal from '@/components/ui/modal'
import PageLoading from '@/components/ui/pageLoading'
import Toast from '@/components/ui/toast'
export default {
  name: 'DefaultLayout',
  components: {
    JournalEntryModal,
    Modal,
    PageLoading,
    Toast,
  },
  data() {
    return {
      scrollLock: false,
    }
  },
  created() {
    this.$root.$on('showModal', () => {
      this.scrollLock = true
    }),
      this.$root.$on('modalClose', () => {
        this.scrollLock = false
      })
  },
}
</script>
