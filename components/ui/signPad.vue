<template>
  <div class="space-y-4 w-full" v-show="!saved">
    <canvas
      class="rounded border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
      :class="{
        'border-green-400': saved,
        'border-blue-400': !saved,
      }"
      id="client-signature-pad"
      :width="width"
      height="255"
    ></canvas>

    <div class="flex items-center w-full space-x-2">
      <ActionButton theme="danger" spacing="sm" class="w-1/4" @click="clear"
        >Clear</ActionButton
      >
      <ActionButton spacing="sm" class="w-3/4" @click="saveSignPad">
        Save
      </ActionButton>
    </div>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad'
import ActionButton from '@/components/ui/actionButton'
export default {
  name: 'SignPad',
  components: {
    ActionButton,
  },
  data() {
    return {
      canvas: null,
      container: null,
      data: null,
      hidePreview: true,
      pad: null,
      saved: false,
      width: 0,
    }
  },
  methods: {
    clear() {
      this.pad.clear()
      this.data = null
      this.saved = false
      this.hidePreview = true
    },
    onResize() {
      this.width = this.container.clientWidth
    },
    saveSignPad() {
      if (!this.pad.isEmpty()) {
        this.saved = true
        this.data = this.pad.toDataURL()
        this.$emit('save', this.data)
      }
    },
  },
  mounted() {
    this.canvas = document.querySelector('#client-signature-pad')
    this.container = this.canvas.parentElement
    this.pad = new SignaturePad(this.canvas)
    this.width = this.container.clientWidth
    this.pad.penColor = 'rgb(44, 122, 123)'
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
}
</script>
