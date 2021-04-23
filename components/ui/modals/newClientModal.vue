<template>
  <Modal
    ref="newClientModal"
    title="New Client"
    :subheading="subtitle"
    :icon="require('@/assets/svg/other/user.svg')"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <form @submit.prevent="postClient" class="mt-4 space-y-4">
      <fieldset class="space-y-2">
        <label for="client-company">Client</label>
        <select
          name="client-company"
          id="client-company"
          class="select"
          @change="updateContact"
          v-model="value.client_id"
          :tabindex="tabIndex"
          ref="clientCompanySelect"
        >
          <option :value="null">Select a Company...</option>
          <option
            :value="company.id"
            v-for="company in $store.state.team.cwCompanies"
            :key="company.id"
          >
            {{ company.name }}
          </option>
        </select>
      </fieldset>
      <fieldset class="space-y-2">
        <label for="client-contact-name" class="block">Contact Name</label>
        <input
          type="text"
          placeholder="Jane Doe"
          v-model="value.contact_name"
          :tabindex="tabIndex"
        />
      </fieldset>
      <fieldset>
        <label for="client-contact-email" class="block">Contact Email</label>
        <input
          type="email"
          placeholder="jane.doe@email.com"
          v-model="value.contact_email"
          :tabindex="tabIndex"
        />
      </fieldset>
      <fieldset class="space-y-2">
        <label for="client-contact-phone" class="block">Contact Phone</label>
        <input
          type="tel"
          placeholder="(123) 456-7890"
          v-model="value.contact_phone"
          :tabindex="tabIndex"
        />
      </fieldset>
      <fieldset
        class="flex items-center space-x-2 p-2 border bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-600 rounded"
      >
        <input
          type="checkbox"
          name="client-primary"
          id="client-primary"
          class="rounded-full dark:bg-gray-400"
          v-model="value.primary"
          :tabindex="tabIndex"
        />
        <label for="client-primary">Primary?</label>
      </fieldset>
      <div class="flex items-center space-x-2">
        <ActionButton
          theme="hollow"
          type="button"
          @click="reset"
          :tabindex="tabIndex"
        >
          <inline-svg
            :src="require('@/assets/svg/arrows/sync.svg')"
            class="h-6 w-6 text-gray-800 dark:text-white"
          />
        </ActionButton>
        <ActionButton
          theme="primary"
          class="w-full"
          type="submit"
          :tabindex="tabIndex"
          >Add Client</ActionButton
        >
      </div>
    </form>
    <div
      class="absolute inset-0 z-50 flex items-center justify-center bg-opacity-25 bg-gray-400"
      v-if="isLoading"
    >
      <Loading size="xl" />
    </div>
  </Modal>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import Loading from '@/components/common/loading'
import Modal from '@/components/ui/modal'
export default {
  name: 'NewClientModal',
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  props: {
    projectID: {
      type: Number,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      tabIndex: -1,
    }
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        setTimeout(() => {
          this.$refs.clientCompanySelect.focus()
        }, 25)
      }
    },
    value() {
      this.$emit('input', this.value)
    },
  },
  methods: {
    close() {
      this.$refs.newClientModal.close()
    },
    open() {
      this.$refs.newClientModal.open()
    },
    async postClient() {
      this.isLoading = true
      if (!this.validate()) {
        this.isLoading = false
        return
      }
      let client = await this.$store.dispatch('api/post', {
        url: `/projects/${this.projectID}/clients/`,
        data: {
          ...this.value,
          project: this.projectID,
        },
      })
      this.isLoading = false
      this.$emit('addClient', client)
      this.close()
      this.reset()
    },
    updateContact() {
      this.value.client_name = ''
      if (this.value.client_id) {
        const company = this.$store.state.team.cwCompanies.find(
          (company) => company.id == this.value.client_id
        )
        this.value.client_name = company.name
        this.value.contact_name = ''
        this.value.contact_email = ''
        this.value.contact_phone = company.phone

        if (company.contact) {
          this.value.contact_name = company.contact.name
        }
      }
    },
    validate() {
      const error_fields = []
      const email_regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      const phone_regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      if (!this.value.client_id) {
        error_fields.push('Client')
      }
      if (
        this.value.contact_phone &&
        !phone_regex.test(this.value.contact_phone)
      ) {
        error_fields.push('Phone')
      }
      if (
        this.value.contact_email &&
        !email_regex.test(this.value.contact_email)
      ) {
        error_fields.push('Email')
      }

      if (error_fields.length) {
        console.log(error_fields)
        let toast_messsage = 'Please correct the following fields: '
        error_fields.forEach((error) => (toast_messsage += `${error}, `))
        toast_messsage = toast_messsage.slice(0, -2)
        this.$root.$emit('showToast', {
          text: toast_messsage,
          type: 'error',
        })
        return false
      }

      if (this.value.contact_phone) {
        this.value.contact_phone = this.value.contact_phone
          .match(/\d+/g)
          .join('')
      }
      return true
    },
    reset() {
      this.value.client_id = null
      this.value.client_name = ''
      this.value.contact_email = ''
      this.value.contact_name = ''
      this.value.contact_phone = ''
      this.value.primary = false
    },
  },
}
</script>
