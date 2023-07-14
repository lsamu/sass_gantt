<template>

  <el-popover popper-class="cell-user-search"
              placement="bottom"
              title="修改用户"
              width="400"
              trigger="click">
    <div>
      <div style="margin:  20px 0;">
        <el-input v-model="input"
                  :autofocus="true"
                  placeholder="请输入内容"></el-input>
        <div class="result"></div>

      </div>

      <div class="cell-user-search-group">
        <el-button disabled>取消</el-button>
        <el-button type="primary"
                   style="margin-left: 20px;"
                   disabled>确定</el-button>
      </div>

    </div>

    <span slot="reference"
          class="cell-label">
      {{row[field.prop]}}
    </span>
  </el-popover>

</template>

<script>
export default {
  name: 'CellProcess',
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    },
    field: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      input: ''
    }
  },
  watch: {
    row: {
      immediate: true,
      handler () {
        this.input = this.row[this.field.prop]
      }
    }
  },
  methods: {

  }

}
</script>

<style >
.cell-user-search-calender .el-calendar-table .el-calendar-day {
  height: initial;
  text-align: center;
  padding: 4px;
}
.cell-user-search-calender .el-calendar-table th {
  text-align: center;
}
.cell-user-search-group {
  text-align: right;
}
.cell-user-search .result {
  height: 300px;
}
</style>