<template>
  <div class="tudan-modal" v-show="mdShow">
    <!--下面是弹框 -->
    <div class="tudan-modal-inner" :style="style">
      <div class="md_top">
        <div class="md_top_title">{{title}}</div>
        <div class="icon_Box">
          <i class="el-icon-close" @click="closeModal"></i>
        </div>
      </div>
      <div class="md-content">
        <slot name="md-content"></slot>
        <!-- <div class="confirm-tips"></div> -->
        <!-- <div class="flex btn-line-top"></div> -->
      </div>
    </div>
    <div class="md-overlay" v-if="mdShow" @click="closeModals"></div>
  </div>
</template>

<script>
import { pcaa } from "area-data";
export default {
  props: {
    title: {
      type: String
    },
    mdShow: {
      type: Boolean,
      default: false
    },
    is_overlay: {//点击遮罩是否取消
      type: Boolean,
      default: false
    },
    width: {
      type: Number
    }
  },
  created() {
  },
  computed: {
    style() {
      return {
        width: `${this.width}%!important`
      }
    }
  },
  components: {

  },
  data() {
    return {
      arrow_code: 0,
      address: [],
      pcaa: pcaa,
      submitData: {
        receiver: '',
        address: '',
        city: '',
        cityName: '',
        district: '',
        distName: '',
        id: '',
        phone: '',
        province: '',
        provName: '',
        expressNO: '',
        userNo: '',
      }
    }
  },
  methods: {
    // 关闭弹窗
    closeModal() {
      this.$emit('closeModal')
    },
    closeModals() {
      if (this.is_overlay) {
        this.$emit('closeModal')
      }
    },
    // 提交 
    submitDetermine() {
      console.log(this.submitData)
      this.$emit('transfer_submit', this.submitData)
    }
  },
  filters: {
    arrow_filter(val) {
      return val === 0 ? "↑" : "↓"
    }
  }
}
</script>

<style lang="scss">
.tudan-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  // top: 50%;
  // left: 50%;
  // transform: translate3d(-50%, -50%, 0);

  .tudan-modal-inner {
    z-index: 2000;
    position: relative;
    margin: 0 auto 50px;
    border: 2px solid #cccccc;
    font-size: 14px;
    padding: 3px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    min-width: 700px;
    min-height: 300px;
    color: #000;
    .md-content {
      width: 100%;
      height: 100%;
      // padding: 0 10px;
      box-sizing: border-box;
      padding-top: 20px;
      padding-right: 10px;
      .area-selected-trigger {
        display: flex;
        align-items: center;
      }
      .demo-ruleForm {
        padding: 10px 0;
      }
    }
    .md_top {
      width: 100%;
      height: 40px;
      line-height: 40px;
      // position: absolute;
      // top: 0px;
      background: linear-gradient(to right, #45c0dd, #41cacb);
      color: #fff;
      .md_top_title {
        padding-left: 20px;
        font-size: 16px;
      }
      .icon_Box {
        position: absolute;
        top: 2px;
        right: 6px;
        font-size: 28px;
        cursor: pointer;
        color: #ccc;
      }
    }
    .item {
      padding: 0 10px;
      .lines {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        & > p {
          width: 100%;
          height: 100%;
          color: #000;
        }
        .Names {
          display: inline-block;
          text-align: center;
          min-width: 90px;
          font-size: 14px;
          color: #000;
        }
        .el-input {
          width: 70%;
        }
        .area-cascader-wrap {
          width: 70%;
          .area-select {
            -webkit-appearance: none;
            background-color: #fff;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            height: 40px;
            line-height: 40px;
            outline: 0;
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            width: 100%;
          }
          .cascader-menu-list-wrap {
            top: 35px !important;
          }
        }
      }
    }
    .btn-wrap {
      display: flex;
      justify-content: center;
      padding-bottom: 10px;
      .el-button {
        width: 30%;
      }
    }
  }
  .md-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .ecg_up_table {
    width: 100%;
    max-height: 300px;
    overflow: auto;
    margin-bottom: 20px;
    .el-table__header {
      // width: 100%;
    }
  }
  .tudan-modal-inner .md_top .icon_Box {
    color: #fff;
  }
  .el-table .el-table__row .cell > p {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ecg-end-2 {
    display: flex;
    margin-bottom: 10px;
    & > div {
      flex: 1;
    }
    .Names {
      display: inline-block;
      text-align: right;
      width: 100px;
      font-size: 14px;
      color: #000;
    }
  }
  .btn-line-top {
    border-top: 1px solid darkgrey;
  }
  .flex {
    display: flex;
  }
  .flex-0-30 {
    flex: 0 0 30%;
  }
  .flex-0-10 {
    flex: 0 0 10%;
  }
  .ecg-btn-end {
    display: flex;
    flex: 0 0 70%;
    justify-content: space-between;
  }
  .bar-list {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .bar-show {
    width: 100%;
    background-color: #e4e4e4;
    height: 30px;
  }
  .bar-hide {
    position: absolute;
    left: -100%;
    top: 0px;
    height: 30px;
    width: 100%;
    background-color: red;
  }
  .tudan-btn-line-lwl {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #ddd;
    padding: 10px 0;
  }
  .tudan-line-lwl {
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }
  .tudan-flex {
    display: flex;
  }
  .tudan-flex-1-1 {
    & > div {
      flex: 1;
    }
  }
}
.md-show {
  display: none;
}
</style>
