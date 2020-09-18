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
  methods: {
    confirm(next) {
      if (!this.override) {
        this.$root.$emit('showModal', {
          allowText: this.allowText,
          denyText: this.denyText,
          message: this.message,
        })
        this.$root.$once('modalClose', (choice) => {
          next(choice)
        })
      } else {
        next()
      }
    },
    toggleOverride() {
      this.override = !this.override
    },
    setOverride(val) {
      this.override = val
    },
  },
}
</script>
