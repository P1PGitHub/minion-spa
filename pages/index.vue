<template>
  <PageBody>
    <template v-slot:page-header>
      <SectionHeader text="Your Dashboard" />
      <div
        class="bg-blue-600 text-white px-4 py-2 rounded border border-blue-600 space-x-2 flex items-center"
      >
        <img src="@/assets/svg/other/boy-white.svg" alt="Account Icon" />
        <span>
          {{ $store.state.account.account.last_name }},
          {{ $store.state.account.account.first_name }}
        </span>
      </div>
    </template>
    <template v-slot:page-content>
      <FlexSection>
        <div class="w-full md:w-1/2">
          <SolidSection class="w-full">
            <div class="flex items-center justify-between">
              <SectionHeader :text="today.format('dddd MMMM Do')" />
              <ActionButton spacing="sm">Add +</ActionButton>
            </div>

            <HeaderAside>
              Time tracking coming in a future update...
            </HeaderAside>
            <div
              class="p-2 bg-green-100 border border-green-300 rounded space-y-2 relative"
            >
              <div class="flex space-x-2">
                <div class="text-right text-green-800 font-bold">
                  <p>9:00</p>
                  <p>14:00</p>
                </div>
                <div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm">
                <p>Colin Williams</p>
                <p>Juicy Crab Albany</p>
              </div>
              <div>
                <div
                  class="absolute top-0 right-0 -mt-2 -mr-2 rounded-full bg-green-300 h-6 w-6 flex items-center justify-center text-white italic"
                >
                  <img
                    src="@/assets/svg/buttons/more-alt.svg"
                    alt="More Info Icon"
                  />
                </div>
              </div>
            </div>
            <div
              class="p-2 bg-orange-100 border border-orange-300 rounded space-y-2 relative"
            >
              <div class="flex space-x-2">
                <div class="text-right text-orange-800 font-bold">
                  <p>9:00</p>
                  <p>14:00</p>
                </div>
                <div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm">
                <p>Colin Williams</p>
                <p>Juicy Crab Albany</p>
              </div>
              <div>
                <button
                  class="absolute top-0 right-0 -mt-2 -mr-2 rounded-full bg-orange-300 h-6 w-6 flex items-center justify-center"
                >
                  <img
                    src="@/assets/svg/buttons/more-alt.svg"
                    alt="More Info Icon"
                  />
                </button>
                <button
                  class="absolute bottom-0 right-0 -mb-2 -mr-2 bg-orange-300 rounded-full h-6 w-6 flex items-center justify-center"
                >
                  &check;
                </button>
              </div>
            </div>
          </SolidSection>
        </div>

        <div class="w-full md:w-1/2 space-y-4">
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="CSQR Drafts" />
              <Loading v-if="loadingDrafts" />
            </div>
            <ReportListItem
              v-for="(draft, index) in drafts"
              :key="draft.id"
              :report="draft"
              :hideAuthor="true"
              :editLink="true"
              :border="index !== drafts.length - 1"
            />
            <ButtonLink
              spacing="sm"
              theme="hollow"
              :link="{ name: 'reports-csqr-drafts' }"
              >View All...</ButtonLink
            >
          </SolidSection>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Recent CSQRs" />
              <Loading v-if="loadingRecents" />
            </div>

            <ReportListItem
              v-for="(recent, index) in recents"
              :key="recent.id"
              :report="recent"
              :hideAuthor="true"
              :border="index !== recents.length - 1"
            />
            <ButtonLink
              spacing="sm"
              theme="hollow"
              :link="{ name: 'reports-csqr-list' }"
              >View All...</ButtonLink
            >
          </SolidSection>
        </div>
      </FlexSection>
    </template>
  </PageBody>
</template>

<script>
import moment from 'moment'
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
import DashedSection from '@/components/ui/dashedSection'
import FlexSection from '@/components/ui/flexSection'
import HeaderAside from '@/components/ui/headerAside'
import Loading from '@/components/common/Loading'
import PageBody from '@/components/ui/pageBody'
import ReportListItem from '@/components/ui/reportListItem'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
export default {
  name: 'HomePage',
  middleware: ['auth'],
  head: {
    title: 'Minion',
  },
  components: {
    ActionButton,
    ButtonLink,
    DashedSection,
    FlexSection,
    HeaderAside,
    Loading,
    PageBody,
    ReportListItem,
    SectionHeader,
    SolidSection,
  },
  data() {
    return {
      loadingDrafts: false,
      loadingRecents: false,
      drafts: [],
      recents: [],
      today: moment(),
    }
  },
  created() {
    this.loadingDrafts = true
    this.loadingRecents = true
    this.$store
      .dispatch('api/get', '/reports/customer_service/drafts/recent/')
      .then((drafts) => {
        this.drafts = drafts.splice(0, 2)
        this.loadingDrafts = false
      })
    this.recents = this.$store
      .dispatch('api/get', '/reports/customer_service/recent/')
      .then((recents) => {
        this.recents = recents.splice(0, 2)
        this.loadingRecents = false
      })
  },
}
</script>
