<template>
  <div style="top: 20vh; width: 1400px; height: 500px; padding-left: 5vw">
    <x-gantt ref="ganttRef" data-id="index" :data="ganttData" :links="ganttLinks" :border-color="borderColor"
      show-checkbox :show-expand="showExpand" :expand-all="expandAll" :show-today="true" :show-weekend="true"
      :unit="(unit as any)" :dark="isDark" :draggable="draggable" @row-click="onClickRow" @row-dbl-click="onDblClickRow"
      @row-checked="onCheckedRow" @move-slider="onMoveSlider" @add-link="onAddLink" @click-link="onClickLink"
      @no-date-error="onNoDateError">
      <x-gantt-column label="group1">
        <x-gantt-column prop="index" width="120px" :column-style="{ 'background-color': 'yellow' }"></x-gantt-column>
        <x-gantt-column label="group2">
          <x-gantt-column prop="name" :merge="(scope: any) => scope.$index % 3 === 0"></x-gantt-column>
          <x-gantt-column prop="name2" :merge="scope => scope.$index! % 2 === 0">n1</x-gantt-column>
        </x-gantt-column>
      </x-gantt-column>

      <div>div</div>

      <x-gantt-column v-slot="scope" label="起始日期">
        {{ scope.row.startDate.getMonth() + 1 }}-{{
          scope.row.startDate.getDate()
        }}
        {{ scope.row.startDate.getHours() }}:{{
          scope.row.startDate.getMinutes()
        }}
      </x-gantt-column>

      <x-gantt-column label="结束日期" prop="endDate" date-format="MM-dd HH:mm:ss" ellipsis>
        <template #default="scope">
          <DatePicker v-model="scope.row.endDate" @click.stop />
        </template>
      </x-gantt-column>

      <x-gantt-slider prop="o.t1" :move="onMove" resize-left resize-right linked-resize progress>
        <template #left>
          <div style="width: 4px; height: 100%; background-color: aqua"></div>
        </template>
      </x-gantt-slider>
    </x-gantt>
  </div>

  <div>
    共{{ ganttData.length }}条
    <button @click="onAdd">增加</button>
    <button @click="onReduce">减少</button>
    <button @click="onEmpty">清空</button>
    <button @click="onReload">重新赋值</button>
    <button @click="() => (draggable = !draggable)">拖拽</button>
    <button @click="onExpand">{{ showExpand ? '隐藏' : '展示' }}</button>
    <button @click="onExpandAll">
      {{ expandAll ? '闭合' : '展开' }}
    </button>
    <button @click="onChangeBorderColor">border颜色</button>
    <button @click="changeUnit">切换单位</button>
    <button @click="jumpToDate">跳转到</button>
    <button @click="setSelected">设置选择</button>
    <button @click="setDark">{{ isDark ? '浅色' : '深色' }}</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import DatePicker from './components/DatePicker.vue';

let id = 0;

const ganttData = reactive([
  {
    name: "",
    index: 2,
    type: 1,
    startDate: new Date('2022-02-19'),
    endDate: new Date('2022-07-24'),
    children: [
      {
        index: '20000001',
        startDate: new Date('2022-03-09'),
        endDate: new Date('2022-07-17'),
        children: [
          {
            index: '2000000101',
            startDate: new Date('2022-03-09'),
            endDate: new Date('2022-07-17'),
            children: []
          },
          {
            index: '2000000102',
            startDate: new Date('2022-03-09'),
            endDate: new Date('2022-06-19'),
            children: []
          }
        ]
      }
    ]
  }
]);

let linkId = 1;
const ganttLinks = reactive([
  {
    index: linkId++,
    from: 1,
    to: 2,
    color: 'green'
  },
  {
    index: linkId++,
    from: 2,
    to: 5
  },
  {
    index: linkId++,
    from: 4,
    to: 2,
    color: 'red'
  },
  {
    index: linkId++,
    from: 4,
    to: 3,
    color: '#abc'
  }
]);

const draggable = ref(false);

const showExpand = ref(true);
function onExpand() {
  showExpand.value = !showExpand.value;
}
const expandAll = ref(true);
function onExpandAll() {
  expandAll.value = !expandAll.value;
}

const isDark = ref(false);
function setDark() {
  isDark.value = !isDark.value;
}

const colors = [
  '#eca710',
  '#e31010',
  '#2196F3',
  '#ff0000',
  '#4CAF50',
  '#FFC107'
];
const borderColor = ref('');
function onChangeBorderColor() {
  borderColor.value = colors[Math.floor(Math.random() * colors.length)];
}

const unit = ref('day');
const changeUnit = () => {
  const u = ['month', 'week', 'day', 'hour'];
  unit.value = u[(u.indexOf(unit.value) + 1) % u.length];
  console.log('unit', unit.value);
};

function onAdd() {
  ganttData.push({
    index: ++id,
    name: 't' + id,
    startDate: new Date(2023, 4, id),
    endDate: new Date(2023, 4, id + 5),
    o: { t1: 'a', t2: 'b' }
  });
}

function onReduce() {
  ganttData.splice(ganttData.length - 1, 1);
}

function onEmpty() {
  ganttData.length = 0;
}

function onReload() {
  ganttData.length = 0;
  for (let i = 0; i < 10; i++) {
    onAdd();
  }
}

const onClickRow = (data: any) => {
  console.log('click row', data);
};

const onDblClickRow = (data: any) => {
  console.log('dblclick row', data);
};

const onCheckedRow = (state: boolean, data: any) => {
  console.log('checked row', state, data);
};

const onMoveSlider = (data: any) => {
  console.log('move slider', data);
};

const onAddLink = (
  link: any,
  data: { from: any; to: any },
  cb: (link: any) => void
) => {
  const _link = {
    index: linkId++,
    from: link.from,
    to: link.to,
    color: 'green'
  };
  ganttLinks.push(_link);

  console.log('add link', _link, data, ganttLinks);
  cb(_link);
};

const onClickLink = (link: any | null) => {
  console.log('click link', link);

  if (link) {
    setTimeout(() => {
      ganttLinks.splice(
        ganttLinks.findIndex(l => l.from === link.from && l.to === link.to),
        1
      );
      console.log('remove link', ganttLinks);
    }, 1000);
  }
};

function onMove(data: any) {
  return data.level !== 1;
}

const onNoDateError = (date: Date) => {
  console.log('no date error', date);
};

const ganttRef = ref(null);
function jumpToDate() {
  ganttRef.value?.jumpToDate();
}
function setSelected() {
  const s = ganttRef.value?.setSelected(ganttData[0]);
  console.log('setSelected', s);
}

let id2 = 0;

const ganttData2 = reactive<any>([]);

function onAdd2() {
  ganttData2.push({
    index: ++id2,
    name: 't' + id2,
    startDate: new Date(2023, 5, id2),
    endDate: new Date(2023, 5, id2 + 5),
    o: { t1: 'a', t2: 'b' }
  });
}

for (let i = 0; i < 10; i++) {
  onAdd2();
}

</script>

<style scoped></style>
