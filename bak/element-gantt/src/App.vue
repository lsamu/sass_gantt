<template>
  <div id="app">
    <!-- <DatePicker v-model="today"></DatePicker> -->
    <div style="text-align: right; margin: 20px;">
      <el-button-group>
        <el-button
          size="medium"
          :type="timeType === 'year'? 'primary': 'normal'"
          @click="timeType = 'year'"
        >年</el-button>
        <el-button
          size="medium"
          :type="timeType === 'quarter'? 'primary': 'normal'"
          @click="timeType = 'quarter'"
        >季</el-button>
        <el-button
          size="medium"
          :type="timeType === 'month'? 'primary': 'normal'"
          @click="timeType = 'month'"
        >月</el-button>
        <el-button
          size="medium"
          :type="timeType === 'week'? 'primary': 'normal'"
          @click="timeType = 'week'"
        >周</el-button>
        <el-button
          size="medium"
          :type="timeType === 'day'? 'primary': 'normal'"
          @click="timeType = 'day'"
        >日</el-button>
      </el-button-group>
    </div>

    <!-- <ElementGantt v-show="timeType === 'day'"
                  :tableData="tableData"
                  timeType="day"
                  :columns="columns"
                  @dragend="handleResized"
    @resized="handleResized" />-->
    <ElementGanttA
      :tableData="tableData"
      :timeType="timeType"
      :columns="columns"
      @dragend="handleResized"
      @resized="handleResized"
      style="margin: 20px;"
    />

    <!-- <ElementGanttA :tableData="tableData"
                   timeType="day"
                   v-show="timeType === 'day'"
                   :columns="columns"
                   @dragend="handleResized"
                   @resized="handleResized" />
    <ElementGanttA :tableData="tableData"
                   timeType="month"
                   v-show="timeType === 'month'"
                   :columns="columns"
                   @dragend="handleResized"
                   @resized="handleResized" />
    <ElementGanttA :tableData="tableData"
                   timeType="year"
                   v-show="timeType === 'year'"
                   :columns="columns"
                   @dragend="handleResized"
                   @resized="handleResized" />
    <ElementGanttA :tableData="tableData"
                   timeType="week"
                   v-show="timeType === 'week'"
                   :columns="columns"
                   @dragend="handleResized"
    @resized="handleResized" />-->
    <antdSelect :defaultValue="selectValue" @change="handleChange"></antdSelect>
  </div>
</template>

<script>
import ElementGanttA from './components/ElementGanttAntd.vue'
import ElementGantt from './components/ElementGantt.vue'
import DatePicker from './components/DatePicker'
import antdSelect from './components/antdSelect'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ElementGantt,
    // eslint-disable-next-line vue/no-unused-components
    ElementGanttA,
    DatePicker,
    antdSelect
  },
  data () {
    return {
      tableData: [],
      timeType: 'day',
      value: '2020-02-02',
      today: dayjs(),
      columns: [
        {
          label: 'WBS项目',
          width: 200,
          prop: 'title',
          slot: 'text',
          fixed: true
        },
        {
          label: '负责人',
          width: 100,
          prop: 'id',
          fixed: true,
          slot: 'user'

        },

        {
          label: '项目开始时间',
          width: 100,
          prop: 'startTime',
          fixed: true,
          slot: 'time'

        },
        {
          label: '项目结束时间',
          width: 100,
          prop: 'endTime',
          fixed: true,
          slot: 'time'
        },
        {
          label: '项目进度',
          width: 100,
          prop: 'percent',
          slot: 'process',
          fixed: true

        }
      ],
      selectValue: [{
        'key': 'yuxi',
        'label': '于汐',
        'userId': 'yuxi',
        'userEmail': 'YUXI@ENN.CN',
        'userMobilePhone': '17610708677',
        'userNumber': '10077479',
        'userName': '于汐',
        'orgPartName': '数字技术赋能群/系统建设赋能群/新奥股份系统建设赋能群'}

      ],

      option: [
        {
          'key': 'zhaolixia',
          'label': '赵丽侠',
          'userId': 'zhaolixia',
          'userEmail': 'ZHAOLIXIA@ENN.CN',
          'userMobilePhone': '18032612985',
          'userNumber': '19300087',
          'userName': '赵丽侠',
          'orgPartName': '客户认知与产品发展赋能群（客品赋能群）'
        }

      ]
    }
  },
  created () {
    this.tableData = [
      {
        title: 'WBS1WBS1WBS1WBS1WBS1WBS1WBS1WBS1WBS1WBS1WBS1WBS1WBS1WBS1',
        id: 1,
        startTime: dayjs().startOf('month').add(0, 'day'),
        endTime: dayjs().endOf('month').add(2, 'month'),
        author: 'Alex',
        percent: 100,
        children: [
          {
            title: 'WBS11',
            id: 11,
            startTime: dayjs().add(3, 'days'),
            endTime: dayjs().add(12, 'days'),
            author: 'Alex',
            percent: 40
          },
          {
            title: 'WBS12',
            id: 12,
            startTime: dayjs(),
            endTime: dayjs().add(1, 'months'),
            author: 'Alex',
            percent: 40
          }
        ]
      },
      {
        title: 'WBS2',
        id: 2,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'months'),
        author: 'Alex',
        percent: 40,
        children: [
          {
            title: 'WBS21',
            id: 21,
            startTime: dayjs(),
            endTime: dayjs().add(1, 'days'),
            author: 'Alex',
            percent: 40
          },
          {
            title: 'WBS22',
            id: 22,
            startTime: dayjs(),
            endTime: dayjs().add(1, 'months'),
            author: 'Alex',
            percent: 40
          }
        ]
      },
      {
        title: 'WBS3',
        id: 3,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'months'),
        author: 'Alex',
        percent: 40,
        children: [
          {
            title: 'WBS31',
            id: 31,
            startTime: dayjs(),
            endTime: dayjs().add(1, 'days'),
            author: 'Alex',
            percent: 40,
            children: [
              {
                title: 'WBS311',
                id: 311,
                startTime: dayjs(),
                endTime: dayjs().add(1, 'days'),
                author: 'Alex',
                percent: 40
              }
            ]
          },
          {
            title: 'WBS32',
            id: 32,
            startTime: dayjs(),
            endTime: dayjs().add(1, 'months'),
            author: 'Alex',
            percent: 40
          }
        ]
      }
    ]

    // setTimeout(() => {
    //   this.value = new Date(2021, 1, 1)
    // }, 1000)

    let startTime = dayjs('2020-7-1')
    let endTime = dayjs().endOf('year')
    let offset = endTime.diff(startTime, 'day')
    console.log('offset: ', offset)
  },
  methods: {
    handleChange (val) {
      this.selectValue = val
    },
    handleSelect (arg) {
      console.log(arguments)
    },
    dateChange (val) {
      this.value = val
      console.log(arguments)
    },
    handleResized (row) {
      console.log(row)
      this.tableData = this.resizeData(row, this.tableData)
    },
    resizeData (row, list) {
      return list.map(l => {
        if (l.id === row.id) {
          console.log('metch')
          return row
        } else {
          if (l.children) {
            l.children = this.resizeData(row, l.children)
          }
          return l
        }
      })
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
