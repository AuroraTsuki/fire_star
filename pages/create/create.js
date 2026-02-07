Page({
    data: {
        title: '',
        coverImage: '',
        ingredients: [
            { name: '西红柿', amount: '2个' },
            { name: '鸡蛋', amount: '3枚' }
        ],
        steps: [],
        isStepsModalOpen: false
    },

    onTitleInput(e) { this.setData({ title: e.detail.value }); },

    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            });
        }
    },

    chooseCover() {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                this.setData({ coverImage: res.tempFilePaths[0] });
            }
        });
    },

    addIngredient() {
        this.setData({
            ingredients: [...this.data.ingredients, { name: '', amount: '' }]
        });
    },

    removeIngredient(e) {
        const { index } = e.currentTarget.dataset;
        const newList = [...this.data.ingredients];
        newList.splice(index, 1);
        this.setData({ ingredients: newList });
    },

    onIngNameInput(e) {
        const { index } = e.currentTarget.dataset;
        const newList = [...this.data.ingredients];
        newList[index].name = e.detail.value;
        this.setData({ ingredients: newList });
    },

    onIngAmountInput(e) {
        const { index } = e.currentTarget.dataset;
        const newList = [...this.data.ingredients];
        newList[index].amount = e.detail.value;
        this.setData({ ingredients: newList });
    },

    toggleStepsModal() {
        this.setData({ isStepsModalOpen: !this.data.isStepsModalOpen });
    },

    addStep() {
        const newStep = {
            order: this.data.steps.length + 1,
            title: `步骤 ${this.data.steps.length + 1}`,
            description: '',
            image: ''
        };
        this.setData({ steps: [...this.data.steps, newStep] });
    },

    removeStep(e) {
        const { index } = e.currentTarget.dataset;
        const newList = [...this.data.steps];
        newList.splice(index, 1);
        // Renumber
        const renumbered = newList.map((s, i) => ({ ...s, order: i + 1 }));
        this.setData({ steps: renumbered });
    },

    onStepTitleInput(e) {
        const { index } = e.currentTarget.dataset;
        const newList = [...this.data.steps];
        newList[index].title = e.detail.value;
        this.setData({ steps: newList });
    },

    onStepDescInput(e) {
        const { index } = e.currentTarget.dataset;
        const newList = [...this.data.steps];
        newList[index].description = e.detail.value;
        this.setData({ steps: newList });
    },

    chooseStepImage(e) {
        const { index } = e.currentTarget.dataset;
        wx.chooseImage({
            count: 1,
            success: (res) => {
                const newList = [...this.data.steps];
                newList[index].image = res.tempFilePaths[0];
                this.setData({ steps: newList });
            }
        });
    },

    async handleSave() {
        if (!this.data.title) {
            wx.showToast({ title: '请输入菜谱名称', icon: 'none' });
            return;
        }

        wx.showLoading({ title: '发布中...', mask: true });

        try {
            const db = wx.cloud.database();
            let coverFileID = this.data.coverImage;

            // 1. Upload Cover Image if it's a local file
            if (this.data.coverImage && !this.data.coverImage.startsWith('http')) {
                const cloudPath = `recipes/covers/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
                const uploadRes = await wx.cloud.uploadFile({
                    cloudPath,
                    filePath: this.data.coverImage
                });
                coverFileID = uploadRes.fileID;
            }

            // 2. Upload Step Images
            const steps = [...this.data.steps];
            for (let i = 0; i < steps.length; i++) {
                if (steps[i].image && !steps[i].image.startsWith('http')) {
                    const cloudPath = `recipes/steps/${Date.now()}-${i}.jpg`;
                    const uploadRes = await wx.cloud.uploadFile({
                        cloudPath,
                        filePath: steps[i].image
                    });
                    steps[i].image = uploadRes.fileID;
                }
            }

            // 3. Save to Cloud Database
            const newRecipe = {
                title: this.data.title,
                coverImage: coverFileID,
                author: {
                    // In real app, this comes from user profile. For now, mock or use open-data
                    name: '美食探索家',
                    avatar: 'https://picsum.photos/seed/me/200/200'
                },
                likes: 0,
                views: 0,
                category: '其他', // Could allow user to select category
                ingredients: this.data.ingredients,
                steps: steps,
                createTime: db.serverDate()
            };

            await db.collection('recipes').add({
                data: newRecipe
            });

            wx.hideLoading();
            wx.showToast({ title: '发布成功！', icon: 'success' });

            // Refresh global list if needed, but better to fetch from cloud in Profile/Marketplace

            setTimeout(() => {
                wx.switchTab({ url: '/pages/profile/profile' });
            }, 1500);

        } catch (err) {
            console.error('Publish failed', err);
            wx.hideLoading();
            wx.showToast({ title: '发布失败，请重试', icon: 'none' });
        }
    },

    goBack() {
        wx.navigateBack();
    }
})
