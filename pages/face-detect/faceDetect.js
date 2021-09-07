Page({
  data: {
    faceDetectInit: false,
    cameraCtx: null,
    cameraListener: null,
  },
  onLoad: function (options) {
    wx.initFaceDetect({
      success: () => {
        this.setData({
          faceDetectInit: true
        })
      },
      fail: () => {
        this.setData({
          faceDetectInit: false
        })
      }
    })

    let ctx = wx.createCameraContext();
    let faceDetectResult;
    let listener = ctx.onCameraFrame(result => {
      wx.faceDetect({
        frameBuffer: result.data,
        width: result.width,
        height: result.height,
        enablePoint: true,
        enableConf: true,
        success: res => {
          if (res.errCode === 0) {
            faceDetectResult = res;
          }
        },
        fail: e => {
          faceDetectResult = e
        }
      })
    });
    listener.start()

    let timer = setInterval(() => {
      this.setData({
        faceDetectResult
      })
    }, 500)
    this.setData({
      cameraCtx: ctx,
      cameraListener: listener,
      timer
    })
  },
  onShow() {
    this.data.cameraListener.start()
  },
  onHide() {
    this.data.cameraListener.stop()
  },
  onUnload() {
    clearInterval(this.timer)
  }
});
