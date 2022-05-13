class Events {
  list = {}
  constructor() {
    this.list = {}
  }
  // 订阅方法
  listen(key, fn) {
    if (!this.list[key]) {
      this.list[key] = []
    }

    this.list[key].push(fn)
  }
  // 触发方法
  trigger(key, ...args) {
    let fns = this.list[key]
    fns &&
      fns.forEach((item) => {
        item.apply(this, args)
      })
  }
  // 移除订阅事件
  remove(key, fn) {
    // 移除所有事件
    if (!key) {
      this.list = []
    }
    let fns = this.list[key]
    if (!fns) {
      return false
    }
    if (!fn) {
      fns && (fns.length = 0)
    }
    fns = fns.filter((item) => item !== fn)
    this.list[key] = fns
  }
}

export default new Events()
