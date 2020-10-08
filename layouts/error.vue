<template>
  <div
    class="pt-24 flex flex-col justify-between items-center bg-white dark:bg-gray-900 dark:text-white h-screen"
  >
    <div class="w-full text-center">
      <h1 class="text-6xl font-bold text-blue-700 dark:text-blue-300">404</h1>
      <p>You're lost.</p>
    </div>

    <img
      src="https://c4.wallpaperflare.com/wallpaper/455/547/738/minions-despicable-me-white-background-movies-wallpaper-preview.jpg"
      alt="Minion's looking at error message"
      v-if="($colorMode.value !== 'dark' )"
    />
    <img
      src="@/assets/png/error.png"
      alt="Evil minions yelling at good minion."
      v-else
    />
  </div>
</template>

<script>
export default {}
</script>
