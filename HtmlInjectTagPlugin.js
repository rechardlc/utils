/*
   一个基于HtmlWebpackPlugin钩子的插件，用于在html头中添加新的样式集合
*/

const assert = require("assert")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const htmlTags = require("html-webpack-plugin/lib/html-tags")

const createHtmlTag = htmlTags.createHtmlTagObject
const getName = function (str = "") {
  let name = ""
  let htmlStr = str.match(/\w+\.html$/)
  if (htmlStr.length) {
    name = htmlStr[0].split(/\./)[0]
  }
  return name
}

const getLinks = function (links = [], name) {
  name = getName(name)
  const mobile = `${name}-mobile`, desktop = `${name}-desktop`
  return links.filter(link => link.includes(mobile) || link.includes(desktop))
}
const createStyleSheetTag = (tag) => {
  return createHtmlTag('link', {
    rel: 'stylesheet',
    href: tag,
    media: tag.includes("-mobile.") ? "screen and (max-width: 799px)" : "screen and (min-width: 800px)"
  })
}
class HtmlInjectTagPlugin {
  _options = {}
  constructor(options) {
    this._options = options
    assert.strictEqual(options, undefined, `${this.constructor.name} does not accept any options`)
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(this.constructor.name, (data, cb) => {
        const links = getLinks(JSON.parse(data.plugin.assetJson), data.plugin.options.filename)
        let additionalLinkTags = []
        if (links.length) {
          additionalLinkTags = links.map(link => createStyleSheetTag(link))
        }
        data.headTags = [...data.headTags, ...additionalLinkTags]
        cb(null, data)
      })
    })
  }
}
module.exports = HtmlInjectTagPlugin
