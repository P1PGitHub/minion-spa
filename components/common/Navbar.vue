<template>
  <nav
    class="flex justify-between items-center w-full p-4 text-gray-800 fixed top-0 left-0 right-0 z-20 bg-white"
    id="navbar"
  >
    <div class="flex items-center space-x-4">
      <nuxt-link class="text-2xl font-bold" to="/" id="brand">Minion</nuxt-link>
      <img
        src="@/assets/svg/other/spinner-two-theme.svg"
        alt="Loading Icon"
        class="animate-spin"
        v-if="$store.state.isLoading"
      />
    </div>

    <ul class="hidden md:flex items-center space-x-4 text-lg">
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
      >
        <span>
          <img
            src="@/assets/svg/other/today.svg"
            alt="today icon"
            class="w-5 h-5"
          />
        </span>
        <span>Today</span>
      </li>
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
      >
        <span>
          <img
            src="@/assets/svg/content/clipboard.svg"
            alt="today icon"
            class="w-5 h-5"
          />
        </span>
        <span>Projects</span>
      </li>
      <nuxt-link
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
        :to="{ name: 'reports-csqr' }"
      >
        <span>
          <img
            src="@/assets/svg/other/briefcase.svg"
            alt="today icon"
            class="w-5 h-5"
          />
        </span>
        <span>CSQR</span>
      </nuxt-link>
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
      >
        <span>
          <img
            src="@/assets/svg/other/user-list.svg"
            alt="team icon"
            class="w-5 h-5"
          />
        </span>
        <span>Team</span>
      </li>
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
      >
        <span>
          <img
            src="@/assets/svg/other/options.svg"
            alt="options icon"
            class="w-5 h-5"
          />
        </span>
      </li>
      <li
        class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
      >
        <span class="relative">
          <img
            src="@/assets/svg/other/notifications.svg"
            alt="notifications icon"
            class="w-5 h-5"
          />
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
      class="md:hidden p-1 rounded bg-white transition-transform duration-300 ease-in-out focus:outline-none"
      :class="{ 'transform -translate-x-40': isOpen }"
      @click="toggle"
      id="sidebar-button"
    >
      <img src="@/assets/svg/other/menu-cake.svg" alt="menu open" />
    </button>
    <nav
      class="md:hidden fixed top-0 right-0 bottom-0 overflow-y-scroll bg-white p-4 transition-transform duration-300 ease-in-out z-30 shadow-lg"
      :class="{ 'transform translate-x-40': !isOpen }"
      id="sidebar"
    >
      <ul class="space-y-4 text-xl">
        <li
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
        >
          <span>
            <img src="@/assets/svg/other/today.svg" alt="today icon" />
          </span>
          <span>Today</span>
        </li>
        <li
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
        >
          <span>
            <img src="@/assets/svg/content/clipboard.svg" alt="today icon" />
          </span>
          <span>Projects</span>
        </li>
        <nuxt-link
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
          :to="{ name: 'reports-csqr' }"
        >
          <span>
            <img src="@/assets/svg/other/briefcase.svg" alt="today icon" />
          </span>
          <span>CSQR</span>
        </nuxt-link>
        <li
          class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
        >
          <span>
            <img src="@/assets/svg/other/user-list.svg" alt="team icon" />
          </span>
          <span>Team</span>
        </li>
        <div class="flex items-center">
          <li
            class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
          >
            <span>
              <img src="@/assets/svg/other/options.svg" alt="options icon" />
            </span>
          </li>
          <li
            class="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-300"
          >
            <span class="relative">
              <img
                src="@/assets/svg/other/notifications.svg"
                alt="notifications icon"
                class="w-5 h-5"
              />
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
export default {
  name: 'Navbar',
  data() {
    return {
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
