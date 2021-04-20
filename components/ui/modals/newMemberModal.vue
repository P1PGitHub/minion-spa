<template>
  <Modal
    title="Add Team Member"
    :subheading="subtitle"
    :icon="require('@/assets/svg/other/user.svg')"
    ref="modal"
    @close="tabIndex = -1"
    @open="tabIndex = 0"
  >
    <form @submit.prevent="postMember" class="space-y-4">
      <fieldset class="space-y-2">
        <label for="member-account" class="block">Account</label>
        <select
          name="member-account"
          id="member-account"
          class="select"
          v-model="value.account"
          :tabindex="tabIndex"
          ref="memberAccount"
        >
          <option :value="null">Select an account...</option>
          <option
            :value="member.id"
            v-for="member in validMembers"
            :key="member.id"
          >
            {{ member.last_name }}, {{ member.first_name }}
          </option>
        </select>
      </fieldset>
      <fieldset class="space-y-2">
        <label for="member-message" class="block">Message</label>
        <textarea
          name="member-message"
          id="member-message"
          class="h-32 w-full"
          placeholder="Welcome to this project!"
          v-model="value.message"
          :tabindex="tabIndex"
        ></textarea>
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
          >Add Member</ActionButton
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
  name: 'NewMemberModal',
  components: {
    ActionButton,
    Loading,
    Modal,
  },
  props: {
    currentMembers: { type: Array, required: true },
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
  computed: {
    validMembers() {
      return this.$store.state.team.members.filter((account) => {
        let index = this.currentMembers.findIndex(
          (member) => member.account.id === account.id
        )
        return index === -1
      })
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
          this.$refs.memberAccount.focus()
        }, 25)
      }
    },
  },
  methods: {
    close() {
      this.$refs.modal.close()
    },
    open() {
      this.$refs.modal.open()
    },
    async postMember() {
      if (this.isLoading || !this.validate()) {
        return
      }
      this.isLoading = true
      const newMember = await this.$store.dispatch('api/post', {
        url: `/projects/${this.projectID}/members/`,
        data: {
          account: this.value.account,
          project: this.projectID,
          message: this.value.message,
        },
      })
      let account = this.$store.state.team.members.find(
        (member) => member.id === newMember.account
      )
      this.isLoading = false
      this.$emit('addMember', {
        ...newMember,
        account: {
          id: account.id,
          first_name: account.first_name,
          last_name: account.last_name,
        },
      })
      this.close()
      this.reset()
    },
    reset() {
      this.value.account = null
      this.value.message = ''
    },
    validate() {
      return this.value.account !== null
    },
  },
}
</script>

<style></style>
