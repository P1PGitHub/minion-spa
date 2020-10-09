<template>
  <PageBody>
    <template v-slot:page-header>
      <SectionHeader size="lg" text="Settings" />
      <select
        name="settings-page"
        id="settings-page"
        class="form-select bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        @change="onSelectChange"
        v-model="selectedPage"
      >
        <option value="application" selected>Application</option>
        <option value="account">Account</option>
      </select>
    </template>
    <template v-slot:page-content>
      <SolidSection>
        <SectionHeader text="Asethetics" />
        <div class="space-y-2">
          <p>Dark Mode</p>
          <div class="flex items-center space-x-2">
            <button
              class="h-10 w-10 flex items-center justify-center border-2 rounded"
              :class="{
                'border-blue-300 bg-gray-300 dark:bg-gray-900':
                  $colorMode.preference == 'light',
              }"
              @click="updateDarkModePreference('light')"
            >
              <inline-svg
                :src="require('@/assets/svg/other/sun.svg')"
                fill="fill-current"
                class="h-6 w-auto text-gray-800 dark:text-white"
                :class="{
                  'text-blue-700': $colorMode.preference == 'light',
                }"
              ></inline-svg>
            </button>
            <button
              class="h-10 w-10 flex items-center justify-center border-2 rounded"
              :class="{
                'border-blue-700 dark:border-blue-300 bg-gray-300 dark:bg-gray-900':
                  $colorMode.preference == 'dark',
              }"
              @click="updateDarkModePreference('dark')"
            >
              <inline-svg
                :src="require('@/assets/svg/other/moon.svg')"
                fill="fill-current"
                class="h-6 w-auto text-gray-800 dark:text-white"
                :class="{
                  'text-blue-700': $colorMode.preference == 'dark',
                }"
              ></inline-svg></button
            ><button
              class="h-10 w-10 flex items-center justify-center border-2 rounded"
              :class="{
                'border-blue-700 dark:border-blue-300 bg-gray-300 dark:bg-gray-900':
                  $colorMode.preference == 'system',
              }"
              @click="updateDarkModePreference('system')"
            >
              <inline-svg
                :src="require('@/assets/svg/devices/screen.svg')"
                fill="fill-current"
                class="h-6 w-auto text-gray-800 dark:text-white"
                :class="{
                  'text-blue-700': $colorMode.preference == 'system',
                }"
              ></inline-svg>
            </button>
          </div>
        </div>
      </SolidSection>
      <SolidSection>
        <SectionHeader text="Actions" />
        <div class="w-full flex items-center space-x-2">
          <ActionButton spacing="sm" theme="hollow" @click="reloadCW"
            >Reload CW</ActionButton
          >
          <ActionButton spacing="sm" theme="hollow" @click="logout"
            >Log Out</ActionButton
          >
        </div>
      </SolidSection>
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'ApplicationSettings',
  middleware: ['auth'],
  components: {
    ActionButton,
    PageBody,
    SectionHeader,
    SolidSection,
  },
  data() {
    return {
      selectedPage: 'application',
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('account/logout')
      this.$router.push({ name: 'auth-login' })
    },
    onSelectChange() {
      this.$router.push({ name: `settings-${this.selectedPage}` })
    },
    async reloadCW() {
      this.$store.commit('startLoading')
      try {
        await this.$store.dispatch('team/getCompanies')
        this.$store.commit('stopLoading')
        this.$root.$emit('showToast', {
          text: 'Connectwise resources have been loaded.',
          type: 'success',
        })
      } catch (err) {
        this.$store.commit('stopLoading')
        this.$root.$emit('showToast', {
          text: 'Uh oh... Minion failed to load the CW resources.',
          type: 'error',
        })
      }
    },
    updateDarkModePreference(val) {
      this.$colorMode.preference = val
    },
  },
  created() {
    console.log(this.$colorMode.preference)
  },
}
</script>
