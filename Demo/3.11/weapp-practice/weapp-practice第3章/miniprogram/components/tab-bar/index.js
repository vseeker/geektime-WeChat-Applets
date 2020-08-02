Component({
    properties: {
        idx: {
            type: Number,
            value: 0
        }
    },
    data: {
      selected: 0,
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
    observers: {
      "idx": function (id) {
        this.setData({ selected: id});
      }
    },
    methods: {
      goToTab: function(e){
        var url = e.currentTarget.dataset.url
        wx.navigateTo({
          url:url
        })
      }
    }
});