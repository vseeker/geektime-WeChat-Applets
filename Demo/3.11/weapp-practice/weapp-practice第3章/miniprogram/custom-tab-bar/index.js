Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
list: [{
  pagePath: "/pages/3-10/index",
  iconPath: "/components/tab-bar/component.png",
  selectedIconPath: "/components/tab-bar/component-on.png",
  text: "index",
  iconClass:"icon-homefill",
  iconTopClass:""
}, {
  pagePath: "/pages/3-10/index2",
  iconPath: "/components/tab-bar/component.png",
  selectedIconPath: "/components/tab-bar/component-on.png",
  text: "index",
  iconClass:"cu-btn icon-add bg-green shadow",
  iconTopClass:"add-action"
},{
  pagePath: "/pages/3-10/index3",
  iconPath: "/components/tab-bar/component.png",
  selectedIconPath: "/components/tab-bar/component-on.png",
  text: "自定义",
  iconClass:"icon-my",
  iconTopClass:""
}]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})