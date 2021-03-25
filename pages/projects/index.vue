<template>
  <PageBody>
    <template v-slot:page-header>
      <SectionHeader text="Projects" />
    </template>
  </PageBody>
</template>

<script>
import PageBody from '@/components/ui/pageBody'
import SectionHeader from '@/components/ui/sectionHeader'
export default {
  name: 'ProjectsPage',
  middleware: ['auth'],
  head: {
    title: 'Projects - Minion',
  },
  components: {
    PageBody,
    SectionHeader,
  },
}
</script>

<style></style>
