<template>
  <PageBody>
    <template v-slot:page-header>
      <div class="flex items-center justify-between w-full">
        <SectionHeader text="Files & Resources" bold size="lg" />
        <div class="flex items-center space-x-4">
          <ActionButton theme="hollow" spacing="sm">
            <inline-svg
              :src="require('@/assets/svg/arrows/arrow-up.svg')"
              class="h-6 w-6"
            />
          </ActionButton>
          <ActionButton theme="hollow" spacing="sm">
            <inline-svg
              :src="require('@/assets/svg/buttons/search.svg')"
              class="h-6 w-6"
            />
          </ActionButton>

          <ActionButton spacing="sm">
            <inline-svg
              :src="require('@/assets/svg/file/upload.svg')"
              class="h-6 w-6"
            />
            <span>Upload</span>
          </ActionButton>
        </div>
      </div>
    </template>
    <template></template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
export default {
  name: 'Resources',
  components: {
    ActionButton,
    PageBody,
    SectionHeader,
  },
}
</script>

<style></style>
