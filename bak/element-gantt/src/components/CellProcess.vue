<template>

  <el-popover popper-class="cell-process"
              placement="bottom"
              title="修改进度"
              width="400"
              trigger="click">
    <div>
      <div style="margin: 0 20px;">
        <el-slider v-model="process"></el-slider>

      </div>

      <div class="cell-process-group">
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
      process: 20
    }
  },
  watch: {
  },
  methods: {

  }

}
</script>

<style >
.cell-process-calender .el-calendar-table .el-calendar-day {
  height: initial;
  text-align: center;
  padding: 4px;
}
.cell-process-calender .el-calendar-table th {
  text-align: center;
}
.cell-process-group {
  text-align: right;
}
</style>