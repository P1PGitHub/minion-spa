<template>
  <div
    class="fixed top-0 z-30 max-w-128 bg-white border-2 border-teal-300 rounded shadow-lg mt-4 mx-4 p-4 space-y-4 transform duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
    :class="{ '-translate-y-96': !show }"
  >
    <div class="flex items-center space-x-4">
      <div class="p-1 rounded-full bg-teal-300">
        <inline-svg
          :src="require('@/assets/svg/alerts/bolt.svg')"
          fill="fill-current"
          class="h-6 w-auto text-gray-800"
        ></inline-svg>
      </div>
      <h1 class="text-xl font-bold">Bello</h1>
    </div>
    <div>
      <p>{{ options.message }}</p>
    </div>
    <div class="flex items-center justify-center space-x-4">
      <ActionButton
        spacing="sm"
        theme="secondary"
        @click="deny"
        :tabindex="tabIndex"
        ref="denyButton"
      >
        <span class="font-normal">
          {{ options.denyText }}
        </span></ActionButton
      >
      <ActionButton
        spacing="sm"
        @click="allow"
        :tabindex="tabIndex"
        ref="allowButton"
      >
        <span class="font-normal">
          {{ options.allowText }}
        </span>
      </ActionButton>
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
export default {
  name: 'ModalConfirm',
  components: {
    ActionButton,
  },
  data() {
    return {
      options: {
        allowText: 'Yes',
        denyText: 'No',
        message: 'Are you sure you want to do this?',
      },
      show: false,
      tabIndex: -1,
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.denyButton.$el.focus()
        }, 25)
      }
    },
  },
  methods: {
    allow() {
      this.show = false
      this.tabIndex = -1
      this.$root.$emit('modalClose', true)
    },
    deny() {
      this.show = false
      this.tabIndex = -1
      this.$root.$emit('modalClose', false)
    },
  },
  created() {
    this.$root.$on('showModal', (options) => {
      if (options) {
        this.options = options
      } else {
        this.options = {
          allowText: 'Yes',
          denyText: 'No',
          message: 'Are you sure you want to do this?',
        }
      }
      this.show = true
      this.tabIndex = 0
    })
  },
}
</script>
