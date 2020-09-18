<template>
  <div
    class="flex items-center justify-start min-h-screen overflow-y-scroll p-4 bg-right-bottom bg-cover bg-no-repeat"
    id="signup-page"
  >
    <div
      class="p-4 w-5/6 sm:w-1/2 md:w-1/3 bg-white shadow-md rounded space-y-4"
    >
      <h1
        class="text-2xl text-blue-700 font-bold tracking-wide pb-4 border-b border-dashed border-gray-400"
      >
        Register Account
      </h1>
      <form @submit.prevent class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-gray-700">First Name</h3>
          <div class="relative">
            <input
              type="text"
              placeholder="Jane"
              class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
            />
            <div class="absolute top-0 bottom-0 left-0 ml-3 flex items-center">
              <img
                src="@/assets/svg/other/boy.svg"
                alt="First Name Face Icon"
              />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-gray-700">Last Name</h3>
          <div class="relative">
            <input
              type="text"
              placeholder="Doe"
              class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
            />
            <div class="absolute top-0 bottom-0 left-0 ml-3 flex items-center">
              <img src="@/assets/svg/other/boy.svg" alt="Last Name Face Icon" />
            </div>
          </div>
        </div>

        <div class="border-b border-dashed border-gray-400"></div>
        <div class="space-y-2">
          <h3 class="text-gray-700">Email Address</h3>
          <div class="relative">
            <input
              type="text"
              placeholder="jane.doe@hello.com"
              class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
            />
            <div class="absolute top-0 bottom-0 left-0 ml-3 flex items-center">
              <img src="@/assets/svg/other/mail.svg" alt="Email Icon" />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-gray-700">Password</h3>
          <div class="relative">
            <input
              type="password"
              placeholder="super-secure-password"
              class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
            />
            <div class="absolute top-0 bottom-0 left-0 ml-3 flex items-center">
              <img src="@/assets/svg/other/keyhole.svg" alt="Password Icon" />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-gray-700">Confirm Password</h3>
          <div class="relative">
            <input
              type="password"
              placeholder="super-secure-password"
              class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
            />
            <div class="absolute top-0 bottom-0 left-0 ml-3 flex items-center">
              <img src="@/assets/svg/other/keyhole.svg" alt="Password Icon" />
            </div>
          </div>
        </div>
        <div class="border-b border-dashed border-gray-400"></div>
        <div class="space-y-2">
          <h3 class="text-gray-700">Team ID</h3>
          <div class="relative">
            <input
              type="text"
              placeholder="my-company"
              class="form-input bg-gray-100 border border-gray-400 w-full pl-12"
            />
            <div class="absolute top-0 bottom-0 left-0 ml-3 flex items-center">
              <img
                src="@/assets/svg/other/community.svg"
                alt="Community Icon"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          class="w-full bg-blue-600 text-white font-bold py-2 rounded mt-4"
        >
          Create Account
        </button>
        <div class="flex items-center justify-center text-gray-700">
          <nuxt-link :to="{ name: 'auth-login' }" class="underline"
            >Already have an account?</nuxt-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupPage',
  layout: 'auth',
  head: {
    title: 'Minion Account Signup',
  },
}
</script>

<style scoped>
#signup-page {
  background-image: url(https://source.unsplash.com/9047Ku0YaO4/1920x1080);
}
</style>
