<template>
  <hyModal
      :showClose="true"
      v-if="uploadModalShow"
      :dialogVisible='uploadModalShow'
      title='专家列表'
      :ifSure="false"
      :ifCancle="false"
      :width='modelWidth'
      @closeHandle="closeHandle">
    <hyNewTable
        :ifHaveIndex="true"
        :column="column"
        v-if="tableHeight"
        :height="tableHeight"
        :tableData="tableData"
        :ifHaveCheckBox="false">
    </hyNewTable>
  </hyModal>
</template>

<script>
  import { columnConfig }from './config';

  export default {
    name: "expertsList",

    data() {
      return {
        column: columnConfig,
        tableHeight: 460,
        tableData: [],
      }
    },

    props: {
      uploadModalShow: {
        required: true,
        default: () => false,
        type: Boolean,
      },
      apiFn: {
        required: true,
        default: () => '',
        type: Function,
      },
      params: {
        required: false,
        default: () => {},
        type: Object,
      },
      modelWidth: {
        required: false,
        default: () => "720px",
        type: String,
      },
    },

    mounted() {
      this.getTableData();
    },

    methods: {
      closeHandle() {
        this.$emit('closeHandle')
      },

      getTableData() {
           this.m_apiFn(this.apiFn,this.params).then(resp => {
            if(resp.statusCode === '200') {
              this.tableData = resp.result
            }
          }).catch(() => {
        });
      
          
      },
    },
  }
</script>

<style scoped>

</style>