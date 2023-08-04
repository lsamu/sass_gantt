<template>
  <div class="date-picker">
    <div class="header">
      <div class="day-select">
        <div class="left">
          <i @click="prevYear"
             class="el-icon-d-arrow-left"></i>
          <i v-if="type === 'day'"
             class="el-icon-arrow-left"
             @click="prevMonth"></i>

        </div>
        <div class="now">
          <span v-if="type==='year'"> {{headerYears}}</span>
          <span v-if="type !== 'year'"
                @click="type = 'year'"> {{this.startDate.format('YYYY')}}年</span>
          <span @click="type = 'month'"
                v-if="type === 'day'"> {{this.startDate.format('MM')}}月</span>
        </div>
        <div class="right">

          <i class="el-icon-arrow-right"
             v-if="type === 'day'"
             @click="nextMonth"></i>
          <i @click="nextYear"
             class="el-icon-d-arrow-right"></i>

        </div>
      </div>
    </div>
    <div class="container">
      <table v-if="type === 'day'"
             class="day-table">
        <thead>
          <th>日</th>
          <th>一</th>
          <th>二</th>
          <th>三</th>
          <th>四</th>
          <th>五</th>
          <th>六</th>
        </thead>
        <tbody>
          <tr v-for="(tr, index) in tableDays"
              :key="index">
            <td v-for="(td, tdIndex) in tr"
                :key="tdIndex"
                :class="{
                   out: td.date.format('MM') != startDate.format('MM') ,
                 active: selected && (td.date.format('YYYY-MM-DD') === selected.format('YYYY-MM-DD'))
                  }"
                @click="handleSelectDay(td)">
              <div class="cell"> {{td.label}}
              </div>
            </td>
          </tr>

        </tbody>
      </table>
      <table v-else-if="type === 'month'"
             class="month-table">

        <tbody>
          <tr>
            <td @click="handleSelectMonth(0)">
              一月
            </td>
            <td @click="handleSelectMonth(1)">
              二月
            </td>
            <td @click="handleSelectMonth(2)">
              三月
            </td>
            <td @click="handleSelectMonth(3)">
              四月
            </td>
          </tr>
          <tr>
            <td @click="handleSelectMonth(4)">
              五月
            </td>
            <td @click="handleSelectMonth(5)">
              六月
            </td>
            <td @click="handleSelectMonth(6)">
              七月
            </td>
            <td @click="handleSelectMonth(7)">
              八月
            </td>
          </tr>
          <tr>
            <td @click="handleSelectMonth(8)">
              九月
            </td>
            <td @click="handleSelectMonth(9)">
              十月
            </td>
            <td @click="handleSelectMonth(10)">
              十一月
            </td>
            <td @click="handleSelectMonth(11)">
              十二月
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else-if="type === 'year'"
             class="month-table">

        <tbody>
          <tr v-for="(tr, index) in tableYears"
              :key="index">
            <td v-for="(td, tdIndex) in tr"
                :key="tdIndex"
                @click="handleSelectYear(td)">
              {{td.label}}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
//var weekOfYear = require('dayjs/plugin/weekOfYear')

import weekOfYear from "dayjs/plugin/weekOfYear"

dayjs.extend(weekOfYear)
dayjs.locale('zh-cn')
export default {
  name: 'DatePicker',
  props: {
    value: {
      type: [Object, Number, String],
      default () {
        return dayjs()
      }
    }
  },
  data () {
    return {
      type: 'day',
      selected: dayjs(),
      startDate: dayjs()
    }
  },
  computed: {
    days () {
      let startDate = this.startDate.startOf('month')
      let endDate = this.startDate.endOf('month')
      if (endDate.day() === 0) {
        endDate = endDate.add(7, 'day')
      }
      startDate = startDate.startOf('week')
      endDate = endDate.endOf('week')
      let days = []
      let dateCount = endDate.diff(startDate, 'day')
      for (var i = -1; i < dateCount; i++) {
        let date = startDate.add(i, 'day')
        days.push({
          label: date.format('DD'),
          date: date,
          month: date.format('MM')
        })
      }
      return days
    },
    tableDays () {
      let result = []
      for (var i = 0; i < this.days.length; i += 7) {
        let row = this.days.slice(i, i + 7)
        result.push(row)
      }
      return result
    },
    years () {
      let result = []
      let year = this.startDate.year()
      year = Math.floor(year / 10) * 10
      for (var i = year; i < year + 10; i++) {
        result.push({
          label: i,
          date: dayjs(i)
        })
      }

      return result
    },
    tableYears () {
      let result = []
      for (var i = 0; i < this.years.length; i += 4) {
        let row = this.years.slice(i, i + 4)
        result.push(row)
      }
      return result
    },
    headerYears () {
      return this.years[0].label + '-' + this.years[this.years.length - 1].label
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.refresh()
      }
    }
  },
  methods: {
    refresh () {
      this.selected = dayjs(this.value)
      this.startDate = this.selected.startOf('month')
    },
    handleSelectDay (item) {
      if (item.date.month() !== this.startDate.month()) {
        this.startDate = item.date
      }
      // this.selected = item.date
      this.$emit('input', item.date)
    },
    handleSelectMonth (month) {
      this.startDate = this.startDate.month(month)
      this.type = 'day'
    },
    handleSelectYear (year) {
      this.startDate = this.startDate.year(year.label)
      this.type = 'month'
    },
    prevYear () {
      if (this.type !== 'year') {
        this.startDate = this.startDate.add(-1, 'year')
      } else {
        this.startDate = this.startDate.add(-10, 'year')

      }
    },
    prevMonth () {
      this.startDate = this.startDate.add(-1, 'month')

    },
    nextYear () {
      if (this.type !== 'year') {
        this.startDate = this.startDate.add(1, 'year')
      } else {
        this.startDate = this.startDate.add(10, 'year')

      }
    },
    nextMonth () {
      this.startDate = this.startDate.add(1, 'month')

    }
  }

}
</script>

<style>
.date-picker {
  display: inline-block;
  width: 300px;
  text-align: center;
}
.day-table,
.month-table,
.year-table {
  width: 100%;
}
.date-picker .container th {
  padding: 10px 0;
}
.date-picker .container td {
  cursor: pointer;
  text-align: center;
  padding: 10px 0;
}
.date-picker .container td.out {
  color: #c0c4cc;
}
.date-picker .container td .cell {
  margin: 0 auto;
  padding: 1px 3px;
}
.date-picker .container td.active .cell,
.date-picker .container td.active:hover .cell {
  display: inline-block;
  border-radius: 40px;
  background-color: #1989fa;
  color: white;
}
.date-picker .container td:hover {
  color: #1989fa;
}
.date-picker .header .now span {
  cursor: pointer;
}
.date-picker .header .now span:hover {
  color: #1989fa;
}
.date-picker .header .day-select {
  position: relative;
  margin: 10px 0;
}
.date-picker .header .day-select .left {
  position: absolute;
  left: 10px;
}
.date-picker .header .day-select .right {
  position: absolute;
  right: 10px;
  top: 0;
}
.date-picker .header .day-select i {
  cursor: pointer;
}
.date-picker .header .day-select i:hover {
  color: #1989fa;
}
</style>