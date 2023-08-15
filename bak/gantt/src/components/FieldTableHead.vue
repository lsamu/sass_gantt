<template>
  <div class="header">
    <FieldTableHeadItem v-for="(column, index) in localColumns" :key="index" :column="column"
      @sizeChange="(size) => { $emit('sizeChange', { index: index, size: size }) }">

    </FieldTableHeadItem>

  </div>
</template>

<script>
import VueResizable from 'vue-resizable'
import FieldTableHeadItem from './FieldTableHeadItem.vue'
export default {
  components: { VueResizable, FieldTableHeadItem },
  name: 'FieldTableHead',
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {

  },
  watch: {
    columns: {
      immediate: true,
      handler() {
        this.localColumns = JSON.parse(JSON.stringify(this.columns))
      }
    }
  },
  data() {
    return {
      localColumns: []
    }
  },
  methods: {
    resizeMove() {
  
    }
  }
}
</script>

<style></style>
