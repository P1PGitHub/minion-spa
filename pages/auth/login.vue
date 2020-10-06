<template>
  <div>
    <div
      class="flex items-center justify-start min-h-screen overflow-y-scroll p-4 bg-right-bottom bg-blue-700"
      id="login-page"
    >
      <div
        class="fixed top-0 bottom-0 left-0 flex flex-col justify-center p-4 w-5/6 sm:w-1/2 md:w-1/3 bg-white shadow-lg border-r border-gray-300 z-20"
      >
        <div class="space-y-4">
          <div class="flex items-center space-x-4 w-full">
            <img
              src="@/static/png/logo.png"
              alt="Minion Logo"
              class="w-8 h-8 md:w-10 md:h-10"
            />
            <h1
              class="text-2xl md:text-4xl text-blue-700 font-bold tracking-wide"
            >
              Log in
            </h1>
            <loading v-if="isLoading" />
          </div>

          <div
            class="rounded px-2 py-4 bg-gray-200 text-red-700 font-bold flex items-center space-x-4 border border-red-400"
            v-if="error"
          >
            <img src="@/assets/svg/alerts/danger.svg" alt="Error Icon" />
            <p>Bee Do Bee Do Bee Do</p>
          </div>
          <form @submit.prevent class="space-y-4" @submit="login">
            <div class="space-y-2">
              <h3 class="text-gray-700">Email Address</h3>
              <div class="relative">
                <input
                  type="text"
                  placeholder="jane.doe@hello.com"
                  class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
                  v-model="user.email"
                />
                <div
                  class="absolute top-0 bottom-0 left-0 ml-3 flex items-center"
                >
                  <img src="@/assets/svg/other/mail.svg" alt="Email Icon" />
                </div>
              </div>
              <h3 class="text-gray-700">Password</h3>
              <div class="relative">
                <input
                  type="password"
                  placeholder="super-secure-password"
                  class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
                  v-model="user.password"
                />
                <div
                  class="absolute top-0 bottom-0 left-0 ml-3 flex items-center"
                >
                  <img
                    src="@/assets/svg/other/keyhole.svg"
                    alt="Password Icon"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              class="w-full bg-blue-600 text-white font-bold py-2 rounded mt-4"
              :disabled="isLoading"
            >
              Login
            </button>
            <div class="w-full flex items-center justify-between text-gray-700">
              <a href="#" class="inline-block w-2/5 px-2 underline"
                >Forgot Password?</a
              >
              <span class="tracking-widest">&#183;&#183;&#183;</span>
              <nuxt-link
                :to="{ name: 'auth-signup' }"
                class="inline-block w-2/5 text-right px-2 underline"
                >Sign Up</nuxt-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from '@/components/common/Loading'
import moment from 'moment'
export default {
  name: 'LoginPage',
  layout: 'auth',
  head: {
    title: 'Minion Login',
  },
  compponents: {
    loading,
  },
  data() {
    return {
      error: false,
      isLoading: false,
      user: {
        email: null,
        password: null,
      },
    }
  },
  methods: {
    async login() {
      this.error = false
      if (this.user.email && this.user.password) {
        this.isLoading = true
        this.$store.commit('startLoading')
        let tokens = await this.$store.dispatch('api/login', {
          email: this.user.email.toLowerCase().trim(),
          password: this.user.password,
        })
        let account = await this.$store.dispatch('api/getAccount')
        let team = await this.$store.dispatch('api/getTeam')
        this.$store.commit('account/setAccount', account)
        this.$store.commit('team/setTeam', team)
        Promise.all([
          this.$store.dispatch('team/getMembers'),
          this.$store.dispatch('team/getCompanies'),
        ]).then(() => {
          this.$store.commit('stopLoading')
          this.$root.$emit('showToast', {
            text: 'Connectwise resources have been loaded.',
            type: 'success',
          })
        })

        if (tokens && account) {
          this.error = false
          this.$router.push('/')
        } else {
          this.error = true
          this.isLoading = false
          console.log('failed login')
        }
        this.isLoading = false
      } else {
        console.log('no credentials')
      }
    },
  },
}
</script>

<style scoped>
#login-page {
  background-image: url('~assets/svg/other/banana-bg.svg');
  background-repeat: repeat;
}
</style>
