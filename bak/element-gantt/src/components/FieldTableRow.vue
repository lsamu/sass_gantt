<template>
  <div class="row">
    <div v-for="(column, index) in columns"
         :key="index"
         :style="{ width: column.width + 'px' }"
         class="column">
      <div class="cell">
        <span v-if="index === 0"
              :style=" { marginLeft: item.deep * 10 + 'px' }"></span>
        {{item[column.prop]}}
      </div>

    </div>
    <draggable v-model="localChildren"
               :group="{ name : item.rowKey}">
      <transition-group>

        <FieldTableRow v-for="(child) in localChildren"
                       :key="child.id"
                       :item="child"
                       :columns="columns"></FieldTableRow>
      </transition-group>
    </draggable>

  </div>

</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: { draggable },
  name: 'FieldTableRow',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    rowKey: {
      type: String,
      default () {
        return 'id'
      }
    },
    timeType: {
      type: String,
      default () {
        return 'day' // week month year
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
  },
  computed: {
    children () {
      return this.item.children || []
    }
  },
  watch: {
    children: {
      immediate: true,
      handler () {
        this.localChildren = JSON.parse(JSON.stringify(this.children))
      }
    }
  },
  data () {
    return {
      localChildren: []
    }
  },
  methods: {

  }
}
</script>

<style>
</style>