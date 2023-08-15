<template>
  <a-select v-model="selectValue" mode="multiple" style="width: 100%" placeholder="输入用户名" option-label-prop="label"
    :labelInValue="true" @search="fetchUser" :filterOption="handleFilter" @dropdownVisibleChange="handleVisibleChange">
    <a-select-option v-for="(item) in option" :key="item.key" :value="item.key" :label="item.label">
      <span role="img" aria-label="China">🇨🇳</span>
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  props: {
    defaultValue: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      valueChange: false,
      selectValue: [],
      option: []
    }
  },
  computed: {

  },
  watch: {
    defaultValue: {
      immediate: true,
      handler() {
        this.pushDefaultToOption()
      }
    },
    selectValue() {
      // this.handleChange()
      this.valueChange = true
    }
  },
  methods: {
    findObj(key) {
      // 在option中查找数据
      return this.option.find(o => {
        return o.userId === key
      })
    },
    findObjFromDefault(key) {
      // 在defaultValue中查找数据
      return this.defaultValue.find(o => {
        return o.userId === key
      })
    },
    handleVisibleChange(visible) {
      if (!visible) {
        this.handleChange()
      }
    },
    handleChange() {
      let value = []

      if (this.valueChange) {
        // 数据变化提交数据
        this.selectValue.map(s => {
          let obj = this.findObj(s.key) || this.findObjFromDefault(s.key)
          if (obj) {
            value.push(obj)
          }
        })
        this.$emit('change', value)
      } else {
        this.pushDefaultToOption()
      }
    },
    handleFilter(inputValue, option) {
      // 数据筛选
      let obj = this.findObj(option.key)
      if (obj && (obj.userName.indexOf(inputValue) >= 0 || obj.userNumber.indexOf(inputValue) >= 0 || obj.userId.indexOf(inputValue) >= 0)) {
        return true
      } else {
        return false
      }
    },
    fetchUser() {
      // 出发搜素接口
      this.option = [
        {
          'key': 'zhaolixia',
          'label': '赵丽侠',
          'userId': 'zhaolixia',
          'userEmail': 'ZHAOLIXIA@ENN.CN',
          'userMobilePhone': '18032612985',
          'userNumber': '19300087',
          'userName': '赵丽侠',
          'orgPartName': '客户认知与产品发展赋能群（客品赋能群）'
        },
        {
          'key': 'zhaolixia1',
          'label': '赵丽侠1',
          'userId': 'zhaolixia1',
          'userEmail': 'ZHAOLIXIA@ENN.CN',
          'userMobilePhone': '18032612985',
          'userNumber': '193000871',
          'userName': '赵丽侠1',
          'orgPartName': '客户认知与产品发展赋能群（客品赋能群）'
        }
      ]
    },
    pushDefaultToOption() {
      // 默认使用传入数据作为option
      this.option = []
      this.valueChange = false
      this.selectValue = this.defaultValue
      this.defaultValue.map(d => {
        d.key = d.userId
        d.label = d.userName
        let exist = this.option.find(o => {
          return o.key === d.key
        })
        if (!exist) {
          this.option.push(d)
        }
      })
    }
  }
}
</script>

<style></style>
