Page({
    data: {
        activeTab: 'pending',
        groupedList: [],
        rawList: [],
        showModal: false,
        newItemName: '',
        newItemAmount: '',
        loading: false,
        errorMsg: '',
        isDeleteMode: false,
        selectedIds: []
    },

    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({ selected: 1 });
        }
        this.setData({ showPage: true });
        this.fetchShoppingList();
    },

    async fetchShoppingList() {
        if (this.data.loading) return;
        this.setData({ loading: true });

        const db = wx.cloud.database();
        try {
            // In real app, we filter by _openid implicitly
            const res = await db.collection('shopping_list').limit(100).get();
            console.log('Shopping Fetch Result:', res);
            this.setData({
                rawList: res.data,
                loading: false,
                errorMsg: ''
            });
            this.updateGroupedList();
        } catch (err) {
            console.error('Shopping Fetch Error:', err);
            this.setData({
                loading: false,
                errorMsg: err.errMsg || 'Fetch Failed'
            });
            // Fallback for demo if DB not ready
            this.updateGroupedList();
        }
    },

    updateGroupedList() {
        const { rawList, activeTab } = this.data;
        const list = rawList; // Use fetched rawList directly

        const filteredList = list.filter(item => {
            return activeTab === 'pending' ? !item.completed : item.completed;
        });

        const groups = {};
        filteredList.forEach(item => {
            const source = item.source || '其他零散采购';
            if (!groups[source]) {
                groups[source] = {
                    title: source,
                    iconClass: item.iconClass || 'icon-shopping-cart',
                    items: []
                };
            }
            groups[source].items.push(item);
        });

        this.setData({ groupedList: Object.values(groups) });
    },



    toggleDeleteMode() {
        this.setData({ isDeleteMode: !this.data.isDeleteMode, selectedIds: [] });
    },

    async confirmBatchDelete() {
        const ids = this.data.selectedIds;
        if (ids.length === 0) {
            this.setData({ isDeleteMode: false });
            return;
        }

        wx.showModal({
            title: '删除确认',
            content: `确定要删除这 ${ids.length} 个商品吗？`,
            success: async (res) => {
                if (res.confirm) {
                    const db = wx.cloud.database();
                    wx.showLoading({ title: '删除中...' });

                    const originalList = this.data.rawList;
                    const newList = originalList.filter(i => !ids.includes(i._id));
                    this.setData({ rawList: newList, isDeleteMode: false, selectedIds: [] });
                    this.updateGroupedList();

                    try {
                        const operations = ids.map(id => db.collection('shopping_list').doc(id).remove());
                        await Promise.all(operations);
                        wx.hideLoading();
                        wx.showToast({ title: '已删除', icon: 'success' });
                    } catch (err) {
                        wx.hideLoading();
                        console.error(err);
                        wx.showToast({ title: '部分删除失败', icon: 'none' });
                        this.fetchShoppingList();
                    }
                }
            }
        });
    },

    handleItemTap(e) {
        const id = e.currentTarget.dataset.id;
        if (this.data.isDeleteMode) {
            const { selectedIds } = this.data;
            if (selectedIds.includes(id)) {
                this.setData({ selectedIds: selectedIds.filter(i => i !== id) });
            } else {
                this.setData({ selectedIds: [...selectedIds, id] });
            }
        } else {
            this.toggleItem(id);
        }
    },

    handleGroupTap(e) {
        if (!this.data.isDeleteMode) return;

        const groupTitle = e.currentTarget.dataset.title;
        const group = this.data.groupedList.find(g => g.title === groupTitle);
        if (!group) return;

        const allIds = group.items.map(i => i._id);
        const currentSelected = this.data.selectedIds;

        // Check if all are already selected
        const allSelected = allIds.every(id => currentSelected.includes(id));

        let newSelected;
        if (allSelected) {
            // Unselect all
            newSelected = currentSelected.filter(id => !allIds.includes(id));
        } else {
            // Select all (merge unique)
            newSelected = [...new Set([...currentSelected, ...allIds])];
        }

        this.setData({ selectedIds: newSelected });
    },

    async toggleItem(arg) {
        const id = arg.currentTarget ? arg.currentTarget.dataset.id : arg; // Support Event or ID
        const index = this.data.rawList.findIndex(i => i._id === id);
        if (index === -1) return;

        const item = this.data.rawList[index];
        const newStatus = !item.completed;

        // Optimistic UI update
        const newList = [...this.data.rawList];
        newList[index].completed = newStatus;
        this.setData({ rawList: newList });
        this.updateGroupedList();

        // Sync to Cloud
        const db = wx.cloud.database();
        try {
            await db.collection('shopping_list').doc(id).update({
                data: { completed: newStatus }
            });
        } catch (err) {
            console.error('Toggle failed', err);
            wx.showToast({ title: '同步失败', icon: 'none' });
            // Revert
            newList[index].completed = !newStatus;
            this.setData({ rawList: newList });
            this.updateGroupedList();
        }
    },

    async addItem() {
        const { newItemName, newItemAmount } = this.data;
        if (!newItemName.trim()) {
            wx.showToast({ title: '请输入名称', icon: 'none' });
            return;
        }

        const db = wx.cloud.database();
        const newItem = {
            name: newItemName,
            amount: newItemAmount || '1份',
            completed: false,
            source: '其他零散采购',
            iconClass: 'icon-shopping-cart',
            createTime: db.serverDate()
        };

        wx.showLoading({ title: '添加中...' });
        try {
            const res = await db.collection('shopping_list').add({ data: newItem });

            // Add locally with returned _id
            const localItem = { ...newItem, _id: res._id };
            this.setData({
                rawList: [localItem, ...this.data.rawList]
            });
            this.updateGroupedList();
            this.hideAddModal();
            wx.hideLoading();
            wx.showToast({ title: '添加成功', icon: 'success' });
        } catch (err) {
            wx.hideLoading();
            console.error(err);
            wx.showToast({ title: '添加失败', icon: 'none' });
        }
    },

    showAddModal() { this.setData({ showModal: true }); },

    hideAddModal() {
        this.setData({
            showModal: false,
            newItemName: '',
            newItemAmount: ''
        });
    },

    onNameInput(e) { this.setData({ newItemName: e.detail.value }); },
    onAmountInput(e) { this.setData({ newItemAmount: e.detail.value }); },

    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;
        this.setData({ activeTab: tab }, () => {
            this.updateGroupedList();
        });
    },

    async clearCompleted() {
        const db = wx.cloud.database();
        const _ = db.command;

        wx.showModal({
            title: '清空确认',
            content: '确定清空所有已购商品吗？',
            success: async (res) => {
                if (res.confirm) {
                    wx.showLoading({ title: '清空中...' });
                    try {
                        // Cloud delete batch is restricted to single doc usually unless cloud function
                        // So for client side, we iterate or just hide.
                        // Ideally use a Cloud Function for batch delete.
                        // For MVP, we just delete locally and maybe loop delete (bad perf but works)
                        // Or just filter out locally for now?
                        // Let's loop delete for visible items (up to 20?)
                        const completedItems = this.data.rawList.filter(i => i.completed);
                        const operations = completedItems.map(item => db.collection('shopping_list').doc(item._id).remove());
                        await Promise.all(operations);

                        this.setData({
                            rawList: this.data.rawList.filter(i => !i.completed)
                        });
                        this.updateGroupedList();
                        wx.hideLoading();
                    } catch (err) {
                        wx.hideLoading();
                        wx.showToast({ title: '部分清空失败', icon: 'none' });
                    }
                }
            }
        });
    },

    shareList() {
        wx.showToast({ title: '分享功能准备中', icon: 'none' });
    },

    goBack() { wx.navigateBack(); }
})
