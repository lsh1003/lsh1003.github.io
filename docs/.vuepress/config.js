// 配置文件的入口文件
module.exports = {
    title: '李世毫的学习笔记',
    description: '李世豪, 学习笔记',
    themeConfig: {
        sidebar: 'auto',
        smoothScroll: true,
        collapsable: true,
        nav: [
            { text: 'home', link: '/' },
            { 
                text: '笔记',
                items: [
                    { text: 'c语言', link: '/c/' }
                ]
            }
        ]
    }
}