<template>
  <nav
    class="flex justify-between items-center w-full p-4 text-gray-800 fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 dark:text-white transition-all duration-300"
    :class="{ 'py-2': compact }"
    id="navbar"
  >
    <div class="flex items-center space-x-4">
      <nuxt-link
        class="font-bold flex items-center space-x-4 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
        :class="{ 'text-lg': compact, 'text-2xl': !compact }"
        to="/"
        id="brand"
      >
        <inline-svg
          :src="require('@/assets/svg/other/minion_logo.svg')"
          class="transition-all duration-300"
          :class="{ 'h-5 w-auto': compact, 'h-6 w-auto': !compact }"
          v-if="$colorMode.value !== 'dark'"
        ></inline-svg>
        <inline-svg
          :src="require('@/assets/svg/other/minion_logo_dark.svg')"
          class="h-6 w-6"
          v-else
        ></inline-svg>
        <span>Minion</span></nuxt-link
      >
      <Loading v-if="$store.state.isLoading" />
    </div>

    <ul class="hidden md:flex items-center space-x-4 text-lg">
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'journal' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/multimedia/album.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
        <span>Journal</span>
      </nuxt-link>
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/content/clipboard.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
        <span>Projects</span>
      </li>
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'reports-csqr' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/other/briefcase.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
        <span>CSQR</span>
      </nuxt-link>
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/other/user-list.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
      </li>
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        :to="{ name: 'settings' }"
      >
        <span>
          <inline-svg
            :src="require('@/assets/svg/other/options.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
        </span>
      </nuxt-link>
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <span class="relative">
          <inline-svg
            :src="require('@/assets/svg/other/notifications.svg')"
            fill="fill-current"
            class="h-6 w-6 text-gray-800 dark:text-white"
          ></inline-svg>
          <div class="w-2 h-2 bg-blue-500 rounded-full absolute top-0 right-0">
            <div
              class="w-full h-full bg-teal-300 rounded-full animate-ping"
            ></div>
          </div>
        </span>
      </li>
    </ul>
    <button
      type="button"
      class="md:hidden p-1 rounded bg-white transition-transform duration-300 ease-in-out dark:bg-gray-700 dark:bg-gray-800"
      :class="{ 'transform -translate-x-40': isOpen }"
      @click="toggle"
      id="sidebar-button"
    >
      <inline-svg
        :src="require('@/assets/svg/other/menu-cake.svg')"
        fill="fill-current"
        class="h-6 w-6 text-gray-800 dark:text-white"
      ></inline-svg>
    </button>
    <nav
      class="md:hidden fixed top-0 right-0 bottom-0 overflow-y-scroll bg-white p-4 transition-transform duration-300 ease-in-out z-30 shadow-lg dark:bg-gray-900"
      :class="{ 'transform translate-x-40': !isOpen }"
      id="sidebar"
    >
      <ul class="space-y-4 text-xl">
        <nuxt-link
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          :to="{ name: 'journal' }"
        >
          <span>
            <inline-svg
              :src="require('@/assets/svg/multimedia/album.svg')"
              fill="fill-current"
              class="h-6 w-6 text-gray-800 dark:text-white"
            ></inline-svg>
          </span>
          <span>Journal</span>
        </nuxt-link>
        <li
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <span>
            <inline-svg
              :src="require('@/assets/svg/content/clipboard.svg')"
              fill="fill-current"
              class="h-6 w-6 text-gray-800 dark:text-white"
            ></inline-svg>
          </span>
          <span>Projects</span>
        </li>
        <nuxt-link
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          :to="{ name: 'reports-csqr' }"
        >
          <span>
            <inline-svg
              :src="require('@/assets/svg/other/briefcase.svg')"
              fill="fill-current"
              class="h-6 w-6 text-gray-800 dark:text-white"
            ></inline-svg>
          </span>
          <span>CSQR</span>
        </nuxt-link>

        <div class="flex items-center">
          <li
            class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <span>
              <inline-svg
                :src="require('@/assets/svg/other/user-list.svg')"
                fill="fill-current"
                class="h-6 w-6 text-gray-800 dark:text-white"
              ></inline-svg>
            </span>
          </li>
          <nuxt-link
            class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            :to="{ name: 'settings' }"
          >
            <span>
              <inline-svg
                :src="require('@/assets/svg/other/options.svg')"
                fill="fill-current"
                class="h-6 w-6 text-gray-800 dark:text-white"
              ></inline-svg>
            </span>
          </nuxt-link>
          <li
            class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <span class="relative">
              <inline-svg
                :src="require('@/assets/svg/other/notifications.svg')"
                fill="fill-current"
                class="h-6 w-6 text-gray-800 dark:text-white"
              ></inline-svg>
              <div
                class="w-2 h-2 bg-blue-500 rounded-full absolute top-0 right-0"
              >
                <div
                  class="w-full h-full bg-teal-300 rounded-full animate-ping"
                ></div>
              </div>
            </span>
          </li>
        </div>
      </ul>
    </nav>
  </nav>
</template>

<script>
import Loading from '@/components/common/loading'
export default {
  name: 'Navbar',
  components: {
    Loading,
  },
  data() {
    return {
      compact: false,
      isOpen: false,
    }
  },
  watch: {
    $route: function () {
      this.isOpen = false
    },
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    },
  },
  created() {
    setTimeout(() => {
      this.compact = true
      this.$emit('compact')
    }, 5000)
  },
}
</script>

<style scoped>
#navbar {
  border-top: 2px solid #4299e1;
  border-bottom: 2px solid;
  border-image: linear-gradient(160deg, #4299e1 0%, #81e6d9 100%) 30;
}
#sidebar {
  border-left: 2px solid #81e6d9;
}
#sidebar-button {
  border: 2px solid #81e6d9;
}
</style>
