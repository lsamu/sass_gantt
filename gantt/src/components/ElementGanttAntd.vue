<template>
  <div class="gantt"
       v-loading="localLoading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="container">
      <div class="field-table-container"
           :style="{
          marginLeft: fieldTableOpen ? '0px' : -fieldTableWidth + 'px'
        }">
        <el-table :data="tableData"
                  class="field-table"
                  rowKey="id"
                  @header-dragend="handleDragend"
                  :defaultExpandAll="true"
                  :border="true"
                  :highlightCurrentRow="false"
                  :spanMethod="spanMethod"
                  :treeProps="{ children: 'children', hasChildren: 'hasChildren' }"
                  :class="timeType"
                  :row-class-name="setRowName"
                  @cell-mouse-enter="fieldTrEnter"
                  @cell-mouse-leave="fieldTrLeave"
                  @expand-change="expendChange"
                  style="width: 100%">
          <el-table-column v-for="(field, fi) in columns"
                           :prop="field.prop"
                           :property="field.prop"
                           :key="fi"
                           :label="field.label"
                           fixed="left"
                           :resizable="fi !== 0"
                           :width="field.width"
                           class-name="is-field expend">
            <template slot-scope="scope">
              <CellTime v-if="field.slot === 'time'"
                        :row="scope.row"
                        @change="
                  time => {
                    scope.row[field.prop] = time;
                  }
                "
                        :field="field"></CellTime>
              <CellProcess v-else-if="field.slot === 'process'"
                           :row="scope.row"
                           :field="field"></CellProcess>

              <span class="expend-container"
                    v-else-if="field.slot === 'text'">
                <CellInput :row="scope.row"
                           :field="field"></CellInput>
                <el-popover placement="right"
                            width="200"
                            class="extend-inner"
                            trigger="click">
                  <div class="menu">
                    <p>上一级</p>
                    <p>下一级</p>
                    <p>升级</p>
                    <p>降级</p>
                    <p>结束</p>
                    <p>新增WBS</p>
                    <p @click.stop="scorllToDate(scope.row.startTime)">滚动到</p>
                  </div>
                  <span slot="reference"
                        class="title-cell">
                    <span class="deep">{{ scope.row.deep }}</span>
                    <i class="icon el-icon-more"></i>
                  </span>
                </el-popover>
              </span>

              <CellUserSearch v-else-if="field.slot === 'user'"
                              :row="scope.row"
                              :field="field"></CellUserSearch>
              <span v-else
                    :title="scope.row[field.prop]">{{ scope.row[field.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="opener"
             @click="fieldTableOpen = !fieldTableOpen"
             :style="{ left: fieldTableWidth + 'px' }">
          <div class="inner">
            <span class="block">
              <i class="el-icon-arrow-left"
                 :class="{ close: !fieldTableOpen }"></i>
            </span>
          </div>
        </div>
      </div>

      <div class="gantt-table-container"
           :style="{
          paddingLeft: fieldTableOpen ? fieldTableWidth + 'px' : '0px'
        }">
        <div class="warpper">
          <div class="warpper-inner">
            <table class="gantt-table"
                   :style="{ width: tableWidth + 'px' }"
                   cellspacing="0"
                   cellpadding="0">
              <colgroup>
                <col v-for="(item, index) in colgroups"
                     :key="index + '.' + item"
                     :width="item" />
              </colgroup>
              <thead>
                <tr v-for="(tr, index) in thColumns"
                    :key="index">
                  <th v-for="(th, thIndex) in tr"
                      :key="thIndex"
                      rowspan="1"
                      :title="getTitle(th, index)"
                      :colspan="th.offset"
                      :style="
                      index === 2
                        ? {
                            height: '0px',
                            border: 'none'
                          }
                        : {}
                    ">
                    <span class="th-span"
                          v-if="index !== 2"
                          :style="
                        index === 0
                          ? {
                              width:
                                th.offset *
                                  (timeType === 'week'
                                    ? localCellWidth / 7
                                    : localCellWidth) +
                                'px'
                            }
                          : {}
                      "
                          :class="{
                        today:
                          showToday &&
                          timeType === 'day' &&
                          th.prop === dayjs().format('YYYY-MM-DD')
                            ? true
                            : false
                      }">{{ getTitleCell(th, index) }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in deepData"
                    @mouseenter.stop="fieldTrEnter(item)"
                    @mouseleave.stop="fieldTrLeave(item)"
                    :key="index"
                    :class="[
                    { collapse: checkCollapse(item) },
                    item.rowKey,
                    'gantt-row'
                  ]">
                  <td v-for="(td, tdIndex) in getTds(item, thColumns)"
                      :key="tdIndex"
                      style="height: 48px;"
                      :colspan="getSpan(item, td)[1]">
                    <GanttBar v-if="
                        timeType === 'day' &&
                          td.prop === dayjs(item.startTime).format('YYYY-MM-DD')
                      "
                              :item="item"
                              :barHeight="barHeight"
                              :left="getBarLeft(item)"
                              :process="item.percent"
                              :scrollX="scrollX"
                              :offsetX="fieldTableOpen ? fieldTableWidth : 0"
                              :width="getBarWidth(item)"></GanttBar>

                    <GanttBar v-if="
                        timeType === 'week' &&
                          td.prop ===
                            dayjs(item.startTime)
                              .startOf('week')
                              .format('YYYY-MM-DD')
                      "
                              :item="item"
                              :left="getBarLeft(item)"
                              :process="item.percent"
                              :barHeight="barHeight"
                              :scrollX="scrollX"
                              :offsetX="fieldTableOpen ? fieldTableWidth : 0"
                              :width="getBarWidth(item)"></GanttBar>
                    <GanttBar v-if="
                        timeType === 'month' &&
                          td.prop === dayjs(item.startTime).format('YYYY-MM')
                      "
                              :item="item"
                              :left="getBarLeft(item)"
                              :process="item.percent"
                              :barHeight="barHeight"
                              :scrollX="scrollX"
                              :offsetX="fieldTableOpen ? fieldTableWidth : 0"
                              :width="getBarWidth(item)"></GanttBar>
                    <GanttBar v-if="
                        timeType === 'quarter' &&
                          td.prop.indexOf(
                            dayjs(item.startTime).format('YYYY-MM')
                          ) >= 0
                      "
                              :item="item"
                              :left="getBarLeft(item)"
                              :process="item.percent"
                              :barHeight="barHeight"
                              :scrollX="scrollX"
                              :offsetX="fieldTableOpen ? fieldTableWidth : 0"
                              :width="getBarWidth(item)"></GanttBar>
                    <GanttBar v-if="
                        timeType === 'year' &&
                          td.prop.indexOf(
                            dayjs(item.startTime).format('YYYY-MM')
                          ) >= 0
                      "
                              :item="item"
                              :left="getBarLeft(item)"
                              :process="item.percent"
                              :barHeight="barHeight"
                              :scrollX="scrollX"
                              :offsetX="fieldTableOpen ? fieldTableWidth : 0"
                              :width="getBarWidth(item)"></GanttBar>
                  </td>
                </tr>
              </tbody>
            </table>
            <TodayColumnLine v-if="showToday"
                             :offsetX="getOffsetX(dayjs())"
                             :cellWidth="localCellWidth"
                             :timeType="timeType"></TodayColumnLine>
          </div>
        </div>
      </div>
    </div>
    <div class="div-container">
      <div class="field-container"
           :style="{
          marginLeft: fieldTableOpen ? '0px' : -fieldTableWidth + 'px'
        }">
        <FieldTableHead :columns="localFieldColumns"
                        @sizeChange="headSizeChange"></FieldTableHead>

        <div class="body">
          <draggable v-model="localData"
                     :group="{ name: 'root' }">
            <FieldTableRow v-for="tr in localData"
                           :key="tr.id"
                           :item="tr"
                           :columns="localFieldColumns"></FieldTableRow>
          </draggable>
        </div>
        <div class="opener"
             @click="fieldTableOpen = !fieldTableOpen"
             :style="{ left: fieldTableWidth + 'px' }">
          <div class="inner">
            <span class="block">
              <i class="el-icon-arrow-left"
                 :class="{ close: !fieldTableOpen }"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="gantt-container"></div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import draggable from 'vuedraggable'

import { debounce } from '../utils/util'
import GanttBar from './GanttBar.vue'
import CellTime from './CellTime.vue'
import CellProcess from './CellProcess.vue'
import CellInput from './CellInput.vue'
import CellUserSearch from './CellUserSearch.vue'
import FieldTableRow from './FieldTableRow.vue'
import FieldTableHead from './FieldTableHead.vue'

import TodayColumnLine from './TodayColumnLine.vue'
import Sortable from 'sortablejs'

/* eslint-disable no-unused-vars */
import jQuery from 'jquery'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
//var weekOfYear = require('dayjs/plugin/weekOfYear')

import weekOfYear from "dayjs/plugin/weekOfYear"
dayjs.extend(weekOfYear)
dayjs.locale('zh-cn')
export default {
  name: 'ElementGanttA',
  // eslint-disable-next-line vue/no-unused-components
  components: {
    GanttBar,
    CellTime,
    CellProcess,
    CellInput,
    CellUserSearch,
    TodayColumnLine,
    Sortable,
    FieldTableRow,
    FieldTableHead,
    draggable
  },
  props: {
    tableData: Array,
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
    showToday: {
      type: Boolean,
      default () {
        return true
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      cellWidth: 50, // 单元格宽度
      barHeight: 10, // 进度条高度
      resizeWidth: 20, // resize组件宽度
      handleType: '',
      busy: false,
      optionRow: null,
      startPoint: null,
      target: null,
      timeColumns: [],
      deepColumns: [],
      thColumns: [],
      dayjs: dayjs,
      listData: [],
      deepData: [],
      offsetTime: {
        // 时间两端容限
        year: 1,
        quarter: 1,
        month: 1,
        week: 1,
        day: 10
      },
      autoWidth: true,
      cellWidths: {
        year: 1,
        quarter: 1,
        month: 100,
        week: 70,
        day: 50
      },
      expandRowKeys: [],
      localTableData: [],
      localFieldColumns: [],
      localLoading: false,
      hoverIndex: -1,
      fieldTableOpen: true,
      betterScroll: null,
      scrollX: 0,
      startTime: null,
      endTime: null,
      realStartTime: null,
      realEndTime: null,
      scrollLeft: 0,
      localData: []
    }
  },
  computed: {
    localCellWidth () {
      if (this.autoWidth) {
        return this.cellWidths[this.timeType]
      } else {
        return this.cellWidth
      }
    },

    localColumns () {
      let _columns = []
      _columns = _columns.concat(
        this.columns.map(c => {
          c.title = c.label
          return c
        })
      )

      _columns = _columns.concat(
        this.timeColumns.map(c => {
          c.title = c.label
          return c
        })
      )

      return _columns
    },
    leafColumns () {
      let leafColumns = []
      leafColumns = this.thColumns[this.thColumns.length - 1] || []
      return leafColumns
    },
    tableWidth () {
      let _tableWidth = 0
      this.leafColumns &&
          this.leafColumns.map(c => {
            _tableWidth += parseInt(c.width)
          })

      return _tableWidth
    },
    fieldTableWidth () {
      let _tableWidth = 0
      this.localFieldColumns &&
          this.localFieldColumns.map(c => {
            _tableWidth += parseInt(c.width)
          })

      return _tableWidth
    },
    colgroups () {
      if (this.timeType === 'week') {
        let groups = []
        this.leafColumns.map(c => {
          let dayWidth = c.width // parseInt((c.width / 7))
          groups.push(dayWidth)
          groups.push(dayWidth)
          groups.push(dayWidth)
          groups.push(dayWidth)
          groups.push(dayWidth)
          groups.push(dayWidth)
          groups.push(dayWidth)

          // groups.push(c.width - dayWidth * 6)
        })
        return groups
      } else {
        return this.leafColumns.map(c => {
          return c.width
        })
      }
    }
  },
  watch: {
    loading () {
      this.localLoading = this.loading
    },
    tableData: {
      immediate: true,
      handler () {
        this.setLocalData()
        this.getTimeColumns()
        this.getListData()
        this.$nextTick(() => {
          this.refreshScroll()
        })
        this.localData = JSON.parse(JSON.stringify(this.tableData))
      }
    },
    timeType () {
      if (this.betterScroll) {
        this.betterScroll.scrollTo(0, 0, 0)
        this.betterScroll.destroy()
      }
      this.getTimeColumns()
      this.getListData()

      this.$nextTick(() => {
        this.refreshScroll()
      })
    },
    timeColumns () {
      this.getListcolumns()
      this.getListData()
    },
    column: {
      immediate: true,
      handler () {
        this.setLocalColmns()
      }
    }
  },
  created () {
    this.getTimeColumns()
    this.getListData()
  },
  mounted () {
    setTimeout(() => {
      this.refreshScroll()
      // const table = document.querySelector('.el-table__fixed-body-wrapper tbody ')
      // const self = this
      // Sortable.create(table, {
      //   group: 'level-0',
      //   onFilter () {
      //     console.log(arguments)
      //   },
      //   onChoose () {
      //     console.log(arguments)
      //     return false

      //   },
      //   onEnd ({ newIndex, oldIndex }) {
      //     // const targetRow = self.resourceList.splice(oldIndex, 1)[0]
      //     // self.resourceList.splice(newIndex, 0, targetRow)

      //     console.log(newIndex, oldIndex)

      //   }
      // })
    }, 1000)
  },
  methods: {
    handleResize ({ width, height }) {
      console.log('resized', width, height)
    },
    headSizeChange (arg) {
      console.log(arg)
      // 表头宽度变化
      this.localFieldColumns[arg.index].width = arg.size.width
    },
    getTitleCell (th, index) {
      if (index === 1 && this.timeType === 'week') {
        return parseInt(th.label) + '周'
      } else {
        return th.label
      }
    },
    getTitle (th, index) {
      if (this.timeType === 'week') {
        return index === 0 ? th.label : parseInt(th.label) + '周'
      } else if (this.timeType === 'year') {
        return th.label
      } else if (this.timeType === 'quarter') {
        return th.label
      } else {
        return index === 0 ? th.label : th.prop
      }
    },
    refreshScroll () {
      // 刷新滚动条
      if (this.betterScroll) {
        // this.betterScroll.off('scroll', this._scroll)
        this.betterScroll.destroy()
      }
      let wrapper = document.querySelector('.warpper')
      let startX = -this.getOffsetX(this.realStartTime) + this.localCellWidth
      if (startX > 0) {
        startX = 0
      }
      startX = 0
      this.betterScroll = new BScroll(wrapper, {
        scrollX: true,
        startX: startX,
        bounce: false,
        probeType: 2
      })
      this.scrollX = this.getOffsetX(this.realStartTime) - this.localCellWidth
      // this.betterScroll.on('scroll', evt => {
      //   this._scroll(evt)
      // })
    },
    _scroll: debounce(function (evt) {
      // console.log(this)
      this.scrollX = -evt.x
      // console.log(arguments)
    }, 0),
    getTds (row, thColumns) {
      // 获取甘特图TD列表
      if (thColumns.length === 0) {
        return []
      }
      let offset = this.getOffsetColumn(row) // 233
      let tds = thColumns[thColumns.length - 1]
      if (
        this.timeType === 'week' ||
          this.timeType === 'year' ||
          this.timeType === 'quarter'
      ) {
        tds = thColumns[thColumns.length - 2]
      }
      tds = JSON.parse(JSON.stringify(tds))
      // console.log(tds)
      // tds.splice(0, thColumns[thColumns.length - 1].length - offset)
      return tds
      // return tds.splice(0, thColumns[thColumns.length - 1].length - offset + 1) //thColumns[thColumns.length - 1] //.splice(0, thColumns[thColumns.length - 1].length - offset)
    },
    setGanttRowClass (rowKey, className) {
      // 甘特图样式  处理Hover问题
      let items = document.getElementsByClassName(rowKey)
      for (var i = 0; i < items.length; i++) {
        let classNames = items[i].className.split(' ').filter(c => {
          return c !== className
        })
        classNames.push('hover')
        items[i].className = classNames.join(' ')
      }
    },
    removeGanttRowClass (rowKey, className) {
      let items = document.getElementsByClassName(rowKey)
      for (var i = 0; i < items.length; i++) {
        let classNames = items[i].className.split(' ').filter(c => {
          return c !== 'hover'
        })
        items[i].className = classNames.join(' ')
      }
    },
    fieldTrEnter (row) {
      this.setGanttRowClass(row.rowKey, 'hover')
    },
    fieldTrLeave (row) {
      this.removeGanttRowClass(row.rowKey, 'hover')
    },
    setLocalColmns () {
      // 设置表跟的本地配置
      this.localFieldColumns = JSON.parse(JSON.stringify(this.columns))
    },
    checkCollapse (item) {
      // 检查字段表格是否折叠
      let isCollapse = false
      this.expandRowKeys.map(e => {
        if (item.rowKey.indexOf(e + '-') >= 0) {
          isCollapse = true
        }
      })
      return isCollapse
    },
    setLocalData () {
      // 设置本地数据
      this.localTableData = this.tableData.map((t, ti) => {
        return this._setLocalData(t, 'task', '')
      })
    },
    _setLocalData (item, pKey, fullKey) {
      let key = pKey + '-' + item.id
      if (item.children) {
        item.children = item.children.map((c, ci) => {
          return this._setLocalData(c, key, fullKey + ' ' + key)
        })
      }
      item.rowKey = key
      item.fullKey = fullKey + ' ' + key
      return item
    },
    expendChange (item, expend) {
      // 字段表格折叠事件
      if (!expend) {
        this.expandRowKeys.push(item.rowKey)
      } else {
        this.expandRowKeys = this.expandRowKeys.filter(e => {
          return e !== item.rowKey
        })
      }
    },
    setRowName ({ row, rowIndex }) {
      return 'field-row ' + row.rowKey
    },
    handleDragend (newWidth, oldWidth, column, event) {
      // 字段表格多拽结束
      this.localFieldColumns = this.localFieldColumns.map(f => {
        if (f.prop === column.property) {
          f.width = newWidth
        }
        return f
      })
    },
    getListData () {
      this.deepData = []
      let maxDeep = this.getDeepData(this.localTableData, 0)
      this.listData = []
      for (var i = 1; i <= maxDeep + 1; i++) {
        this.listData[i - 1] = this.listData.filter(c => {
          return c.deep === i
        })
      }
    },
    getDeepData (columns, deep) {
      deep = deep || 0
      let maxDeep = deep
      let _columns = columns.map(c => {
        this.deepData.push(c)
        if (c.children && c.children.length > 0) {
          let childrenDeep = this.getDeepData(c.children, deep + 1)
          maxDeep = Math.max(maxDeep, childrenDeep)
          c.offset = 0
          c.children.map(cc => {
            c.offset += cc.offset || 1
          })
          c.offset = c.offset || 1
        } else {
          c.offset = 1
        }
        c.deep = deep + 1

        return c
      })
      return maxDeep
    },
    getListcolumns () {
      this.deepColumns = []
      let maxDeep = this.getDeepColumns(this.timeColumns, 0)
      this.thColumns = []
      for (var i = 1; i <= maxDeep + 1; i++) {
        this.thColumns[i - 1] = this.deepColumns.filter(c => {
          return c.deep === i
        })
      }
      if (this.timeType === 'week') {
        this.thColumns[this.thColumns.length - 1] = this.thColumns[
          this.thColumns.length - 1
        ].map(c => {
          c.offset = 7
          return c
        })
        this.thColumns[0] = this.thColumns[0].map(c => {
          let startDay = dayjs(c.prop).startOf('month')
          let endDay = dayjs(c.prop).endOf('month')
          if (startDay.diff(this.startTime) <= 0) {
            startDay = this.startTime
          }
          if (endDay.diff(this.endTime) >= 0) {
            endDay = this.endTime
          }

          c.offset = endDay.diff(startDay, 'days') + 1
          return c
        })
        let count = this.endTime.diff(this.startTime, 'day')
        this.thColumns[2] = []
        for (var j = 0; j < count; j++) {
          this.thColumns[2].push({
            offset: 1,
            title: '1',
            startTime: this.startTime.add(j, 'day'),
            width: this.localCellWidth / 7
          })
        }
      } else if (this.timeType === 'year' || this.timeType === 'quarter') {
        this.thColumns[1] = this.thColumns[1].map((c, index) => {
          let startDay = dayjs(c.prop[0]).startOf('month')
          let endDay = dayjs(c.prop[c.prop.length - 1]).endOf('month')
          if (startDay.diff(this.startTime) <= 0) {
            startDay = this.startTime
          }
          if (endDay.diff(this.endTime) >= 0) {
            endDay = this.endTime
          }
          c.offset = endDay.diff(startDay, 'day') + 1
          console.log(
            startDay.format('YYYY-MM-DD'),
            endDay.format('YYYY-MM-DD'),
            c.offset
          )
          return c
        })
        this.thColumns[0] = this.thColumns[0].map(c => {
          let startDay = dayjs(c.prop).startOf('year')
          let endDay = dayjs(c.prop).endOf('year')
          if (startDay.diff(this.startTime) <= 0) {
            startDay = this.startTime
          }
          if (endDay.diff(this.endTime) >= 0) {
            endDay = this.endTime
          }

          c.offset = endDay.diff(startDay, 'days') + 1
          return c
        })
        let count = this.endTime.diff(this.startTime, 'day')
        this.thColumns[2] = []
        for (var k = 0; k < count; k++) {
          this.thColumns[2].push({
            offset: 1,
            title: '1',
            startTime: this.startTime.add(k, 'day'),
            width: this.localCellWidth
          })
        }
      }
    },
    getDeepColumns (columns, deep) {
      deep = deep || 0

      let maxDeep = deep
      let _columns = columns
        .map(c => {
          if (c.children && c.children.length > 0) {
            let childrenDeep = this.getDeepColumns(c.children, deep + 1)
            maxDeep = Math.max(maxDeep, childrenDeep)
            c.offset = 0
            c.children.map(cc => {
              c.offset += cc.offset || 1
            })
            c.offset = c.offset || 1
          } else {
            c.offset = 1
          }
          c.deep = deep + 1

          return c
        })
        .sort((a, b) => {
          return a.deep - b.deep
        })
      this.deepColumns = this.deepColumns.concat(_columns)
      return maxDeep
    },
    getYearWeek (a, b, c) {
      var date1 = new Date(a, parseInt(b) - 1, c)
      var date2 = new Date(a, 0, 1)
      var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
      return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7)
    },
    getTimeColumns () {
      // console.log('getTimeColumns', this.timeType)
      // 日期表头
      // 表头
      let columns = []
      let timeInterval = this.getTimeIntervalFromList(this.tableData)
      let startTime = this.startTime // timeInterval[0] // 最小日期
      let endTime = this.endTime // timeInterval[1] // 最大日期
      let count = endTime.diff(startTime, this.timeType)

      let dayColumns = []
      let weekColumns = []
      let monthColumns = []
      let yearColumns = []

      // 周数
      if (this.timeType === 'week') {
        for (var w = 0; w < count + 1; w++) {
          let val = startTime.add(w * 7, 'day')
          dayColumns.push({
            label: val.format('YYYY-MM-') + val.week() + '周',
            width: this.localCellWidth,
            prop: val.format('YYYY-MM-DD'),
            slot: 'week',
            isBar: true,
            className: 'is-bar is-week',
            startTime: val.startOf('week'),
            endTime: val.endOf('week')
          })
        }
      }

      if (this.timeType === 'day') {
        // 天数
        for (var d = 0; d < count + 1; d++) {
          let val = startTime.add(d, 'day')
          dayColumns.push({
            label: val.format('YYYY-MM-DD'),
            width: this.localCellWidth,
            prop: val.format('YYYY-MM-DD'),
            slot: 'day',
            isBar: true,
            className: 'is-bar is-day',
            startTime: val.startOf('day'),
            endTime: val.endOf('day')
          })
        }
      }

      // 月数
      let monthCount = endTime
        .endOf('month')
        .diff(startTime.startOf('month'), 'month')

      for (var m = 0; m < monthCount + 1; m++) {
        let val = startTime.add(m, 'month')
        let children = dayColumns
          .filter(d => {
            return d.prop.indexOf(val.format('YYYY-MM')) === 0
          })
          .map(d => {
            d.label = dayjs(d.label).format('DD')
            d.title = d.label
            return d
          })
        monthColumns.push({
          label: val.format('YYYY-MM'),
          width: this.localCellWidth,
          prop: val.format('YYYY-MM'),
          slot: 'month',
          isBar: true,
          className: 'is-bar is-month',
          children: children,
          startTime: val.startOf('month'),
          endTime: val.endOf('month')
        })
      }

      // 年数
      let yearCount = endTime
        .endOf('year')
        .diff(startTime.startOf('year'), 'year')
      for (var j = 0; j < yearCount + 1; j++) {
        let val = startTime.add(j, 'year')
        let children = JSON.parse(JSON.stringify(monthColumns))
          .filter(d => {
            return d.prop.indexOf(val.format('YYYY')) === 0
          })
          .map(d => {
            d.label = d.label.split('-').pop()
            d.title = d.label
            return d
          })
        yearColumns.push({
          label: val.format('YYYY'),
          title: val.format('YYYY'),
          width: this.localCellWidth,
          prop: val.format('YYYY'),
          slot: 'year',
          isBar: true,
          className: 'is-bar is-year',
          children: children.map(c => {
            c.title = c.label
            return c
          }),
          startTime: val.startOf('year'),
          endTime: val.endOf('year')
        })
      }

      if (this.timeType === 'day') {
        this.timeColumns = monthColumns
      } else if (this.timeType === 'month') {
        this.timeColumns = yearColumns.map(d => {
          d.children.map(dd => {
            delete dd.children
            return dd
          })
          return d
        })
      } else if (this.timeType === 'quarter') {
        // 季度

        this.timeColumns = yearColumns.map(d => {
          delete d.children
          let val = d.startTime
          let props = [[], [], [], []]
          let year = val.startOf('day')

          for (var i = 0; i < 3; i++) {
            props[0].push(year.add(i, 'month').format('YYYY-MM'))
            props[1].push(year.add(i + 3, 'month').format('YYYY-MM'))
            props[2].push(year.add(i + 6, 'month').format('YYYY-MM'))
            props[3].push(year.add(i + 9, 'month').format('YYYY-MM'))
          }
          d.children = [
            {
              label: '1季度',
              width: this.localCellWidth,
              prop: props[0],
              slot: 'quarter',
              isBar: true,
              className: 'is-bar is-quarter',
              startTime: val.startOf('year'),
              endTime: val
                .startOf('year')
                .add(3, 'month')
                .startOf('day')
            },
            {
              label: '2季度',
              width: this.localCellWidth,
              prop: props[1],
              slot: 'quarter',
              isBar: true,
              className: 'is-bar is-quarter',
              startTime: val
                .startOf('year')
                .add(3, 'month')
                .startOf('day'),
              endTime: val
                .startOf('year')
                .add(6, 'month')
                .startOf('day')
            },
            {
              label: '3季度',
              width: this.localCellWidth,
              prop: props[2],
              slot: 'quarter',
              isBar: true,
              className: 'is-bar is-quarter',
              startTime: val
                .startOf('year')
                .add(6, 'month')
                .startOf('day'),
              endTime: val
                .startOf('year')
                .add(9, 'month')
                .startOf('day')
            },
            {
              label: '4季度',
              width: this.localCellWidth,
              prop: props[3],
              slot: 'quarter',
              isBar: true,
              className: 'is-bar is-quarter',
              startTime: val
                .startOf('year')
                .add(9, 'month')
                .startOf('day'),
              endTime: val.endOf('year')
            }
          ]
          return d
        })
      } else if (this.timeType === 'year') {
        this.timeColumns = yearColumns.map(d => {
          delete d.children
          let val = d.startTime
          let props = [[], []]
          let year = val.startOf('day')

          for (var i = 0; i < 6; i++) {
            props[0].push(year.add(i, 'month').format('YYYY-MM'))
            props[1].push(year.add(i + 6, 'month').format('YYYY-MM'))
          }
          d.children = [
            {
              label: '上半年',
              width: this.localCellWidth,
              prop: props[0],
              slot: 'halfyear',
              isBar: true,
              className: 'is-bar is-half-year',
              startTime: val.startOf('year'),
              endTime: val
                .startOf('year')
                .add(6, 'month')
                .startOf('day')
            },
            {
              label: '下半年',
              width: this.localCellWidth,
              prop: props[1],
              slot: 'halfyear',
              isBar: true,
              className: 'is-bar is-half-year',
              startTime: val.startOf('year').add(6, 'month'),
              endTime: val.endOf('year')
            }
          ]
          return d
        })
      } else {
        this.timeColumns = monthColumns
      }
    },
    maxTime (t1, t2) {
      if (t1) {
        return t1.diff(t2, 'millisecond') > 0 ? t1 : t2
      } else {
        return t2
      }
    },
    minTime (t1, t2) {
      if (t1) {
        return t1.diff(t2, 'millisecond') < 0 ? t1 : t2
      } else {
        return t2
      }
    },
    getOffsetX (date) {
      let localTimeType = this.timeType
      if (this.timeType === 'quarter' || this.timeType === 'year') {
        localTimeType = 'day'
      }
      let offsetTime = date.diff(this.startTime, localTimeType)

      // console.log('offsetTime', offsetTime)
      let offsetX =
          offsetTime * this.localCellWidth +
          this.getBarLeft({
            startTime: date
          })
      if (this.timeType === 'quarter' || this.timeType === 'year') {
        // offsetX += 2
        offsetX = offsetTime * this.localCellWidth
      }
      console.log('offsetX', offsetX)

      return offsetX
    },
    scorllToDate (date) {
      // 滚动到日期
      let offsetX = this.getOffsetX(date)
      this.$nextTick(() => {
        console.log(this.betterScroll, offsetX)
      })
      setTimeout(() => {
        this.betterScroll.scrollTo(-offsetX, 0, 1, 'easeing')
      }, 1000)
    },
    getTimeIntervalFromList (data, deep) {
      // 获取最大时间间隔
      // console.log(arguments)
      let startTime = null
      let endTime = null
      let realStartTime = null
      data.map(l => {
        startTime = this.minTime(startTime, l.startTime)
        realStartTime = this.minTime(startTime, l.startTime)
        endTime = this.maxTime(endTime, l.endTime)
        if (l.children && l.children > 0) {
          let listTimes = this.getTimeIntervalFromList(l.children, deep)
          startTime = this.minTime(startTime, listTimes[0])
          endTime = this.maxTime(endTime, listTimes[1])
          realStartTime = this.minTime(startTime, listTimes[0])
        }
      })
      // 增加显示容限

      if (!deep) {
        this.realStartTime = startTime
        let localTimeType = this.timeType

        if (localTimeType === 'quarter') {
          localTimeType = 'month'
          startTime = startTime.add(
            -this.offsetTime[this.timeType] * 3,
            localTimeType
          )
          endTime = endTime.add(
            this.offsetTime[this.timeType] * 3,
            localTimeType
          )
        } else {
          startTime = startTime.add(
            -this.offsetTime[this.timeType],
            localTimeType
          )
          endTime = endTime.add(this.offsetTime[this.timeType], localTimeType)
        }

        if (this.timeType === 'week') {
          startTime = startTime.startOf('month').startOf('week')
          endTime = endTime.endOf('month').endOf('week')
        } else if (this.timeType === 'quarter') {
          startTime = startTime.startOf('year')
          endTime = endTime.endOf('year')
        } else {
          startTime = startTime.startOf('month')
          endTime = endTime.endOf('month')
        }

        console.log([startTime, endTime])

        this.startTime = startTime
        this.endTime = endTime

        // this.scorllToDate(realStartTime)
      }

      return [startTime, endTime]
    },
    getOffsetColumn (row) {
      // 获取横跨行数
      return dayjs(row.endTime).diff(dayjs(row.startTime), this.timeType) || 1
    },
    getOffsetColumnByDay (row) {
      // 获取横跨行数
      let offsetTime =
          dayjs(row.endTime.add(1, 'day')).diff(dayjs(row.startTime), 'day') || 1
      if (this.timeType === 'year' || this.timeType === 'quarter') {
        // 半年
        // offsetTime = offsetTime
      } else if (this.timeType === 'month') {
        // if (offsetTime === 31) {
        //   offsetTime = 30
        // }
        offsetTime = offsetTime / 30
      } else if (this.timeType === 'week') {
        offsetTime = offsetTime / 7
      }
      return offsetTime
    },
    getMountDayCount (date) {
      return date
        .add(1, 'month')
        .startOf('month')
        .diff(date.startOf('month'), 'day')
    },
    getBarWidth (row) {
      // 获取进度条宽度
      // let offsetTime = row.startTime.diff(row.endTime.add(1, 'day'), this.timeType)
      let baseWidth = this.getOffsetColumnByDay(row) * this.localCellWidth // 单元格宽度
      console.log('baseWidth', row.title, baseWidth)
      if (this.timeType === 'month') {
        let startMonth = row.startTime.format('YYYY-MM')
        let endMonth = row.endTime.format('YYYY-MM')

        if (startMonth !== endMonth) {
          baseWidth = 0 // this.getOffsetColumnByDay(row) * this.localCellWidth
          let monthDayCount = this.getMountDayCount(row.startTime)
          baseWidth =
              (this.localCellWidth * (monthDayCount - row.startTime.date() + 1)) /
              monthDayCount

          let cursorMonth = dayjs(startMonth)
          while (cursorMonth.format('YYYY-MM') !== endMonth) {
            cursorMonth = cursorMonth.add(1, 'month')
            baseWidth += this.localCellWidth
          }
          baseWidth = baseWidth - this.localCellWidth
          let monthDayCount2 = this.getMountDayCount(row.endTime)
          baseWidth +=
              (this.localCellWidth * row.endTime.date()) / monthDayCount2
        } else {
          baseWidth = this.localCellWidth
        }
      } else if (this.timeType === 'year') {
      }
      // console.log('getBarWidth', offsetTime)
      return baseWidth
    },
    getBarLeft (row) {
      let offsetTime = -dayjs(row.startTime.startOf(this.timeType)).diff(
        dayjs(row.startTime),
        'day'
      )

      if (this.timeType === 'year') {
        // 半年
        if (row.startTime.month() < 6) {
        } else {
          offsetTime = -dayjs(row.startTime.month(6).startOf('month')).diff(
            dayjs(row.startTime),
            'day'
          )
        }
        // offsetTime = offsetTime / 183
      } else if (this.timeType === 'month') {
        if (offsetTime === 31) {
          offsetTime = 30
        }
        offsetTime = offsetTime / this.getMountDayCount(row.startTime)
      } else if (this.timeType === 'week') {
        offsetTime = offsetTime / 7
      } else if (this.timeType === 'quarter') {
        let cellStartTime = Math.floor(row.startTime.month() / 3) * 3
        cellStartTime = row.startTime.month(cellStartTime).startOf('month')
        offsetTime = row.startTime.diff(cellStartTime, 'day')

        // offsetTime = offsetTime / 183
      } else {
        offsetTime = 0
      }
      offsetTime = offsetTime * this.localCellWidth
      return parseFloat(offsetTime.toFixed(2))
    },
    getSpan (row, column) {
      // if (this.timeType === 'day' && column.prop === dayjs(row.startTime).format('YYYY-MM-DD')) {
      //   let offset = this.getOffsetColumn(row) // 233
      //   // console.log('spanMethod', [1, offset])

      //   return [1, offset]
      // } else if (this.timeType === 'month' && column.prop === dayjs(row.startTime).format('YYYY-MM')) {
      //   let offset = this.getOffsetColumn(row) // 233
      //   return [1, offset]
      // } else {
      //   return [1, 1]
      // }
      if (this.timeType === 'week') {
        return [1, 7]
      } else if (this.timeType === 'year') {
        let startDay = dayjs(column.prop[0]).startOf('month')
        let endDay = dayjs(column.prop[column.prop.length - 1]).endOf('month')
        if (startDay.diff(this.startTime) <= 0) {
          startDay = this.startTime
        }
        if (endDay.diff(this.endTime) >= 0) {
          endDay = this.endTime
        }
        let offsetCount = endDay.diff(startDay, 'day') + 1
        return [1, offsetCount]
      } else if (this.timeType === 'quarter') {
        console.log('getSpan quarter')
        let startDay = dayjs(column.prop[0]).startOf('month')
        let endDay = dayjs(column.prop[column.prop.length - 1]).endOf('month')
        if (startDay.diff(this.startTime) <= 0) {
          startDay = this.startTime
        }
        if (endDay.diff(this.endTime) >= 0) {
          endDay = this.endTime
        }
        let offsetCount = endDay.diff(startDay, 'day') + 1
        return [1, offsetCount]
      } else {
        return [1, 1]
      }
    },
    spanMethod ({ row, column }) {
      // console.log(column)
      if (
        this.timeType === 'day' &&
          column.property === dayjs(row.startTime).format('YYYY-MM-DD')
      ) {
        let offset = this.getOffsetColumn(row) // 233
        // console.log('spanMethod', [1, offset])

        return [1, offset]
      } else if (
        this.timeType === 'month' &&
          column.property === dayjs(row.startTime).format('YYYY-MM')
      ) {
        let offset = this.getOffsetColumn(row) // 233
        return [1, offset]
      } else {
        return [1, 1]
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleResizeEnd (row, offsetColumn) {
      // 重置宽度结束
      row.endTime = row.endTime.add(offsetColumn, 'day')
      this.$emit('resized', row)
    },
    handleDragEnd (row, offsetColumn) {
      // 任务移动结束
      row.startTime = row.startTime.add(offsetColumn, 'day')
      row.endTime = row.endTime.add(offsetColumn, 'day')
      this.$emit('dragend', row)
    },

    handleResizeMouseDown (evt, row) {
      evt.preventDefault()
      if (this.handleType === '') {
        // console.log('startResize')
        this.handleType = 'resize'
        this.busy = true
        this.optionRow = row
        this.target = evt.target.parentNode
        this.startPoint = {
          x: evt.x,
          y: evt.y
        }
      }
    },
    handleDragMouseDown (evt, row) {
      evt.preventDefault()
      if (this.handleType === '') {
        // console.log('startDrag')
        this.handleType = 'drag'
        this.busy = true
        this.optionRow = row
        this.target = evt.target.parentNode
        this.startPoint = {
          x: evt.x,
          y: evt.y
        }
      }
    },
    handleResizeMouseUp (evt) {
      evt.preventDefault()
      if (this.handleType === 'resize') {
        let offsetX = evt.x - this.startPoint.x
        let offsetColumn = Math.round(offsetX / this.localCellWidth)
        // console.log(Math.abs(offsetColumn))
        if (Math.abs(offsetColumn) === 0) {
          // 重置宽度
          let tempWidth = this.getBarWidth(this.optionRow)
          this.target.childNodes[0].style.width = `${tempWidth}px`
          this.target.childNodes[1].style.left = `${tempWidth -
              this.resizeWidth}px`
          let colspan = Math.round(tempWidth / this.localCellWidth)
          this.target.parentNode.parentNode.setAttribute('colspan', colspan)
        } else {
          this.handleResizeEnd(this.optionRow, offsetColumn)
        }
        this.handleType = ''
        this.busy = false
        this.optionRow = null
        // console.log('up')
      } else if (this.handleType === 'drag') {
        let offsetX = evt.x - this.startPoint.x
        let offsetColumn = Math.round(offsetX / this.localCellWidth)
        if (Math.abs(offsetColumn) === 0) {
          this.target.style.transform = `translateX(0px)`
        } else {
          this.handleDragEnd(this.optionRow, offsetColumn)
        }
        this.handleType = ''
        this.busy = false
        this.optionRow = null
        // console.log('up')
      }
    },
    handleResizeMouseMove (evt) {
      if (this.handleType === 'resize') {
        evt.preventDefault()
        // console.log('up', evt.x, '-', evt.y)
        let offsetX = evt.x - this.startPoint.x
        let tempWidth = this.getBarWidth(this.optionRow) + offsetX
        // console.log(this.target)
        if (tempWidth > this.localCellWidth) {
          this.target.childNodes[0].style.width = `${tempWidth}px`
          this.target.childNodes[1].style.left = `${tempWidth -
              this.resizeWidth}px`
          let colspan = Math.round(tempWidth / this.localCellWidth)
          this.target.parentNode.parentNode.setAttribute('colspan', colspan)
        }
        // this.target.style.transform = `translateX(${offsetX}px)`
        // console.log(offsetX)
      } else if (this.handleType === 'drag') {
        evt.preventDefault()
        // console.log('up', evt.x, '-', evt.y)
        let offsetX = evt.x - this.startPoint.x
        this.target.style.transform = `translateX(${offsetX}px)`
        // console.log(offsetX)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">
.gantt th.is-field {
  padding: 18px 0;
}
.gantt .is-field .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.gantt .year th.is-field {
}
.gantt .month th.is-field {
}
.gantt .week th.is-field {
}
.gantt .day th.is-field {
  /* padding: 30px 0; */
}
.gantt-table-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-left: 500px;
  overflow: auto;
}
.container {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.gantt-table {
  font-size: 14px;
  color: #909399;
}
.gantt-table thead tr {
  border-top: 1px solid #ebeef5;
}
.gantt-table tr.collapse {
  display: none;
}

.gantt-table th {
  height: 30px;
  background-color: white;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.gantt-table th {
}
.gantt-table th .th-span {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  line-height: 27px;
  vertical-align: middle;
}
.gantt-table th .th-span.today {
  background-color: #ffa94189;
  border-radius: 40px;
  color: white;
  width: 22px;
  height: 22px;
  display: inline-block;
  line-height: 22px;
  vertical-align: middle;
}
.gantt-table td {
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid white;
  border-top: 1px solid white;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.field-table tr:hover {
  background-color: #f7f7f7;
}

.field-table tr.hover {
  background-color: #f7f7f7;
}

.gantt-table tr.hover {
  background-color: #f7f7f7;
}

.field-table-container {
  position: relative;
}
.opener {
  position: absolute;
  width: 5px;
  top: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 100;
}
.opener:hover {
  background-color: #95ddff;
}
.opener .inner {
  height: 100%;
}
.opener .inner .block {
  position: absolute;
  display: inline-block;
  top: 50%;
  margin-top: -15px;
  width: 15px;
  height: 30px;
  left: 0;
  border: 1px solid #ebeef5;
  /* background: transparent; */
  cursor: pointer;
  line-height: 30px;
  vertical-align: middle;
  border-radius: 0 5px 5px 0;
}
.opener .inner .block i {
  transition: transform 0.2s ease-in;
}
.opener .inner .block i.close {
  transform: rotate(180deg);
}

.opener:hover .inner .block {
  border-color: #95ddff;
  background-color: #95ddff;
}
.opener:hover .inner .block i {
  color: white;
}
.cell-label {
  outline: none;
}
.cell-label.editable {
  cursor: pointer;
}
.warpper {
  text-align: left;
}
.warpper-inner {
  position: relative;
  display: inline-block;
  text-align: center;
}
</style>
<style >
.div-container {
  position: relative;
  overflow: hidden;
  zoom: 1;
  clear: both;
}
.div-container .field-container {
  position: relative;
  float: left;
  left: 0;
  top: 0;
}
.div-container .field-container .header {
  position: relative;
}
.div-container .field-container .header .header-item {
  display: inline-block;
  padding: 18px 0;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.div-container .field-container .header .header-item:first-child {
  border-left: 1px solid #ebeef5;
}
.div-container .field-container .header .header-item .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  font-weight: bold;
  color: #909399;
}
.div-container .field-container .body {
}
.div-container .field-container .body .row {
}
.div-container .field-container .body .column {
  display: inline-block;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.div-container .field-container .body .column:first-child {
  border-left: 1px solid #ebeef5;
}
.div-container .field-container .body .column .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  color: #909399;
  text-align: left;
}
.title-cell {
  float: right;
  cursor: pointer;
}
.title-cell .deep {
  display: inline;
}
.title-cell .icon {
  display: none;
}
.title-cell:hover .deep {
  display: none;
}
.title-cell:hover .icon {
  display: inline;
}
.el-table td.expend {
  position: relative;
  padding-right: 20px;
}
.is-field .extend-inner {
  /* display: flex; */

  position: absolute;
  top: 0;
  right: 0px;
}
.cell {
  position: relative;
}
</style>
