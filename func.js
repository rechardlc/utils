/**
 * 类型判断
 * @param obj { any }
 * @returns {string}
 */
const typeOf = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
/**
 * 简单版防抖
 * @type {(function(*, *=): void)|*}
 */
const debounce = (() => {
  let timer = null
  return (callback, wait = 200) => {
    timer&&clearTimeout(timer)
    timer = setTimeout(callback, wait)
  }
})()
/**
 * 简单版节流
 * @type {(function(*, *=): void)|*}
 */
const throttle = (() => {
  let last = 0
  return (callback, wait = 200) => {
    let now = +new Date()
    if (now - last > wait) {
      callback()
      last = now
    }
  }
})()
/**
 * 手机号
 * @param mobile { number | string }
 * @returns {*}
 */
const hideMobile = (mobile) => {
  return mobile.toString().replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
}
/**
 * 切换全屏
 * @param element { HTMLBodyElement }
 * @returns {(function(*): void)|*}
 */
const toggleFullscreen = element => {
  const fullscreens = ["requestFullscreen", "mozRequestFullScreen", "msRequestFullscreen", "webkitRequestFullscreen"]
  const exitFullscreens = ["exitFullscreen", "msExitFullscreen", "mozCancelFullScreen", "webkitExitFullscreen"]
  return (toggle) => {
    if (toggle) {
      for (let i of fullscreens) {
        if (element[i]) {
          element[i]()
          break
        }
      }
    } else {
      for (let j of exitFullscreens) {
        if (document[j]) {
          document[j]()
          break
        }
      }
    }
  }
}
/**
 * 字母大小写转化
 * @param str { string }
 * @param type { 1|2|3 }
 * @returns {string|*}
 */
const turnCase = (str, type) => {
  switch (type) {
    case 1:
      return str.toUpperCase()
    case 2:
      return str.toLowerCase()
    case 3:
      return str[0].toUpperCase() + str.substring(1).toLowerCase()
    default:
      return str
  }
}
/**
 * 解析URL参数
 * @returns {{}}
 */
const getSearchParams = () => {
  const searchPar = new URLSearchParams(window.location.search)
  const paramsObj = {}
  for (const [key, value] of searchPar.entries()) {
    paramsObj[key] = value
  }
  return paramsObj
}
/**
 * 判断移动端平台
 * @returns {1|2|3} 1： ios 2： android 3：other
 */
const getOSType = () => {
  let u = navigator.userAgent, app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isIOS) {
    return 1;
  }
  if (isAndroid) {
    return 2;
  }
  return 3;
}
/**
 * 滚动到顶部
 */
const scrollToTop = () => {
  const height = document.documentElement.scrollTop || document.body.scrollTop
  if (height > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, height - height / 8)
  }
}
/**
 * 滚动到某个元素
 */
const smoothScroll = element =>{
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  })
}
/**
 * 通过URL.createObjectURL(new Blob())方法创建uuid
 * @returns {string}
 */
const uuid = () => {
  const temp_url = URL.createObjectURL(new Blob())
  const uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}
/**
 * 金额格式化
 * @param number { number | string } 格式化数字
 * @param decimals { number } 保留几位小数
 * @param dec_point { string } 小数点符号
 * @param thousands_sep { string } 千分位符号
 * @returns {string}
 */
const moneyFormat = (number, decimals, dec_point, thousands_sep) => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  const n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 2 : Math.abs(decimals)
  const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep
  const dec = typeof dec_point === 'undefined' ? '.' : dec_point
  let s = ''
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

/**
 * 本地存储行为
 * eg：const localStore = new StorageAction(true | false)
 */
class StorageAction {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage : sessionStorage
  }
  setItem(key, value) {
    if (typeof (value) === 'object') value = JSON.stringify(value)
    this.storage.setItem(key, value)
  }
  getItem(key) {
    try {
      return JSON.parse(this.storage.getItem(key))
    } catch (err) {
      return this.storage.getItem(key)
    }
  }
  removeItem(key) {
    this.storage.removeItem(key)
  }
  clear() {
    this.storage.clear()
  }
  key(index) {
    return this.storage.key(index)
  }
  length() {
    return this.storage.length
  }
}

/**
 * 下载文件~基于axios，通用性不是很强
 * @param api
 * @param params
 * @param fileName
 * @param type
 */
// const downloadFile = (api, params, fileName, type = 'get') => {
//   axios({
//     method: type,
//     url: api,
//     responseType: 'blob',
//     params: params
//   }).then((res) => {
//     let str = res.headers['content-disposition']
//     if (!res || !str) {
//       return
//     }
//     let suffix = ''
//     // 截取文件名和文件类型
//     if (str.lastIndexOf('.')) {
//       fileName ? '' : fileName = decodeURI(str.substring(str.indexOf('=') + 1, str.lastIndexOf('.')))
//       suffix = str.substring(str.lastIndexOf('.'), str.length)
//     }
//     //  如果支持微软的文件下载方式(ie10+浏览器)
//     if (window.navigator.msSaveBlob) {
//       try {
//         const blobObject = new Blob([res.data]);
//         window.navigator.msSaveBlob(blobObject, fileName + suffix);
//       } catch (e) {
//         console.log(e);
//       }
//     } else {
//       //  其他浏览器
//       let url = window.URL.createObjectURL(res.data)
//       let link = document.createElement('a')
//       link.style.display = 'none'
//       link.href = url
//       link.setAttribute('download', fileName + suffix)
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(link.href)
//     }
//   }).catch((err) => {
//     console.log(err.message)
//   })
// }

/**
 * 模糊检索
 * @param list { Array }
 * @param keyWord { string }
 * @param attribute { string }
 * @returns {*[]}
 */
const fuzzyQuery = (list, keyWord, attribute = 'name') => {
  const reg = new RegExp(keyWord)
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i])
    }
  }
  return arr
}
/**
 * 遍历树节点
 * @param data { Array }
 * @param callback { Function } 回调方法
 * @param childrenName { string }
 */
const foreachTree = (data, callback, childrenName = 'children') => {
  for (let i = 0; i < data.length; i++) {
    callback(data[i])
    if (data[i][childrenName] && data[i][childrenName].length > 0) {
      foreachTree(data[i][childrenName], callback, childrenName)
    }
  }
}
