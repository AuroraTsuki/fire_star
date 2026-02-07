Page({
    data: {
        myRecipes: [],
        userInfo: {},
        activeTab: 'works'
    },

    onShow() {
        const app = getApp();
        const favorites = wx.getStorageSync('favorites') || [];
        this.setData({
            favorites: favorites,
            userInfo: app.globalData.userInfo,
            showPage: true
        });
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 3
            });
        }
    },

    onHide() {
        this.setData({ showPage: false });
    },

    goToDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/recipeDetail/recipeDetail?id=${id}`,
        });
    },

    goToMarket() {
        wx.switchTab({
            url: '/pages/marketplace/marketplace',
        });
    },

    goToCreate() {
        wx.navigateTo({
            url: '/pages/create/create',
        });
    },

    goToSettings() {
        wx.navigateTo({
            url: '/pages/settings/settings'
        });
    }
})
