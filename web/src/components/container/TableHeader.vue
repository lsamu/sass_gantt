<template>
  <table
    ref="tableHeaderRef"
    class="xg-table-header"
    :style="{
      height: `${$param.headerHeight}px`,
      color: $styleBox.headerStyle?.textColor,
      backgroundColor: $styleBox.headerStyle?.bgColor || $styleBox.primaryColor
    }"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <colgroup>
      <template v-for="(c, i) in $slotsBox.tableHeaders.leafs" :key="i">
        <col :width="c.width" />
      </template>
    </colgroup>
    <thead>
      <tr v-for="(r, trIndex) in $slotsBox.tableHeaders.headers" :key="trIndex">
        <TableHeaderTh v-for="(c, i) in r" :key="i" :column="c" />
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import useSlotsBox from '@/composables/useSlotsBox';
import useParams from '@/composables/useParam';
import TableHeaderTh from './TableHeaderTh.vue';
import useElement from '@/composables/useElement';
import { onMounted, onUpdated } from 'vue';
import useStyle from '@/composables/useStyle';

const { $slotsBox } = useSlotsBox();
const { $styleBox } = useStyle();

const { $param } = useParams();
const { tableHeaderRef, updateHeaderHeight } = useElement();
onMounted(updateHeaderHeight);
onUpdated(updateHeaderHeight);
</script>

<style lang="scss">
.xg-table-header {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  top: 0;
  position: sticky;
  z-index: 10;
  overflow: hidden;
}
</style>
