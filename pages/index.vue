<template>
  <div>
    <h1 class="text-xl">Minion Home Page</h1>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  middleware: ["auth"]
}
</script>
