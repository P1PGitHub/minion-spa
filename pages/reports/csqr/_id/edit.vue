<template>
  <div class="pt-24">
    <h1 class="text-xl">Edit Page</h1>
  </div>
</template>

<script>
export default {
  name: 'CSQRIDEditPage',
  middleware: ['auth'],
  created() {
    if (this.$route.params.id) {
      console.log('hello')
    }
  },
}
</script>
