<template>
  <PageBody>
    <template v-slot:page-header>
      <SectionHeader text="Settings" />
      <select
        name="settings-page"
        id="settings-page"
        class="form-select bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        @change="onSelectChange"
        v-model="selectedPage"
      >
        <option value="application">Application</option>
        <option value="account">Account</option>
      </select>
    </template>
    <template v-slot:page-content>Application Settings</template>
  </PageBody>
</template>

<script>
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
export default {
  name: 'ApplicationSettings',
  components: {
    PageBody,
    SectionHeader,
  },
  data() {
    return {
      selectedPage: 'account',
    }
  },
  methods: {
    onSelectChange() {
      if (this.selectedPage !== 'application') {
        this.$router.push({ name: `settings-${this.selectedPage}` })
      } else {
        this.$router.push({ name: 'settings' })
      }
    },
  },
}
</script>
