<template>
  <div class="p-4 text-gray-800 space-y-4">
    <div
      class="flex items-start md:items-center justify-between pb-4 border-b border-dashed border-gray-400"
    >
      <h1 class="text-xl">Customer Service Quality Report</h1>
      <button
        type="button"
        class="px-2 py-1 bg-blue-600 text-white rounded text-sm whitespace-no-wrap"
        @click="publish(true)"
      >
        Save as Draft
      </button>
    </div>
    <div class="space-y-4 md:flex md:space-x-4 md:space-y-0">
      <div
        class="md:w-1/2 p-4 border border-dashed border-gray-400 rounded space-y-4"
      >
        <div class="space-y-1">
          <h1 class="text-2xl text-blue-600">{{ job.company.name }}</h1>
          <h3>{{ job.location }}</h3>
          <h3>{{ job.clientName }}</h3>
        </div>
        <div class="space-y-1">
          <h3>{{ job.type }}</h3>
          <h3>{{ job.description }}</h3>
        </div>
      </div>
      <div
        class="md:w-1/2 md:flex flex-wrap items-start p-4 border border-dashed border-gray-400 rounded"
      >
        <h1 class="text-xl text-blue-600 w-full">Additional Information</h1>
        <div class="md:w-1/2 py-2 flex items-center space-x-2">
          <input
            type="checkbox"
            class="form-checkbox border-gray-600 rounded-full"
            checked
            disabled
            v-model="details.billable"
          />
          <label>Billable Job?</label>
        </div>
        <div class="md:w-1/2 py-2 flex items-center space-x-2">
          <input
            type="checkbox"
            class="form-checkbox border-gray-600 rounded-full"
            disabled
            v-model="details.completed"
          />
          <label>Job Complete?</label>
        </div>
        <div class="md:w-1/2 py-2 flex items-center space-x-2">
          <input
            type="checkbox"
            class="form-checkbox border-gray-600 rounded-full"
            disabled
            v-model="details.tested"
          />
          <label>Completed Tests?</label>
        </div>
        <div class="md:w-1/2 py-2 flex items-center space-x-2">
          <input
            type="checkbox"
            class="form-checkbox border-gray-600 rounded-full"
            checked
            disabled
            v-model="details.pictures"
          />
          <label>Pictures Taken?</label>
        </div>
        <div class="md:w-1/2 py-2 flex items-center space-x-2">
          <input
            type="checkbox"
            class="form-checkbox border-gray-600 rounded-full"
            checked
            disabled
            v-model="details.reviewed"
          />
          <label>Reviewed Job with Client?</label>
        </div>
        <div class="md:w-1/2 py-2 flex items-center space-x-2">
          <input
            type="checkbox"
            class="form-checkbox border-gray-600 rounded-full"
            checked
            disabled
            v-model="details.satisfied"
          />
          <label>Client Satisfied?</label>
        </div>
        <div class="py-2" v-if="details.followupNotes">
          <span class="whitespace-no-wrap block pb-1">Follow Up?</span>
          <p>{{ details.followupNotes }}</p>
        </div>
      </div>
    </div>

    <div class="p-4 border border-dashed border-gray-400 rounded space-y-2">
      <h1 class="text-xl text-blue-600">Time Tracking</h1>
      <div
        class="py-1 space-y-1"
        :class="{
          'border-b border-dashed border-gray-400':
            index !== timeRecords.length - 1,
        }"
        v-for="(record, index) in timeRecords"
        :key="index"
      >
        <h3 class="text-lg text-blue-600">{{ record.formattedDate }}</h3>
        <div class="flex items-center space-x-2 font-bold text-gray-700">
          <span>{{ record.startTime }}</span>
          <span>&bull;</span>
          <span>{{ record.endTime }}</span>
        </div>
        <p>
          <span v-for="(employee, index) in record.employeeNames" :key="index">
            <span>{{ employee }}</span>
            <span v-if="index !== record.employeeNames.length - 1" class="px-1"
              >&bull;</span
            >
          </span>
        </p>
        <p v-if="record.notes">{{ record.notes }}</p>
      </div>
    </div>

    <div
      class="p-4 border border-dashed border-gray-400 rounded space-y-2"
      v-if="inventory.length"
    >
      <h1 class="text-xl text-blue-600">Inventory Used</h1>
      <div
        class="flex items-center py-1 border-b border-dashed border-gray-400 text-sm md:text-base"
      >
        <span class="w-1/3">Description</span>
        <span class="w-1/3">Serial Number</span>
        <span class="w-1/3">Model Number</span>
      </div>
      <div
        class="space-x-1 flex items-center py-1text-sm md:text-base"
        :class="{
          'border-b border-dashed border-gray-400':
            index !== inventory.length - 1,
        }"
        v-for="(item, index) in inventory"
        :key="index"
      >
        <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
          item.description
        }}</span>
        <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
          item.serial
        }}</span>
        <span class="w-1/3 overflow-hidden whitespace-no-wrap">{{
          item.model
        }}</span>
      </div>
    </div>

    <div class="p-4 border border-dashed border-gray-400 rounded space-y-4">
      <h1 class="text-xl text-blue-600">Work Summary</h1>
      <p v-if="summary">{{ summary }}</p>
      <p v-else>No summary provided.</p>
    </div>

    <div class="p-4 border border-dashed border-gray-400 rounded space-y-4">
      <h1 class="text-xl text-blue-600">Client Signature</h1>

      <form class="flex items-start space-x-4">
        <input
          type="checkbox"
          name="client-agree"
          id="client-agree"
          class="form-checkbox mt-1 rounded-full border-gray-600"
          v-model="signaturePad.show"
          :disabled="signaturePad.show"
        />
        <label for="client-agree">
          I, {{ job.clientName }}, agree that the information above is accurate
          and descriptive of the Priority1 POS services provided. I understand
          that this service may incur additional fees such as trip charges,
          installation costs, hardware cost, etc.
        </label>
      </form>

      <div
        class="space-y-4 relative"
        v-show="signaturePad.show && !signaturePad.saved"
      >
        <canvas
          class="rounded border bg-white"
          :class="{
            'border-green-400': signaturePad.saved,
            'border-blue-400': !signaturePad.saved,
          }"
          id="client-signature-pad"
          :width="signaturePad.width"
          height="255"
        ></canvas>

        <div class="flex items-center w-full space-x-2">
          <button
            type="button"
            class="w-1/4 py-1 bg-red-200 border border-red-400 rounded text-red-800"
            @click="clearSignPad"
          >
            Clear
          </button>
          <button
            type="button"
            class="w-3/4 py-1 bg-blue-600 border bordder-blue-600 rounded text-white"
            @click="saveSignPad"
          >
            Save
          </button>
        </div>
      </div>

      <div class="fixed bottom-0 left-0 p-4 w-1/2 max-w-lg">
        <div
          class="relative bg-white rounded border border-teal-300 shadow"
          v-if="signaturePad.data"
          v-show="!signaturePad.hidePreview"
        >
          <h3 class="text-teal-700 px-2 py-1">{{ job.clientName }}</h3>
          <img :src="signaturePad.data" />
          <button
            class="p-1 absolute bottom-0 right-0 -mr-2 -mb-2 border border-red-300 bg-red-100 rounded"
            type="button"
            v-if="signaturePad.data"
            @click="clearSignPad"
          >
            <img src="@/assets/svg/other/close-r.svg" alt="Saved Icon" />
          </button>
        </div>
        <button
          class="p-2 fixed bottom-0 left-0 ml-2 mb-2 border border-teal-300 bg-teal-100 rounded"
          type="button"
          v-if="signaturePad.data"
          @click="togglePreview"
        >
          <img src="@/assets/svg/file/file.svg" alt="Saved Icon" />
        </button>
      </div>
    </div>

    <button
      type="button"
      class="py-2 w-full rounded border"
      :class="{
        'bg-blue-600 text-white border-blue-600': signaturePad.data,
        'bg-white text-blue-400 border-blue-400': !signaturePad.data,
      }"
      :disabled="!signaturePad.data || isLoading"
      @click="publish(false)"
    >
      Publish
    </button>
  </div>
</template>

<script>
import moment from 'moment'
import SignaturePad from 'signature_pad'
export default {
  name: 'CSQRPreview',
  middleware: ['auth'],
  data() {
    return {
      isLoading: false,
      overrideBeforeLeave: false,
      signaturePad: {
        canvas: null,
        hidePreview: true,
        id: null,
        pad: null,
        saved: false,
        width: 0,
      },
      ...this.$route.params.pkg,
    }
  },
  methods: {
    buildReportData(isDraft = False) {
      return {
        client_name: this.job.clientName,
        company_id: this.job.company.id,
        company_name: this.job.company.name,
        report_type: 'CUSTOMER_SERVICE',
        draft: isDraft,
        service_type: this.job.type,
        description: this.job.description,
        billable: this.details.billable,
        completed: this.details.completed,
        pictures: this.details.pictures,
        reviewed: this.details.reviewed,
        satisfied: this.details.satisfied,
        tested: this.details.tested,
        summary: this.summary,
        signature: this.signaturePad.id,
      }
    },
    buildTimeRecords() {
      let timeEntries = []
      this.timeRecords.forEach((timeRecord) => {
        let startDate = moment(timeRecord.date)
        startDate.hour(timeRecord.startTime.split(':'[0]))
        startDate.minute(timeRecord.startTime.split(':'[1]))
        startDate.second(0)
        startDate.millisecond(0)
        let endDate = moment(timeRecord.date)
        endDate.hour(timeRecord.endTime.split(':'[0]))
        endDate.minute(timeRecord.endTime.split(':'[1]))
        endDate.second(0)
        endDate.millisecond(0)
        timeEntries.push({
          start: startDate.toDate(),
          end: endDate.toDate(),
          users: timeRecord.employees,
          notes: timeRecord.notes,
        })
      })
      return timeEntries
    },
    clearSignPad() {
      console.log(this.signaturePad.id)
      this.signaturePad.pad.clear()
      this.signaturePad.data = null
      this.signaturePad.saved = false
      this.signaturePad.hidePreview = true
    },
    onResize() {
      this.signaturePad.width = window.innerWidth - 64
    },
    async publish(draftStatus) {
      this.$root.$emit('showLoading')
      this.isLoading = true
      try {
        await this.uploadSignPad()
        let data = this.buildReportData(draftStatus)
        let report_data = await this.$store.dispatch('api/post', {
          url: '/reports/customer_service/',
          data,
        })
        if (this.inventory.length) {
          await this.$store.dispatch('api/post', {
            url: `/reports/${report_data.id}/inventory/`,
            data: this.inventory,
          })
        }
        if (this.timeRecords.length) {
          let timeRecords = this.buildTimeRecords()
          if (timeRecords.length > 1) {
            await this.$store.dispatch('api/post', {
              url: `/reports/${report_data.id}/time_entry/`,
              data: timeRecords,
            })
          } else {
            await this.$store.dispatch('api/post', {
              url: `/reports/${report_data.id}/time_entry/`,
              data: timeRecords[0],
            })
          }
        }
        this.$root.$emit('showToast', {
          type: 'success',
          text: `CSQR for ${this.job.company.name} has been saved.`,
        })
        this.overrideBeforeLeave = true
        this.$root.$emit('hideLoading')
        this.$router.push({ name: 'reports-csqr' })
      } catch (err) {
        console.log(err)
        this.$root.$emit('hideLoading')
        this.isLoading = false
      }
    },
    async saveSignPad() {
      if (!this.signaturePad.pad.isEmpty()) {
        this.signaturePad.saved = true
        this.signaturePad.data = this.signaturePad.pad.toDataURL()
      }
    },
    togglePreview() {
      this.signaturePad.hidePreview = !this.signaturePad.hidePreview
    },
    async uploadSignPad() {
      if (this.signaturePad.data) {
        let arr = this.signaturePad.data.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }

        let signFile = new File([u8arr], 'test.png', { type: mime })

        let signData = await this.$store.dispatch('api/sign', {
          file: signFile,
          company: this.job.company.name,
          client: this.job.clientName,
        })

        if (signData) {
          this.signaturePad.id = signData.id
        }
      }
    },
  },
  created() {
    if (!this.$route.params.pkg) {
      this.overrideBeforeLeave = true
      this.$router.push({ name: 'reports-csqr-new' })
    } else {
      this.timeRecords.forEach((record) => {
        record.formattedDate = moment(record.date).format('ddd MMMM D')
        record.employeeNames = record.employees.map((employeeID) => {
          let employeeObj = this.$store.state.team.members.find((employee) => {
            return employee.id == employeeID
          })
          return `${employeeObj.first_name} ${employeeObj.last_name}`
        })
      })
    }
  },
  mounted() {
    this.signaturePad.canvas = document.querySelector('#client-signature-pad')
    this.signaturePad.pad = new SignaturePad(this.signaturePad.canvas)
    this.signaturePad.width = window.innerWidth - 64
    this.signaturePad.pad.penColor = 'rgb(44, 122, 123)'
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
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
