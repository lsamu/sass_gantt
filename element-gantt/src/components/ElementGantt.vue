
<script>
/* eslint-disable no-unused-vars */
import jQuery from 'jquery'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
export default {
  name: 'ElementGantt',
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
    }
  },
  data () {
    return {
      cellWidth: 30, // 单元格宽度
      barHeight: 20, // 进度条高度
      resizeWidth: 20, // resize组件宽度
      handleType: '',
      busy: false,
      optionRow: null,
      startPoint: null,
      target: null,
      timeColumns: []
    }
  },
  computed: {},
  watch: {
    tableData () {
      this.getTimeColumns()
    },
    timeType () {
      this.getTimeColumns()
    }
  },
  created () {
    this.getTimeColumns()
  },
  methods: {
    getYearWeek (a, b, c) {
      var date1 = new Date(a, parseInt(b) - 1, c)
      var date2 = new Date(a, 0, 1)
      var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
      return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7)
    },
    getTimeColumns () {
      // 日期表头
      // 表头
      let columns = []
      let timeInterval = this.getTimeIntervalFromList(this.tableData)
      let startTime = timeInterval[0] // 最小日期
      let endTime = timeInterval[1] // 最大日期
      let count = endTime.diff(startTime, this.timeType)
      let dayColumns = []
      let monthColumns = []
      let yearColumns = []
      let weekColumns = []
      for (var d = 0; d < count + 1; d++) {
        let val = startTime.add(d, 'day')
        dayColumns.push({
          label:
              this.timeType === 'week'
                ? this.getYearWeek(
                  val.format('YYYY'),
                  parseInt(val.format('MM')) + 1,
                  val.format('DD')
                ).toString()
                : val.format('YYYY-MM-DD'),
          width: this.cellWidth,
          prop: val.format('YYYY-MM-DD'),
          slot: 'day',
          isBar: true,
          className: 'is-bar is-day'
        })
      }
      let monthCount = endTime.diff(startTime, 'month')
      for (var m = 0; m < monthCount + 1; m++) {
        let val = startTime.add(m, 'month')
        let children = dayColumns
          .filter(d => {
            return d.prop.indexOf(val.format('YYYY-MM')) === 0
          })
          .map(d => {
            d.label = d.label.split('-').pop()
            return d
          })
        monthColumns.push({
          label: val.format('YYYY-MM'),
          width: this.cellWidth * 10,
          prop: val.format('YYYY-MM'),
          slot: 'month',
          isBar: true,
          className: 'is-bar is-month',
          children: children
        })
      }

      let yearCount = endTime.diff(startTime, 'year')
      for (var j = 0; j < yearCount + 1; j++) {
        let val = startTime.add(j, 'year')
        let children = monthColumns
          .filter(d => {
            return d.prop.indexOf(val.format('YYYY')) === 0
          })
          .map(d => {
            d.label = d.label.split('-').pop()
            return d
          })

        if (this.timeType === 'day') {
          // 按日
        }

        yearColumns.push({
          label: val.format('YYYY'),
          width: this.cellWidth * 50,
          prop: val.format('YYYY'),
          slot: 'year',
          isBar: true,
          className: 'is-bar is-year',
          children: children
        })
      }
      console.log('setTimeColumns')
      if (this.timeType === 'day') {
        this.timeColumns = yearColumns
      } else if (this.timeType === 'month') {
        this.timeColumns = yearColumns.map(d => {
          d.children.map(dd => {
            delete dd.children
            return dd
          })
          return d
        })
      } else if (this.timeType === 'year') {
        this.timeColumns = yearColumns.map(d => {
          delete d.children
          return d
        })
      } else {
        this.timeColumns = yearColumns
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
    getTimeIntervalFromList (data) {
      // 获取最大时间间隔
      // console.log(arguments)
      let startTime = null
      let endTime = null
      data.map(l => {
        startTime = this.minTime(startTime, l.startTime)
        endTime = this.maxTime(endTime, l.endTime)
        if (l.children && l.children > 0) {
          let listTimes = this.getTimeIntervalFromList(l.children)
          startTime = this.minTime(startTime, listTimes[0])
          endTime = this.maxTime(endTime, listTimes[1])
        }
      })
      return [startTime, endTime]
    },
    getOffsetColumn (row) {
      // 获取横跨行数
      return dayjs(row.endTime).diff(dayjs(row.startTime), this.timeType) + 1
    },
    getBarWidth (row) {
      // 获取进度条宽度
      return this.getOffsetColumn(row) * this.cellWidth
    },
    spanMethod ({ row, column }) {
      // console.log(row, column)
      if (
        this.timeType === 'day' &&
          column.property === dayjs(row.startTime).format('YYYY-MM-DD')
      ) {
        let offset = this.getOffsetColumn(row) // 233
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
        let offsetColumn = Math.round(offsetX / this.cellWidth)
        // console.log(Math.abs(offsetColumn))
        if (Math.abs(offsetColumn) === 0) {
          // 重置宽度
          let tempWidth = this.getBarWidth(this.optionRow)
          this.target.childNodes[0].style.width = `${tempWidth}px`
          this.target.childNodes[1].style.left = `${tempWidth -
              this.resizeWidth}px`
          let colspan = Math.round(tempWidth / this.cellWidth)
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
        let offsetColumn = Math.round(offsetX / this.cellWidth)
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
        if (tempWidth > this.cellWidth) {
          this.target.childNodes[0].style.width = `${tempWidth}px`
          this.target.childNodes[1].style.left = `${tempWidth -
              this.resizeWidth}px`
          let colspan = Math.round(tempWidth / this.cellWidth)
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
    },
    getBarEl (createElement, scope) {
      // 进度条EL
      let row = scope.row
      if (scope.column.property === dayjs(row.startTime).format('YYYY-MM-DD')) {
        let offset = this.getOffsetColumn(row)
        // console.log(row.title, dayjs(row.startTime).format('YYYY-MM-DD'), offset)
        return createElement(
          'span',
          {
            class: 'bar',
            style: {
              height: this.barHeight + 'px',
              width: '100%',
              transform: `translateX(0px)`
            },
            on: {},
            attrs: {}
          },
          [
            createElement('span', {
              class: 'bar-inner',
              style: {
                width: this.getBarWidth(row) + 'px',
                height: this.barHeight + 'px'
              },
              attrs: {},
              on: {
                mousedown: evt => this.handleDragMouseDown(evt, row)
              },
              domProps: { innerHTML: scope.row.title }
            }),
            createElement('span', {
              class: 'bar-resize',
              style: {
                width: this.resizeWidth + 'px',
                height: this.barHeight + 'px',
                left: offset * this.cellWidth - this.resizeWidth + 'px'
              },
              attrs: {},
              on: {
                mousedown: evt => this.handleResizeMouseDown(evt, row)
              }
            })
          ]
        )
      } else if (
        scope.column.property === dayjs(row.startTime).format('YYYY-MM')
      ) {
        let offset = this.getOffsetColumn(row)
        return createElement(
          'span',
          {
            class: 'bar',
            style: {
              height: this.barHeight + 'px',
              width: '100%',
              transform: `translateX(0px)`
            },
            on: {},
            attrs: {}
          },
          [
            createElement('span', {
              class: 'bar-inner',
              style: {
                width: this.getBarWidth(row) + 'px',
                height: this.barHeight + 'px'
              },
              attrs: {},
              on: {
                mousedown: evt => this.handleDragMouseDown(evt, row)
              },
              domProps: { innerHTML: scope.row.title }
            }),
            createElement('span', {
              class: 'bar-resize',
              style: {
                width: this.resizeWidth + 'px',
                height: this.barHeight + 'px',
                left: offset * this.cellWidth - this.resizeWidth + 'px'
              },
              attrs: {},
              on: {
                mousedown: evt => this.handleResizeMouseDown(evt, row)
              }
            })
          ]
        )
      } else {
        return createElement('span', {
          class: 'bar',
          style: {
            height: this.barHeight + 'px',
            width: '100%'
          },
          on: {},
          attrs: {}
        })
      }
    },
    getYearEl (createElement, scope) {
      return createElement(
        'span',
        {
          class: 'is-year',
          style: {},
          on: {},
          attrs: {}
        },
        'test'
      )
    },
    getColumnEl (createElement, scope) {
      if (scope.slot) {
        if (scope.slot === 'expend') {
          // 展开列
          return createElement('el-table-column', {
            props: scope,
            class: {
              isBar: scope.isBar,
              isField: !scope.isBar
            },
            scopedSlots: {
              default: scope => this.getExpendEl(createElement, scope)
            }
          })
        } else if (scope.children) {
          let children = [] // scope.children.map(cc => this.getColumnEl(createElement, cc))
          return createElement(
            'el-table-column',
            {
              props: scope,
              class: {
                isBar: scope.isBar,
                isField: !scope.isBar
              }
            },
            children
          )
        } else {
          return createElement('el-table-column', {
            props: scope,
            class: {
              isBar: scope.isBar,
              isField: !scope.isBar
            },
            scopedSlots: {
              // default: (scope) => this.getBarEl(createElement, scope),
              // header: (scope) => this.getYearEl(createElement, scope)
            }
          })
        }
      } else {
        return createElement('el-table-column', {
          props: scope
        })
      }
    },
    findParentEl (el, type) {
      // 获取父节点标签
      if (el.parentNode && el.parentNode.tagName === type) {
        return el.parentNode
      } else if (el.parentNode) {
        return this.findParentEl(el.parentNode, type)
      } else {
        return null
      }
    },
    getClassLevel (tr) {
      let className = tr.className.split(' ')
      let level = className
        .find(c => {
          return c.indexOf('el-table__row--level') === 0
        })
        .split('-')
        .pop()
      return parseInt(level)
    },
    checkChildrenRow (el, level) {
      let isChildren = false
      if (el && el.className) {
        let cLevel = this.getClassLevel(el)
        isChildren = cLevel > level
      }
      return isChildren
    },
    getChildrenRow (tr, level) {
      let childrenNodes = []
      // console.log(level)
      // console.log(tr.nextSibling.className.indexOf('el-table__row--level-' + level))
      while (this.checkChildrenRow(tr.nextSibling, level)) {
        childrenNodes.push(tr.nextSibling)
        tr = tr.nextSibling
      }
      return childrenNodes
    },
    getExpendEl (createElement, scope) {
      // console.log(scope)
      return createElement(
        'span',
        {
          class: 'expend',
          style: {},
          on: {
            click: evt => {
              // console.log('expend', evt)
              let tr = this.findParentEl(evt.target, 'TR')
              let level = this.getClassLevel(tr)
              let childrenNodes = this.getChildrenRow(tr, level)
              let className = tr.className.split(' ')
              if (
                childrenNodes.length > 0 &&
                  tr.className.indexOf('expanded') >= 0
              ) {
                // 关闭
                childrenNodes.map(c => {
                  c.style.display = 'none'
                })
                className = className.filter(c => {
                  return c !== 'expanded'
                })
                tr.className = className.join(' ')
              } else {
                // 展开
                childrenNodes.map(c => {
                  c.style.display = 'table-row'
                })
                if (tr.className.indexOf('expended') < 0) {
                  className.push('expanded')
                  tr.className = className.join(' ')
                }
              }
              // console.log(childrenNodes)
              // if (tr && tr.nextSibling) {
              //   if (tr.nextSibling.style.display && tr.nextSibling.style.display === 'none') {
              //     tr.nextSibling.style.display = 'table-row'
              //   } else {
              //     tr.nextSibling.style.display = "none"

              //   }
              // }
            }
          },
          attrs: {}
        },
        scope.row.id
      )
    },
    getTable (createElement) {}
  },

  render: function (createElement) {
    console.log('render')
    let columns = this.columns.concat(this.timeColumns)
    let children = columns.map(c => {
      return this.getColumnEl(createElement, c)
    })
    // console.log('getTable')
    return createElement(
      'el-table',
      {
        props: {
          data: this.tableData,
          highlightCurrentRow: false,
          rowKey: this.rowKey,
          border: true,
          treeProps: { children: 'children', hasChildren: 'hasChildren' },
          defaultExpandAll: true,
          spanMethod: this.spanMethod
        },
        nativeOn: {
          mousemove: evt => this.handleResizeMouseMove(evt),
          mouseup: evt => this.handleResizeMouseUp(evt)
        }
      },
      children
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">
  .el-table .is-bar {
    padding: 0;
  }
  .el-table .is-bar .cell {
    position: relative;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .bar {
    display: inline-block;
    position: relative;
    height: 100%;
    z-index: 1;
    color: white;
  }
  .bar-inner {
    position: absolute;
    background-color: rebeccapurple;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
  }
  .bar-resize {
    position: absolute;
    background-color: blue;
    top: 0;
    bottom: 0;
    z-index: 101;
  }
  /* td {
            background-color: transparent !important;
          }
          tr.hover-row .current-row td {
            background-color: transparent !important;
          } */
  .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
  .el-table__header .is-year {
    text-align: center;
  }
  .el-table__header .is-month {
    text-align: center;
  }
  .el-table__header .is-day {
    text-align: center;
  }
</style>
