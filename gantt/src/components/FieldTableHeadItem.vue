<template>
  <resizable class="header-item" :left="0" :minLeft="0" :maxLeft="0" :active="['r']" :width="localColumn.width"
    @resize:start="resizeMove" @resize:move="resizeMove">
    <div :style="{ width: localColumn.width + 'px' }">
      <div class="cell">
        {{ localColumn.label }}
      </div>
    </div>
  </resizable>
</template>

<script>
import resizable from './vue-resizable.vue'

export default {
  components: { resizable },
  name: 'FieldTableHeadItem',
  props: {
    column: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {

  },
  watch: {
    column: {
      immediate: true,
      handler() {
        this.localColumn = JSON.parse(JSON.stringify(this.column))
      }
    }
  },
  data() {
    return {
      localColumn: {}
    }
  },
  methods: {
    resizeMove(arg) {
      this.$emit('sizeChange', arg)
    }
  }
}
</script>

<style></style>
