<template>
  <div class="today-column-line" :style="style"></div>
</template>

<script>
export default {
  name: 'TodayColumnLine',
  props: {
    timeType: {
      type: String,
      default() {
        return 'day' // week month year
      }
    },
    cellWidth: {
      type: Number,
      default() {
        return 50
      }
    },
    offsetX: {
      type: Number,
      default() {
        return 50
      }
    },
  },
  computed: {
    style() {
      let lineWidth = this.cellWidth / 4
      if (this.timeType === 'year') {
        lineWidth = this.cellWidth / 40
      } else if (this.timeType === 'month') {
        lineWidth = this.cellWidth / 15
      } else if (this.timeType === 'week') {
        lineWidth = this.cellWidth / 7
      }
      lineWidth = Math.max(lineWidth, 4)
      let left = this.offsetX + 'px'
      if (this.timeType === 'day') {
        left = (this.offsetX + (this.cellWidth - lineWidth) / 2) + 'px'
      } else if (this.timeType === 'week') {
        left = (this.offsetX + 2) + 'px'
      }
      return {
        left: left,
        width: lineWidth + 'px'
      }
    }
  },
  data() {
    return {
      lineWidth: 10
    }
  }
}
</script>

<style>
.today-column-line {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  background-color: #ffa94189;
}
</style>