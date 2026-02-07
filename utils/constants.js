export const CATEGORIES = ['全部', '早餐', '午餐', '晚餐', '烘焙', '甜点'];

export const MOCK_RECIPES = [
    {
        id: '1',
        title: '自制草莓舒芙蕾：云朵般的口感',
        description: '清新健康的低卡午餐，富含营养，简单易上手。',
        coverImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
        author: {
            name: '小厨娘阿珍',
            avatar: 'https://picsum.photos/seed/user1/100/100'
        },
        likes: '1.2k',
        category: '甜点',
        time: '25 分钟',
        difficulty: '初级',
        ingredients: [
            { name: '草莓', amount: '200g' },
            { name: '鸡蛋', amount: '2个' },
            { name: '低筋面粉', amount: '40g' },
            { name: '牛奶', amount: '50ml' }
        ],
        steps: [
            { order: 1, title: '食材处理', description: '草莓洗净切块备用。' },
            { order: 2, title: '打发蛋白', description: '蛋清与蛋黄分离，蛋白打发至硬性发泡。' }
        ]
    },
    {
        id: '2',
        title: '抹茶燕麦拿铁：开启清爽早晨',
        description: '夏日必备，清新提神。',
        coverImage: 'https://images.unsplash.com/photo-1515823662273-0b788213783b?auto=format&fit=crop&w=600&q=80',
        author: {
            name: '早起打工人',
            avatar: 'https://picsum.photos/seed/user2/100/100'
        },
        likes: '420',
        category: '早餐'
    },
    {
        id: '3',
        title: '蒜香黄油烤鸡：家庭聚餐必点',
        description: '外酥里嫩，蒜香扑鼻。',
        coverImage: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80',
        author: {
            name: '美食探店手',
            avatar: 'https://picsum.photos/seed/user3/100/100'
        },
        likes: '850',
        category: '晚餐'
    },
    {
        id: '4',
        title: '正宗日式豚骨拉面：浓郁骨汤',
        description: '单位8小时的灵魂汤头。',
        coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        author: {
            name: '拉面狂热者',
            avatar: 'https://picsum.photos/seed/user4/100/100'
        },
        likes: '2.1k',
        category: '午餐'
    },
    {
        id: '5',
        title: '香煎三文鱼配时蔬',
        description: '清新健康的低卡午餐，富含Omega-3，简单易上手。',
        coverImage: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
        author: {
            name: '健康食刻',
            avatar: 'https://picsum.photos/seed/user5/100/100'
        },
        likes: '3.4k',
        category: '午餐',
        time: '25 分钟',
        difficulty: '初级',
        ingredients: [
            { name: '三文鱼菲力', amount: '300g' },
            { name: '芦笋', amount: '6-8根' },
            { name: '圣女果', amount: '100g' },
            { name: '柠檬', amount: '1/2个' },
            { name: '海盐 & 黑胡椒', amount: '适量' }
        ],
        steps: [
            {
                order: 1,
                title: '食材预处理',
                description: '将三文鱼洗净，用厨房纸巾吸干表面水分。在鱼肉两面均匀撒上海盐和现磨黑胡椒，挤入少许柠檬汁，腌制10分钟。'
            },
            {
                order: 2,
                title: '下锅煎制',
                description: '平底锅中火加热，倒入橄榄油。待锅热后放入三文鱼（皮朝下），每面煎约3-4分钟直到表面金黄酥脆，中间断生即可。'
            },
            {
                order: 3,
                title: '配菜摆盘',
                description: '利用锅中余油翻炒芦笋和圣女果。将煎好的三文鱼与时蔬一同摆盘，最后再点缀一片柠檬装饰。'
            }
        ]
    }
];
