Component({
    options: {
        addGlobalClass: true
    },
    data: {
        selected: 0,
        color: "#897561",
        selectedColor: "#ee8c2b",
        list: [
            {
                pagePath: "/pages/marketplace/marketplace",
                text: "广场",
                iconClass: "icon-home"
            },
            {
                pagePath: "/pages/shopping/shopping",
                text: "备菜",
                iconClass: "icon-edit-note"
            },
            {
                pagePath: "/pages/create/create",
                text: "创作",
                iconClass: "icon-add-circle"
            },
            {
                pagePath: "/pages/profile/profile",
                text: "我的",
                iconClass: "icon-person"
            }
        ]
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({ url })
            this.setData({
                selected: data.index
            })
        }
    }
})
