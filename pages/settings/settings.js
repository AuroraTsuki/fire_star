const app = getApp();

Page({
    data: {
        tempName: ''
    },

    onLoad() {
        const { userInfo } = app.globalData;
        this.setData({
            tempName: userInfo.name,
            tempAvatar: userInfo.avatar
        });
    },

    onNameInput(e) {
        this.setData({
            tempName: e.detail.value
        });
    },

    onChooseAvatar(e) {
        const { avatarUrl } = e.detail;
        this.setData({
            tempAvatar: avatarUrl
        });
    },

    handleSave() {
        const { tempName } = this.data;
        if (!tempName.trim()) {
            wx.showToast({
                title: '持名不能为空',
                icon: 'none'
            });
            return;
        }

        app.globalData.userInfo.name = tempName.trim();
        app.globalData.userInfo.avatar = this.data.tempAvatar;

        wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            success: () => {
                setTimeout(() => {
                    wx.navigateBack();
                }, 2000);
            }
        });
    },

    goBack() {
        wx.navigateBack();
    }
})
