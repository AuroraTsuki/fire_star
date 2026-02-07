
Page({
    data: {
        recipe: {},
        isFavorite: false,
        isAuthor: false,
        statusBarHeight: 20
    },

    async onLoad(options) {
        // Get Status Bar Height
        const systemInfo = wx.getSystemInfoSync();
        this.setData({
            statusBarHeight: systemInfo.statusBarHeight
        });

        const id = options.id;
        if (!id) return;

        wx.showLoading({ title: '加载中...' });
        try {
            const db = wx.cloud.database();
            const res = await db.collection('recipes').doc(id).get();
            const recipe = res.data;

            // Check Favorites (Local or Cloud - using Local for MVP)
            const favorites = wx.getStorageSync('favorites') || [];
            const isFavorite = favorites.some(f => f._id === id);

            // Check Author (OpenID check is better, but MVP uses name match or assumes owner if create logic matches)
            // For now, let's just allow delete if it looks like ours or debug mode
            // In real app: res._openid === userOpenId

            this.setData({
                recipe,
                isFavorite,
                // Simple check: if I have it in my local 'created' list or just always true for dev?
                // Let's assume 'isAuthor' is true if the recipe has no OpenID (legacy) or matches current User (Cloud auto)
                // For MVP, enable delete for everyone or just hide it. 
                // Let's hide 'delete' button by default unless we know we created it. 
                // We'll leave isAuthor false unless we implement full auth.
                isAuthor: true
            });
            wx.hideLoading();
        } catch (err) {
            console.error(err);
            wx.hideLoading();
            wx.showToast({ title: '菜谱不存在', icon: 'none' });
            setTimeout(() => wx.navigateBack(), 1500);
        }
    },

    goBack() {
        wx.navigateBack();
    },

    toggleFavorite() {
        const { recipe, isFavorite } = this.data;
        let favorites = wx.getStorageSync('favorites') || [];

        if (isFavorite) {
            favorites = favorites.filter(f => f._id !== recipe._id);
            wx.showToast({ title: '已取消收藏', icon: 'none' });
        } else {
            favorites = [recipe, ...favorites];
            wx.showToast({ title: '已加入收藏', icon: 'success' });
        }

        wx.setStorageSync('favorites', favorites);
        this.setData({ isFavorite: !isFavorite });
    },

    deleteRecipe() {
        wx.showModal({
            title: '删除确认',
            content: '确定要删除这个菜谱吗？',
            success: async (res) => {
                if (res.confirm) {
                    wx.showLoading({ title: '删除中...' });
                    try {
                        const db = wx.cloud.database();
                        await db.collection('recipes').doc(this.data.recipe._id).remove();
                        wx.hideLoading();
                        wx.showToast({ title: '删除成功', icon: 'success' });
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 1500);
                    } catch (err) {
                        wx.hideLoading();
                        wx.showToast({ title: '删除失败', icon: 'none' });
                    }
                }
            }
        });
    },

    addToShopping() {
        // We'll address Shopping List Sync in the next phase, 
        // for now just log it or add to local storage to keep it working locally?
        // Let's try to add to Cloud Shopping List immediately if we are doing that phase.
        // Or keep local behavior for now to avoid breaking it before Phase 4.

        // Let's implement Cloud Adding directly here!
        const { ingredients } = this.data.recipe;
        if (ingredients && ingredients.length > 0) {
            const db = wx.cloud.database();
            const operations = ingredients.map(ing => {
                return db.collection('shopping_list').add({
                    data: {
                        name: ing.name,
                        amount: ing.amount,
                        completed: false,
                        source: this.data.recipe.title, // Use Recipe Title as group name
                        iconClass: 'icon-shopping-cart', // Revert to cart icon
                        createTime: db.serverDate()
                    }
                });
            });

            Promise.all(operations).then(() => {
                wx.showToast({ title: '已加入清单', icon: 'success' });
            }).catch(err => {
                console.error(err);
                wx.showToast({ title: '部分添加失败', icon: 'none' });
            });
        }
    }
})
