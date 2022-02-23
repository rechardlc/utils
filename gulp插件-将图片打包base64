const { Transform } = require('stream')
const path = require('path')
const fs = require('fs')
const imageType = require('image-type')
function replaceImageSrc(file, options) {
  const html = file.contents.toString().replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(str,capture){
    const [url] = str.match(/\.\/[image | newImage]+\/[\w | \. | \/ | -]+\.[png|(svg)|jpeg|jpg]+/) || []
    if (url) {
      try {
        const buffer = fs.readFileSync(path.join('./public', url))
        if (buffer.length > options.size) return str
        const base64 = buffer.toString('base64')
        const type = imageType(buffer)
        const isSvg = /svg/.test(url)
        let dataUrl = ""
        if (type && type.mime) {
          dataUrl = `data:${type.mime};base64,${base64}`
        } else if (isSvg) {
          dataUrl = `data:image/svg+xml;base64,${base64}`
        }
        return str.replace('..', '.').replace(/\.\/[image | newImage]+\/[\w | \. | \/ | -]+\.[png|(svg)|jpeg|jpg]+/, dataUrl)
      }catch (e) {
        return str
      }
    }
    return str
  });
  return Buffer.from(html)
}

/**
 * options = {
 *   size: 10240 // 小于10kb才打包base64
 * }
 * @param options { Object }
 * @return {module:stream.internal.Transform|*}
 */
function buildImageToBase64(options = { size: 10240 }) {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      chunk.contents = replaceImageSrc(chunk, options)
      return callback(null, chunk)
    }
  })
}
module.exports = buildImageToBase64
