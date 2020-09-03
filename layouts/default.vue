<template>
  <div
    class="min-h-screen bg-gray-100"
    :class="{ 'overflow-y-hidden': scrollLock }"
  >
    <Navbar />
    <Modal />
    <Toast />
    <PageLoading />
    <Nuxt class="pt-22" />
  </div>
</template>

<script>
import Modal from '@/components/ui/modal'
import PageLoading from '@/components/ui/pageLoading'
import Toast from '@/components/ui/toast'
export default {
  name: 'DefualtLayout',
  components: {
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
