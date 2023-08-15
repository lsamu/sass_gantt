<template>
  <el-popover popper-class="cell-time"
              placement="bottom"
              width="330"
              ref="popup"
              @show="handleShow"
              trigger="click">
    <div>
      <!-- <el-calendar class="cell-time-calender"
                   v-model="date"
                   @input="change"
                   ref="calendar">
      </el-calendar> -->
      <DatePicker v-model="date"
                  ref="datePicker"
                  style="padding: 0 0 20px;"></DatePicker>
      <div class="cell-time-group">
        <el-button size="medium"
                   @click="handleCancel">取消</el-button>
        <el-button type="primary"
                   size="medium"
                   style="margin-left: 20px;"
                   @click="handleOk">确定</el-button>
      </div>

    </div>

    <span slot="reference"
          class="cell-label">
      {{row[field.prop].format('YYYY-MM-DD')}}
    </span>
  </el-popover>

</template>

<script>
import DatePicker from "./DatePicker";
export default {
  components: { DatePicker },
  name: "CellTime",
  props: {
    row: {
      type: Object,
      default() {
        return {};
      }
    },
    field: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      date: new Date().getTime()
    };
  },
  watch: {
    row: {
      immediate: true,
      handler() {
        this.date = this.row[this.field.prop];
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.popup.showPopper = false;
      if (
        this.row[this.field.prop] &&
        this.date.format("YYYY-MM-DD") !=
          this.row[this.field.prop].format("YYYY-MM-DD")
      ) {
        this.$emit("change", this.date);
      }
    },
    handleCancel() {
      this.$refs.datePicker.refresh();

      this.$refs.popup.showPopper = false;
    },
    handleShow() {
      this.date = this.row[this.field.prop];
    }
  }
};
</script>

<style >
.cell-time-calender .el-calendar-table .el-calendar-day {
  height: initial;
  text-align: center;
  padding: 4px;
}
.cell-time-calender .el-calendar-table th {
  text-align: center;
}
.cell-time-group {
  text-align: right;
}
.cell-time .el-popover__title {
  display: none;
}
</style>