// 进行多语言的实例化
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import elementEN from 'element-ui/lib/locale/lang/en'
// import elementRU from 'element-ui/lib/locale/lang/ru-RU'
// import elementJA from 'element-ui/lib/locale/lang/ja'
import customZH from './zh'
import customEN from './en'

Vue.use(VueI18n) // 注册国际化对象
// 有elementUI的语言包
// Vuei18n进行实例化
export default new VueI18n({
  // 多语言的配置选项
  // locale这个值是随意的
  // en
  locale: Cookie.get('language') || 'zh', // 当前的多语言的类型 当前只能有一种
  messages: {
    'zh': {
      // 该对象表示 为zh的语言包
      ...elementZH,
      ...customZH
    },
    'en': {
      ...elementEN,
      ...customEN
      // 表示是en的语言包
    }
    // 'ru': {
    //   //  ru表示是俄语的语言包
    //   ...elementRU
    // },
    // 'ja': {
    //   ...elementJA
    // }
  } // 所有的语言包  有多少都可以
})
