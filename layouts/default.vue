<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar @compact="toggleCompactNav" />
    <JournalEntryModal />
    <Modal />
    <Toast />
    <PageLoading />
    <Nuxt
      :class="{
        'overflow-y-hidden': scrollLock,
        'pt-16': compactNav,
        'pt-22': !compactNav,
      }"
    />
  </div>
</template>

<script>
import JournalEntryModal from '@/components/ui/journalEntryModal'
import Modal from '@/components/ui/modal'
import Navbar from "@/components/common/Navbar"
import PageLoading from '@/components/ui/pageLoading'
import Toast from '@/components/ui/toast'
export default {
  name: 'DefaultLayout',
  components: {
    JournalEntryModal,
    Modal,
    Navbar,
    PageLoading,
    Toast,
  },
  data() {
    return {
      compactNav: false,
      scrollLock: false,
    }
  },
  methods: {
    toggleCompactNav() {
      this.compactNav = !this.compactNav
    },
  },
  created() {
    this.$root.$on('showModal', () => {
      this.scrollLock = true
    })
    this.$root.$on('modalClose', () => {
      this.scrollLock = false
    })
    this.$root.$on('lockScoll', () => {
      this.scrollLock = true
    })
    this.$root.$on('unlockScroll', () => {
      this.scrollLock = false
    })
  },
}
</script>

<style>
html {
  background-color: #edf2f7;
}

html.dark {
  background-color: #1a202c;
}
</style>
