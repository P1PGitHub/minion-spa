<template>
  <div
    class="p-2 space-y-1"
    :class="{
      'border-b border-dashed border-gray-400': border,
    }"
  >
    <h3 class="text-lg text-blue-700 dark:text-blue-300">
      {{ formattedDate }}
    </h3>
    <div
      class="flex items-center space-x-2 font-bold text-gray-700 dark:text-gray-300"
    >
      <span>{{ formattedStart }}</span>
      <span>&bull;</span>
      <span>{{ formattedEnd }}</span>
    </div>
    <p>
      <span v-for="(user, index) in userNames" :key="index">
        <span>{{ user }}</span>
        <span v-if="index !== userNames.length - 1" class="px-1">&bull;</span>
      </span>
    </p>
    <p v-if="record.notes">{{ record.notes }}</p>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TimeRecordView',
  props: {
    border: {
      type: Boolean,
      required: false,
      default: true,
    },
    record: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formattedDate: null,
      formattedEnd: null,
      formattedStart: null,
      userNames: [],
    }
  },
  created() {
    this.formattedDate = moment(this.record.start).format('ddd MMM D, YYYY')
    this.formattedStart = moment(this.record.start).format('HH:mm')
    this.formattedEnd = moment(this.record.end).format('HH:mm')
    if (this.record.users.length) {
      this.record.users.forEach((userID) => {
        let userObj = this.$store.state.team.members.find(
          (member) => member.id == userID
        )
        this.userNames.push(`${userObj.last_name}, ${userObj.first_name}`)
      })
    }
  },
}
</script>
