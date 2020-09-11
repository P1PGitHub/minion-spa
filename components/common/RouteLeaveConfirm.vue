<template> </template>

<script>
export default {
  name: 'RouteLeaveConfirm',
  props: {
    allowText: {
      type: String,
      required: false,
      default: 'Confirm',
    },
    denyText: {
      type: String,
      required: false,
      default: 'Deny',
    },
    message: {
      type: String,
      required: false,
      default:
        'Do you really want to leave? You will lose any unsaved changes.',
    },
    override: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      routeOverride: this.override,
    }
  },
  methods: {
    confirm(next) {
      if (!this.routeOverride) {
        this.$root.$emit('showModal', {
          allowText: this.allowText,
          denyText: this.denyText,
          message: this.message,
        })
        this.$root.$once('modalClose', (choice) => {
          this.routeOverride = choice
          next(choice)
        })
      } else {
        next()
      }
    },
  },
}
</script>
