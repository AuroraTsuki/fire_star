import { MOCK_RECIPES } from './utils/constants';

App({
    globalData: {
        shoppingList: [],
        allRecipes: MOCK_RECIPES,
        favorites: [],
        userInfo: {
            name: 'WeChat User',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop'
        }
    },
    onLaunch() {
        if (!wx.cloud) {
            console.error('Please use 2.2.3 or above library version')
        } else {
            wx.cloud.init({
                env: 'cloud1-2g4hs5l8152a44c8',
                traceUser: true,
            })
        }
    }
})
