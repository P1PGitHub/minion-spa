<template>
  <p>
    I, {{ client }}, agree that the information above is accurate and
    descriptive of the Priority1 POS services provided. I understand that this
    service may incur additional fees such as trip charges, installation costs,
    hardware cost, etc.
  </p>
</template>

<script>
export default {
  name: 'AgreementClause',
  props: {
    client: {
      type: String,
      required: true,
    },
  },
}
</script>
