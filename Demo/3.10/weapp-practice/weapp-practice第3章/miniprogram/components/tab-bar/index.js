Component({
    properties: {
        idx: {
            type: Number,
            value: 0
        }
    },
    data: {
        tabBar: [
        {
          "current": 0,
          "pagePath": "../../pages/index/index",
          "text": "首页",
          "iconClass":"icon-homefill",
          "iconTopClass":""
        },
        {
          "current": 0,
          "pagePath": "../../pages/post/index",
          "text": "发布",
          "iconClass":"cu-btn icon-add bg-green shadow",
          "iconTopClass":"add-action"

        },
        {
          "current": 0,
          "pagePath": "../../pages/my/my",
          "text": "我的",
          "iconClass":"icon-my",
          "iconTopClass":""
        },
      ]
    },
    observers: {
      "idx": function (id) {
        var otabbar = this.data.tabBar;
        otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
        otabbar[id]['current'] = 1;
        this.setData({ tabBar: otabbar});
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