<template>

  <span class="gantt-bar"
        :style="style">
    <span class="gantt-bar-inner"
          :style="innerStyle">

    </span>
    <span class="gantt-bar-process"
          :style="processStyle">

    </span>
    <!-- <img class="gantt-bar-process-img"
         :style="processImgStyle"
         src="../assets/process.png" /> -->

    <span class="gantt-bar-label"
          ref="label"
          :style="labelStyle"> {{item.title}}</span>
  </span>
</template>

<script>
export default {
  name: 'GanttBar',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: Number,
      default () {
        return 0
      }
    },
    left: {
      type: Number,
      default () {
        return 0
      }
    },
    scrollX: {
      type: Number,
      default () {
        return 0
      }
    },
    offsetX: {
      type: Number,
      default () {
        return 0
      }
    },
    barHeight: {
      type: Number,
      default () {
        return 0
      }
    },
    process: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      labelOffset: 10,
      labelOffsetX: 0

    }
  },
  computed: {
    style () {
      return {
        width: '100%', height: '100%', transform: `translateX(0px)`
      }
    },
    innerStyle () {
      return {
        width: this.width + 'px',
        height: this.barHeight + 'px',
        left: this.left + 'px',
        marginTop: -this.barHeight / 2 + 'px'
      }
    },
    processStyle () {
      return {
        width: Math.round(this.width * this.process / 100) + 'px',
        height: this.barHeight + 'px',
        left: this.left + 'px',
        marginTop: -this.barHeight / 2 + 'px'
      }
    },
    processImgStyle () {
      return {
        left: (this.left + Math.round(this.width * this.process / 100)) + 'px'
      }
    },
    labelStyle () {

      return {
        left: this.width + this.left + this.labelOffset + 'px',
        marginTop: `-${this.labelOffset}px`,
        // transform: this.labelOffsetX < 0 ? `translateX(${-this.labelOffsetX}px)` : `translateX(0px)`
      }
    }
  },
  watch: {
    scrollX () {
      this.refreshLabelOffsetX()
    }
  },
  methods: {
    refreshLabelOffsetX () {
      if (this.$el) {
        let rect = this.$el.getBoundingClientRect()
        // eslint-disable-next-line no-unused-vars
        this.labelOffsetX = rect.x - this.offsetX + this.width + this.labelOffset
        // this.$refs.label.style.opacity = this.labelOffsetX < 0 ? `0` : `1`
        // console.log(rect.x - this.offsetX + this.width + this.labelOffset)
      }
    }
  }
}
</script>

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
.gantt-bar {
  display: inline-block;
  position: relative;
  height: 100%;
  z-index: 1;
  color: white;
  margin-top: 3px;
}
.gantt-bar-inner {
  position: absolute;
  background-color: #fd998f;
  left: 0;
  top: 50%;
  bottom: 0;
  right: 0;
  z-index: 100;
}
.gantt-bar-process {
  position: absolute;
  background-color: #03a9f4;
  left: 0;
  top: 50%;
  bottom: 0;
  width: 0;
  z-index: 101;
}
.gantt-bar-label {
  position: absolute;
  left: 0;
  top: 50%;
  bottom: 0;
  z-index: 100;
  color: black;
}
.gantt-bar-resize {
  position: absolute;
  background-color: blue;
  top: 0;
  bottom: 0;
  z-index: 101;
}
.gantt-bar-process-img {
  position: absolute;
  top: 50%;
  z-index: 102;
  margin-left: -6px;
  margin-top: 4px;
  display: none;
}
.gantt-bar:hover .gantt-bar-process-img {
  display: inline-block;
}
</style>