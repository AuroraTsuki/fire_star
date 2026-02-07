import { CATEGORIES } from '../../utils/constants';

Page({
    data: {
        categories: CATEGORIES,
        selectedCategory: '全部',
        searchQuery: '',
        filteredRecipes: [],
        showPage: false,
        loading: false
    },

    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({ selected: 0 });
        }
        this.setData({ showPage: true });
        this.fetchRecipes();
    },

    onHide() {
        this.setData({ showPage: false });
    },

    onPullDownRefresh() {
        this.fetchRecipes(() => {
            wx.stopPullDownRefresh();
        });
    },

    async fetchRecipes(cb) {
        if (this.data.loading) return;
        this.setData({ loading: true });

        const db = wx.cloud.database();
        const _ = db.command;
        let query = db.collection('recipes');

        // Apply Category Filter
        if (this.data.selectedCategory !== '全部') {
            query = query.where({
                category: this.data.selectedCategory
            });
        }

        // Apply Search Filter (Title regex)
        if (this.data.searchQuery) {
            query = query.where({
                title: db.RegExp({
                    regexp: this.data.searchQuery,
                    options: 'i',
                })
            });
        }

        try {
            const res = await query.orderBy('createTime', 'desc').get();
            this.setData({
                filteredRecipes: res.data,
                loading: false
            });
        } catch (err) {
            console.error('Fetch recipes failed', err);
            this.setData({ loading: false });
            wx.showToast({ title: '加载失败', icon: 'none' });
        }

        if (cb) cb();
    },

    onSearchInput(e) {
        this.setData({ searchQuery: e.detail.value }, () => {
            // Debounce could be added here
            this.fetchRecipes();
        });
    },

    clearSearch() {
        this.setData({ searchQuery: '' }, () => {
            this.fetchRecipes();
        });
    },

    selectCategory(e) {
        const cat = e.currentTarget.dataset.cat;
        this.setData({ selectedCategory: cat }, () => {
            this.fetchRecipes();
        });
    },

    resetFilters() {
        this.setData({
            searchQuery: '',
            selectedCategory: '全部'
        }, () => {
            this.fetchRecipes();
        });
    },

    goToDetail(e) {
        const id = e.currentTarget.dataset.id;
        // In Cloud DB, id is _id usually.
        wx.navigateTo({
            url: `/pages/recipeDetail/recipeDetail?id=${id}`,
        });
    },

    goToCreate() {
        wx.navigateTo({
            url: '/pages/create/create',
        });
    },

    goBack() {
        wx.navigateBack({ delta: 1 });
    }
})
