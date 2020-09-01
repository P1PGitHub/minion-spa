<template>
  <div class="">
    <div class="p-4 flex flex-col items-center w-full text-gray-800 space-y-4">
      <div
        class="flex items-center pb-4 border-b border-dashed border-gray-400 w-full"
      >
        <h1 class="text-xl">New Customer Service Quality Report</h1>
      </div>
      <form @submit.prevent class="space-y-4 container">
        <div class="p-4 border border-dashed border-gray-400 rounded space-y-4">
          <h1 class="text-lg text-blue-600">Client & Job Details</h1>
          <div
            class="p-4 space-y-4 bg-white rounded shadow border border-blue-400"
          >
            <div class="flex w-full space-x-2">
              <div class="w-1/2 space-y-2">
                <label for="company-name" class="block">Company</label>
                <select
                  name="company-name"
                  id="company-name"
                  class="form-select w-full bg-gray-100"
                  :class="{
                    'border-red-400': this.errors.job.fields.includes(
                      'company'
                    ),
                  }"
                  @change="onCompanyChange"
                  v-model="job.company.id"
                >
                  <option :value="null">Select a Company...</option>
                  <option
                    :value="company.id"
                    v-for="company in $store.state.team.cwCompanies"
                    :key="company.id"
                    >{{ company.name }}</option
                  >
                </select>
                <label for="location" class="block">Location</label>
                <input
                  name="location"
                  id="location"
                  class="form-input w-full bg-gray-100"
                  :class="{
                    'border-red-400': this.errors.job.fields.includes(
                      'location'
                    ),
                  }"
                  placeholder="Short Island, NY"
                  v-model="job.location"
                />
              </div>
              <div class="w-1/2 space-y-2">
                <label for="client-name" class="block">Client Name</label>
                <input
                  name="client-name"
                  id="client-name"
                  class="form-input w-full bg-gray-100"
                  :class="{
                    'border-red-400': this.errors.job.fields.includes(
                      'clientName'
                    ),
                  }"
                  placeholder="John Doe"
                  v-model="job.clientName"
                />
                <label for="job-type" class="block">Job Type</label>
                <select
                  name="job-type"
                  id="job-type"
                  class="form-select w-full bg-gray-100"
                  :class="{
                    'border-red-400': this.errors.job.fields.includes('type'),
                  }"
                  placeholder="Service Trip"
                  v-model="job.type"
                >
                  <option :value="null" selected
                    >Please select a job type...</option
                  >
                  <option value="INSTALL">Installation</option>
                  <option value="SALES">Sales</option>
                  <option value="SERVICE">Service Call</option>
                  <option value="TRAINING">Training</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div class="w-full">
              <label for="description" class="block">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                class="form-input w-full bg-gray-100"
                :class="{
                  'border-red-400': this.errors.job.fields.includes(
                    'description'
                  ),
                }"
                placeholder="Ingenico & Printer Installation"
                v-model="job.description"
              />
            </div>
          </div>
        </div>
        <div class="p-4 border border-dashed border-gray-400 rounded space-y-2">
          <div class="flex items-center space-x-4">
            <h1 class="text-lg text-blue-600">Time Tracking</h1>
            <button
              type="button"
              class="flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-1 px-2 rounded"
              @click="addNewRecord"
            >
              <span>Add</span>
              <span class="font-bold">+</span>
            </button>
          </div>

          <div
            class="flex justify-start items-start space-x-4 w-full overflow-x-scroll py-2 scrolling-touch"
          >
            <div
              class="p-4 relative min-w-64 md:min-w-96 bg-white border border-blue-400 space-y-4 rounded shadow"
              v-for="(record, index) in timeRecords"
              :key="index"
            >
              <div>
                <button
                  type="button"
                  class="bg-red-200 border border-red-400 p-1 rounded absolute top-0 right-0 -mt-2 -mr-2"
                  @click="removeRecord(index)"
                >
                  <img src="@/assets/svg/other/close-r.svg" alt="Delete Icon" />
                </button>
                <label for="shift-date" class="block">Shift Date</label>
                <v-date-picker
                  :input-props="{
                    class: 'form-input bg-gray-100 w-full mt-2',
                    name: 'shift-date',
                    id: 'shift-date',
                    placeholder: '12/21/2012',
                  }"
                  :value="record.date"
                  v-model="record.date"
                />
              </div>
              <div
                class="md:flex items-start space-y-2 md:space-x-2 md:space-y-0"
              >
                <div class="space-y-2 w-full md:w-1/2">
                  <label for="shift-start-time" class="block">Start Time</label>
                  <input
                    name="shift-start-time"
                    id="shift-start-time"
                    type="text"
                    class="form-input bg-gray-100 w-full"
                    placeholder="9:00"
                    v-model="record.startTime"
                  />
                </div>
                <div class="space-y-2 w-full md:w-1/2">
                  <label for="shift-end-time" class="block">End Time</label>
                  <input
                    name="shift-end-time"
                    id="shift-end-time"
                    type="text"
                    class="form-input bg-gray-100 w-full"
                    placeholder="14:00"
                    v-model="record.endTime"
                  />
                </div>
              </div>
              <div
                class="md:flex items-start space-y-2 md:space-x-2 md:space-y-0"
              >
                <div class="space-y-2 w-full md:w-1/2">
                  <label for="shift-employees" class="block">Employees</label>
                  <select
                    name="shift-employees"
                    id="shift-employees"
                    multiple
                    class="form-multiselect bg-gray-100 w-full h-32"
                    v-model="record.employees"
                  >
                    <option
                      :value="member.id"
                      v-for="member in $store.state.team.members"
                      :key="member.id"
                      >{{ member.last_name }}, {{ member.first_name }}</option
                    >
                  </select>
                </div>
                <div class="space-y-2 w-full md:w-1/2">
                  <label for="shift-notes" class="block">Notes</label>
                  <textarea
                    name="shift-notes"
                    id="shift-notes"
                    class="form-textarea w-full bg-gray-100 h-32"
                    v-model="record.notes"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border border-dashed border-gray-400 rounded space-y-4">
          <h1 class="text-lg text-blue-600">Inventory Used</h1>
          <div
            class="flex flex-wrap items-center px-4 py-3 bg-white rounded shadow border border-blue-400"
          >
            <h3 class="w-1/2 md:w-4/12 py-1">Description</h3>
            <h3 class="w-1/2 md:w-3/12 py-1">Serial Number</h3>
            <h3 class="w-1/2 md:w-3/12 py-1">Model Number</h3>
            <h3 class="w-1/2 md:w-2/12 py-1">Actions</h3>
          </div>
          <div
            class="px-4 py-3 space-y-2 bg-white rounded shadow border border-blue-400"
            v-if="inventory.length"
          >
            <div
              class="flex flex-wrap items-center text-sm md:text-base"
              :class="{
                'border-b border-dashed border-gray-300':
                  index !== inventory.length - 1,
              }"
              v-for="(item, index) in inventory"
              :key="index"
            >
              <div class="w-1/2 md:w-4/12 py-1">{{ item.description }}</div>
              <div class="w-1/2 md:w-3/12 py-1">{{ item.serial }}</div>
              <div class="w-1/2 md:w-3/12 py-1">{{ item.model }}</div>
              <div class="w-1/2 md:w-2/12 py-1">
                <button
                  type="button"
                  class="bg-red-200 border border-red-400 rounded py-1 px-2 flex items-center justify-center"
                  @click="removeInventory(index)"
                >
                  <img
                    src="@/assets/svg/other/remove-r.svg"
                    alt="Delete Icon"
                    class="w-4"
                  />
                </button>
              </div>
            </div>
          </div>
          <div
            class="flex flex-wrap items-center p-2 bg-white rounded shadow border border-blue-400"
          >
            <div class="w-1/2 md:w-4/12 space-y-2 px-2 py-2">
              <label
                for="inventory-description"
                class="block whitespace-no-wrap"
                >Description</label
              >
              <input
                name="inventory-description"
                id="inventory-description"
                type="text"
                class="form-input w-full bg-gray-100"
                :class="{
                  'border-red-400': this.errors.newInventory.includes(
                    'description'
                  ),
                }"
                placeholder="Ingenico Lane3000"
                v-model="newInventory.description"
              />
            </div>
            <div class="w-1/2 md:w-3/12 space-y-2 px-2 py-2">
              <label
                for="inventory-sn"
                class="block whitespace-no-wrap overflow-hidden"
                >Serial Number</label
              >
              <input
                name="inventory-sn"
                id="inventory-sn"
                type="text"
                class="form-input w-full bg-gray-100"
                :class="{
                  'border-red-400': this.errors.newInventory.includes('serial'),
                }"
                placeholder="123456789-00"
                v-model="newInventory.serial"
              />
            </div>
            <div class="w-1/2 md:w-3/12 space-y-2 px-2 py-2">
              <label
                for="inventory-model-number"
                class="block whitespace-no-wrap overflow-hidden"
                >Model Number</label
              >
              <input
                name="inventory-model-number"
                id="inventory-model-number"
                type="text"
                class="form-input w-full bg-gray-100"
                :class="{
                  'border-red-400': this.errors.newInventory.includes('model'),
                }"
                placeholder="LANE3000-1234"
                v-model="newInventory.model"
              />
            </div>
            <div class="w-1/2 md:w-2/12 space-y-2 px-2 py-2">
              <h3>Actions</h3>
              <div class="flex items-stretch space-x-2">
                <button
                  type="button"
                  class="bg-red-200 border border-red-400 rounded px-2"
                  @click="resetNewInventory"
                >
                  <img src="@/assets/svg/other/remove-r.svg" alt="Reset Icon" />
                </button>
                <button
                  type="button"
                  class="w-full space-x-2 bg-blue-600 text-white font-bold py-2 rounded"
                  @click="addInventory"
                >
                  <span>Add</span>
                  <span>+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border border-dashed border-gray-400 rounded space-y-4">
          <h1 class="text-lg text-blue-600">Work Summary</h1>
          <textarea
            name="work-summary"
            id="work-summary"
            class="form-textarea w-full h-40 shadow border"
            :class="{
              'border-red-400': this.errors.summary,
              'border-blue-400': !this.errors.summary,
            }"
            placeholder="Replaced Term6 EMV Device with new Ingenico Lane3000"
            v-model="summary"
          ></textarea>
        </div>
        <div class="p-4 border border-dashed border-gray-400 rounded space-y-4">
          <h1 class="text-lg text-blue-600">Additional Information</h1>
          <div
            class="p-4 space-y-2 md:space-y-4 bg-white rounded shadow border border-blue-400 md:text-lg"
          >
            <div
              class="md:flex items-center w-full space-y-2 md:space-x-4 md:space-y-0"
            >
              <div class="md:w-1/2 space-x-2 flex items-center">
                <input
                  type="checkbox"
                  name="billable"
                  id="billable"
                  class="form-checkbox bg-gray-100 rounded-full border-gray-400"
                  v-model="details.billable"
                />
                <label for="billable">Billable Job?</label>
              </div>
              <div class="md:w-1/2 space-x-2 flex items-center">
                <input
                  type="checkbox"
                  name="completed"
                  id="completed"
                  class="form-checkbox bg-gray-100 rounded-full border-gray-400"
                  v-model="details.completed"
                />
                <label for="completed">Job Complete?</label>
              </div>
            </div>
            <div
              class="md:flex items-center w-full space-y-2 md:space-x-4 md:space-y-0"
            >
              <div class="md:w-1/2 space-x-2 flex items-center">
                <input
                  type="checkbox"
                  name="tested"
                  id="tested"
                  class="form-checkbox bg-gray-100 rounded-full border-gray-400"
                  v-model="details.tested"
                />
                <label for="tested">Completed Tests?</label>
              </div>
              <div class="md:w-1/2 space-x-2 flex items-center">
                <input
                  type="checkbox"
                  name="pictures"
                  id="pictures"
                  class="form-checkbox bg-gray-100 rounded-full border-gray-400"
                  v-model="details.pictures"
                />
                <label for="pictures">Pictures Taken?</label>
              </div>
            </div>
            <div
              class="md:flex items-center w-full space-y-2 md:space-x-4 md:space-y-0"
            >
              <div class="md:w-1/2 space-x-2 flex items-center">
                <input
                  type="checkbox"
                  name="reviewed"
                  id="reviewed"
                  class="form-checkbox bg-gray-100 rounded-full border-gray-400"
                  v-model="details.reviewed"
                />
                <label for="reviewed">Reviewed Job with Client?</label>
              </div>
              <div class="md:w-1/2 space-x-2 flex items-center">
                <input
                  type="checkbox"
                  name="satisfied"
                  id="satisfied"
                  class="form-checkbox bg-gray-100 rounded-full border-gray-400"
                  v-model="details.satisfied"
                />
                <label for="satisfied">Client Satisfied?</label>
              </div>
            </div>
            <div
              class="md:flex items-center w-full space-y-2 md:space-x-4 md:space-y-0"
            >
              <label for="follow-up-notes" class="whitespace-no-wrap"
                >Follow Up?</label
              >
              <input
                type="text"
                class="form-input w-full bg-gray-100 text-sm"
                placeholder="Return with New Printer"
                v-model="details.followupNotes"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          class="bg-blue-600 text-white w-full py-1 rounded"
          @click="pushPreview"
        >
          Preview
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad'
export default {
  name: 'CSQRNewPage',
  middleware: ['auth'],
  props: {
    package: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      details: {
        billable: false,
        completed: false,
        tested: false,
        pictures: false,
        reviewed: false,
        satisfied: false,
        followupNotes: null,
      },
      errors: {
        job: { fields: [], message: null },
        newInventory: [],
        summary: false,
        timeRecords: { index: null, field: null, message: null },
      },
      inventory: [],
      job: {
        company: {
          id: null,
          name: null,
        },
        clientName: null,
        location: null,
        description: null,
        type: null,
      },
      newInventory: {
        description: null,
        serial: null,
        model: null,
      },
      overrideBeforeLeave: false,
      summary: null,
      timeRecords: [
        {
          date: new Date(),
          startTime: '9:00',
          endTime: '14:00',
          employees: [],
          notes: null,
        },
      ],
    }
  },
  methods: {
    addInventory() {
      if (this.validateNewInventory()) {
        this.inventory.push(this.newInventory)
        this.resetNewInventory()
        this.inventory.sort((a, b) => {
          if (a.description < b.description) {
            return -1
          } else {
            return 1
          }
        })
      }
    },
    addNewRecord() {
      this.timeRecords.push({
        date: new Date(),
        startTime: null,
        endTime: null,
        employees: [],
        notes: null,
      })
    },
    pushPreview() {
      this.overrideBeforeLeave = true
      if (this.validateForm()) {
        this.$router.push({
          name: 'reports-csqr-preview',
          params: {
            pkg: {
              details: this.details,
              inventory: this.inventory,
              job: this.job,
              summary: this.summary,
              timeRecords: this.timeRecords,
            },
          },
        })
      }
      this.overrideBeforeLeave = false
    },
    resetNewInventory() {
      this.newInventory = {
        description: null,
        serial: null,
        model: null,
      }
      this.errors.newInventory = []
    },
    removeInventory(index) {
      this.inventory.splice(index, 1)
    },
    removeRecord(index) {
      this.timeRecords.splice(index, 1)
    },
    onCompanyChange() {
      this.job.company.name = null
      if (this.job.company.id) {
        let company = this.$store.state.team.cwCompanies.find(
          (company) => company.id == this.job.company.id
        )
        this.job.company.name = company.name
        this.job.clientName = null
        this.job.location = null
        if (company.address && company.address.city != 'NA') {
          if (company.address.state) {
            this.job.location = `${company.address.city}, ${company.address.state}`
          } else {
            this.job.location = company.address.state
          }
        }
        if (company.contact) {
          this.job.clientName = company.contact.name
        }
      } else {
        console.log('no company selected')
      }
    },
    validateForm() {
      return this.validateJob() && this.validateWorkSummary()
    },
    validateJob() {
      this.errors.job.fields = []
      Object.keys(this.job).forEach((key) => {
        if (typeof this.job[key] == 'object' && this.job[key] !== null) {
          if (!this.job[key].id) {
            this.errors.job.fields.push(key)
          }
        } else if (!this.job[key]) {
          this.errors.job.fields.push(key)
        }
      })
      if (this.errors.job.fields.length) {
        this.$root.$emit('showToast', {
          text: 'Please clear errors in the Client & Job Details section.',
          type: 'error',
        })
        return false
      } else {
        return true
      }
    },
    validateNewInventory() {
      this.errors.newInventory = []
      if (!this.newInventory.description) {
        this.errors.newInventory.push('description')
      }
      if (!this.newInventory.serial) {
        this.errors.newInventory.push('serial')
      }
      if (!this.newInventory.model) {
        this.errors.newInventory.push('model')
      }
      if (this.errors.newInventory.length) {
        this.$root.$emit('showToast', {
          text:
            'Please fill out all fields for the new item coming from our inventory.',
          type: 'error',
        })
        return false
      } else {
        return true
      }
    },
    validateWorkSummary() {
      this.errors.summary = false
      if (this.summary) {
        this.errors.summary = false
        return true
      } else {
        this.errors.summary = true
        this.$root.$emit('showToast', {
          text:
            'Please fill out the work summary with details about the job performed.',
          type: 'error',
        })
        return false
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.overrideBeforeLeave) {
      this.$root.$emit('showModal', {
        allowText: 'Exit',
        denyText: 'Cancel',
        message:
          'Do you really want to leave? You will lose any unsaved changes.',
      })
      this.$root.$once('modalClose', (choice) => {
        this.overrideBeforeLeave = choice
        next(choice)
      })
    } else {
      next()
    }
  },
}
</script>
