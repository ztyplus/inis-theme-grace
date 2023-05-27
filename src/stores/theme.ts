import { defineStore } from "pinia";
import Config from "@/api/config";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    theme_config: null as any,
  }),

  actions: {
    async initData() {
      const result = await Config.one();
      if (result.data.code === 200) {
        this.theme_config = result.data.data;
      } else {
        this.theme_config = {
          nickname: "相左",
          avatar: "https://q.qlogo.cn/g?b=qq&nk=2251513837&s=640",
          signature: "间歇性洗心革面，持续性混吃等死",
          QQ: "2251513837",
          wechat: "yang2210670",
          github: "https://github.com/ztyangt",
          mail: "yang2210670@163.com",
          reward1: "https://kodo.ztyang.com/img/wxpay.png-s",
          reward2: "https://kodo.ztyang.com/img/alipay.png-s",
          color: "#046741",
          title: "相左生活志",
          subtitle: "心有山海，静而不争",
          favicon: "/favicon.svg",
          headimg: "https://p2.qhimg.com/bdr/__85/t012962abcf9cb49218.jpg",
          description: "我从不去想何时能成功，既然选择了远方，那就还远着呢。",
          night: false,
          music: false,
          yiyan: false,
          radius: 5,
          keywords: "相左, fly主题, inis, 博客",
          icp: "黔ICP备19012043号",
          gwbei: "贵公网安备 52011202003513号",
          avatar_source: "https://gravatar.loli.net/",
          css: "",
          tongji: "",
          footerlinks: ` 
          <a href="/about">关于本站</a>
          <a href="/about">隐私协议</a>
          <a href="/sitemap.xml" target="_blank">网站地图</a>
          <a href="/feed.xml" target="_blank">RSS订阅</a>
          <a href="https://www.ztyang.com" target="_blank">相左博客</a>
          <a href="https://inis.cc" target="_blank">INIS社区</a>`,
        };
      }
      console.log(result);
    },
  },
});
