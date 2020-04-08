export function toast_loding(_this, msg) {
  _this.$toast.loading({
    mask: true,
    forbidClick: true,
    duration: 0,
    message: msg || "加载中..."
  });
}


// del
export function _del_item(selt, params, fun, ) {
  let Url = ''
  selt.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    util.ajax.post(Url, params).then(res => {
      console.log(res)
      if (res.data.respHead.respCode === "000") {
        selt.$message({
          type: 'success',
          message: '删除成功!'
        })
        fun()
      } else {
        selt.$message.error(`${res.data.respHead.respMsg}`)
      }
    })
  }).catch(() => {
    selt.$message({
      type: 'info',
      message: '已取消删除'
    });
  });
  // selt.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  //   center: true
  // }).then(() => {
  //   // 确认删除时触发
  //   util.ajax.post(Url, params).then((res) => {
  //     console.log(res)
  //     if (res.data.respHead.respCode === "000") {
  //       selt.$message({
  //         type: 'success',
  //         message: '删除成功!'
  //       })
  //       fun()
  //     } else {
  //       selt.$message.error(`${res.data.respHead.respMsg}`)
  //     }
  //   })

  // }).catch(() => {
  //   // 取消删除时触发
  //   selt.$message({
  //     type: 'info',
  //     message: '已取消删除'
  //   });
  // });
}