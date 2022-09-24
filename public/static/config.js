window.INIS = {

    // API地址 - 填写后端域名 请严格按照以下格式填写
    api: 'https://inis.ztyang.com/api',
    // api: 'https://api.inis.cn/api',

    // 后端开启token验证后，需要将token填写到此处
    token: '621f525a3b76f3a5a25e4e765ace5c41',

    // 站点标题
    title: '相左',

    // 路由模式 - true = 带 # 号路由 - 不建议修改此项 
    // 注意: 设为false 需要添加以下nginx配置来配合
    // error_page 404 index.html;
    // location / {
    //     try_files $uri $uri/ /index.html;
    // }
    route_hash: true,

    // 请勿擅自修改此处
    version: '1.1.0',
}

