<template>
  <el-popover popper-class="cell-input" placement="bottom" class="cell-left" width="400" trigger="click">
    <div>
      <div style="margin:  20px 0;">
        <el-input v-model="input" :autofocus="true" placeholder="请输入内容"></el-input>

      </div>

      <div class="cell-input-group">
        <el-button disabled>取消</el-button>
        <el-button type="primary" style="margin-left: 20px;" disabled>确定</el-button>
      </div>

    </div>

    <span slot="reference" class="ellipsis-label">
      {{ row[field.prop] }}
    </span>
  </el-popover>
</template>

<script>
export default {
  name: 'CellInput',
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    field: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      input: ''
    }
  },
  watch: {
    row: {
      immediate: true,
      handler() {
        this.input = this.row[this.field.prop]
      }
    }
  },
  methods: {

  }

}
</script>

<style >
.cell-input-calender .el-calendar-table .el-calendar-day {
  height: initial;
  text-align: center;
  padding: 4px;
}

.cell-input-calender .el-calendar-table th {
  text-align: center;
}

.cell-input-group {
  text-align: right;
}

.cell-label.edit {
  cursor: pointer;
}

.ellipsis-label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
