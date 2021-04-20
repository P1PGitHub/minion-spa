<template>
  <div>
    <div
      class="transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 fixed z-30"
    >
      <transition
        enter-active-class="transition transform duration-200 ease-in-out"
        leave-active-class="transition transform duration-200 ease-in-out"
        enter-class="opacity-0 scale-75"
        enter-to-class="opacity-100 scale-100"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-75"
      >
        <div
          class="p-4 bg-white w-80 md:w-96 border-2 border-blue-400 dark:bg-gray-800 text-gray-800 dark:text-white rounded relative shadow-lg"
          v-show="isOpen"
        >
          <div class="flex items-center space-x-2">
            <inline-svg :src="icon" class="h-8 w-8" v-if="icon" />
            <h1 class="text-xl font-semibold">{{ title }}</h1>
          </div>
          <h4
            class="text-gray-600 dark:text-gray-300 md:text-lg ml-10"
            v-if="subheading"
          >
            {{ subheading }}
          </h4>

          <slot></slot>

          <button
            class="bg-red-200 border border-red-400 text-red-700 hover:bg-red-400 transition-colors duration-200 p-1 rounded absolute top-0 right-0 -mt-4 -mr-4 text-3xl font-bold h-8 w-8 flex items-center justify-center"
            @click="close"
          >
            <span class="leading-none">&times;</span>
          </button>
        </div>
      </transition>
    </div>

    <transition
      enter-active-class="transition transform duration-200 ease-in-out"
      leave-active-class="transition transform duration-200 ease-in-out"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed block inset-0 w-full h-full bg-gray-700 bg-opacity-25 z-20"
        v-show="isOpen"
        @click="close"
      ></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
    subheading: {
      type: String,
      required: false,
      default: () => '',
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    close() {
      this.isOpen = false
      document.body.style.overflow = 'auto'
      this.$emit('close')
    },
    open() {
      this.isOpen = true
      document.body.style.overflow = 'hidden'
      this.$emit('open')
    },
    toggle() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$root.$emit('lockScroll')
      } else {
        this.$root.$emit('unlockScroll')
      }
    },
  },
  mounted() {
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Esc' || event.key === 'Escape') {
        if (this.isOpen) {
          this.close()
        }
      }
    })
  },
}
</script>
