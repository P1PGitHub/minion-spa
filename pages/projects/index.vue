<template>
  <PageBody>
    <template v-slot:page-header>
      <div class="flex items-center justify-between w-full">
        <SectionHeader text="Projects" bold size="lg" />

        <ActionButton theme="primary" @click="openNewProjectModal"
          >New +
        </ActionButton>
      </div>
    </template>
    <template v-slot:page-content>
      <FlexSection>
        <div class="w-full md:w-1/2 space-y-4">
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Your Projects" />
              <Loading v-if="loadingProjects" />
            </div>
            <ProjectListItem
              v-for="project in limitedProjectArray"
              :key="project.id"
              :project="project"
              @reload="getProjects"
            />
            <HeaderAside v-if="!loadingProjects && !projects.length"
              >No projects to show here.</HeaderAside
            >
            <ActionButton
              :link="{ name: 'projects' }"
              spacing="sm"
              theme="hollow"
              class="w-full"
              v-if="projects.length > 5"
              @click="limitProjects = !limitProjects"
            >
              <span v-if="limitProjects">View More...</span>
              <span v-else>View Less...</span>
            </ActionButton>
          </SolidSection>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Your Tasks" />
              <Loading v-if="loadingTasks" />
            </div>
            <HeaderAside v-if="!loadingTasks && !tasks.length"
              >Congrats! There's nothing for you to do here!</HeaderAside
            >
            <TaskListItem
              v-for="task in tasks"
              :key="task.id"
              :project="task.project"
              :task="task"
              @reload="getTasks"
            />
          </SolidSection>
        </div>
        <div class="w-full md:w-1/2 space-y-4">
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Recent Updates" />
              <Loading v-if="loadingUpdates" />
            </div>
            <HeaderAside v-if="!loadingUpdates && !updates.length"
              >No updates to report on today.</HeaderAside
            >
            <UpdateListItem
              v-for="update in limitedUpdateArray"
              :key="update.id"
              :update="update"
            />
            <div class="flex items-center">
              <ActionButton
                spacing="sm"
                theme="hollow"
                class="w-full"
                v-if="updates.length > 5"
                @click="limitUpdates = !limitUpdates"
              >
                <span v-if="limitUpdates">View More...</span>
                <span v-else>View Less...</span>
              </ActionButton>
            </div>
          </SolidSection>
          <SolidSection>
            <div class="flex items-center justify-between">
              <SectionHeader text="Team Projects" />
              <Loading v-if="loadingTeamProjects" />
            </div>
            <ProjectListItem
              v-for="project in limitedTeamProjectArray"
              :key="project.id"
              :project="project"
              @reload="getTeamProjects"
            />
            <HeaderAside v-if="!loadingTeamProjects && !teamProjects.length"
              >Seems like your team isn't working on anything
              currently.</HeaderAside
            >
            <div class="flex items-center space-x-2">
              <ActionButton
                spacing="sm"
                theme="hollow"
                v-if="teamProjects.length > 5"
              >
                <span class="whitespace-nowrap px-4">View All</span>
              </ActionButton>
              <ActionButton
                spacing="sm"
                theme="hollow"
                class="w-full"
                v-if="teamProjects.length > 5"
                @click="limitTeamProjects = !limitTeamProjects"
              >
                <span v-if="limitTeamProjects">View More...</span>
                <span v-else>View Less...</span>
              </ActionButton>
            </div>
          </SolidSection>
        </div>
      </FlexSection>
    </template>
    <template v-slot:modals>
      <NewProjectModal ref="newProjectModal" />
    </template>
  </PageBody>
</template>

<script>
import ActionButton from '@/components/ui/actionButton'
import ButtonLink from '@/components/ui/buttonLink'
import FlexSection from '@/components/ui/flexSection'
import HeaderAside from '@/components/ui/headerAside'
import Loading from '@/components/common/loading'
import NewProjectModal from '@/components/ui/modals/newProjectModal'
import PageBody from '@/components/ui/pageBody'
import ProjectListItem from '@/components/ui/listItems/projectListItem'
import SectionHeader from '@/components/ui/sectionHeader'
import SolidSection from '@/components/ui/solidSection'
import TaskListItem from '@/components/ui/listItems/taskListItem'
import UpdateListItem from '@/components/ui/listItems/updateListItem'
export default {
  name: 'ProjectsPage',
  middleware: ['auth'],
  head: {
    title: 'Projects - Minion',
  },
  components: {
    ActionButton,
    ButtonLink,
    FlexSection,
    HeaderAside,
    Loading,
    NewProjectModal,
    PageBody,
    ProjectListItem,
    SectionHeader,
    SolidSection,
    TaskListItem,
    UpdateListItem,
  },
  data() {
    return {
      limitProjects: true,
      limitUpdates: true,
      loadingProjects: false,
      limitTeamProjects: false,
      loadingTasks: false,
      loadingTeamProjects: false,
      loadingUpdates: false,
      projects: [],
      tasks: [],
      teamProjects: [],
      updates: [],
    }
  },
  computed: {
    limitedProjectArray() {
      if (this.limitProjects) {
        return this.projects.slice(0, 5)
      } else {
        return this.projects
      }
    },
    limitedTeamProjectArray() {
      if (this.limitTeamProjects) {
        return this.teamProjects.slice(0, 5)
      } else {
        return this.teamProjects
      }
    },
    limitedUpdateArray() {
      if (this.limitUpdates) {
        return this.updates.slice(0, 5)
      } else {
        return this.updates
      }
    },
  },
  methods: {
    getProjects() {
      this.loadingProjects = true
      this.$store.dispatch('api/get', '/projects/user/').then((projects) => {
        this.projects = projects
        this.loadingProjects = false
      })
    },
    getTasks() {
      this.loadingTasks = true
      this.$store.dispatch('api/get', '/projects/tasks/user/').then((tasks) => {
        this.tasks = tasks
        this.loadingTasks = false
      })
    },
    getTeamProjects() {
      this.loadingTeamProjects = true
      this.$store.dispatch('api/get', '/projects/').then((projectsResponse) => {
        this.teamProjects = projectsResponse.results.slice(0, 10)
        this.loadingTeamProjects = false
      })
    },
    getUpdates() {
      this.loadingUpdates = true
      this.$store
        .dispatch('api/get', '/projects/updates/user/')
        .then((updates) => {
          this.updates = updates
          this.loadingUpdates = false
        })
    },
    openNewProjectModal() {
      this.$refs.newProjectModal.open()
    },
  },
  created() {
    this.getProjects()
    this.getTasks()
    this.getTeamProjects()
    this.getUpdates()
  },
}
</script>
