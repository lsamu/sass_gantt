 
<script>
export default {
  name: 'Column',
  props: {
    config: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  render () {
    return (
      <el-table-column {{ ...config }}
      >
      </el-table-column>
    )
  }
}
</script>

<style>
</style>