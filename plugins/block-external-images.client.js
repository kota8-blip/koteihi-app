// plugins/block-external-images.client.js
;(function () {
  const BAD_PREFIX = 'https://easytuan.gitee.io/node-elm-api/public/'
  const FALLBACK = '/public/placeholder.png'

  // ① src セッターを乗っ取り（最も確実）
  const desc = Object.getOwnPropertyDescriptor(Image.prototype, 'src')
  if (desc && desc.set) {
    const originalSetter = desc.set
    Object.defineProperty(Image.prototype, 'src', {
      set (val) {
        try {
          const s = String(val || '')
          if (s.startsWith(BAD_PREFIX)) {
            return originalSetter.call(this, FALLBACK)
          }
        } catch (_) {}
        return originalSetter.call(this, val)
      }
    })
  }

  // ② setAttribute('src', ...) 経由も潰す
  const origSetAttr = Element.prototype.setAttribute
  Element.prototype.setAttribute = function (name, value) {
    if (
      this.tagName === 'IMG' &&
      String(name).toLowerCase() === 'src' &&
      String(value || '').startsWith(BAD_PREFIX)
    ) {
      return origSetAttr.call(this, 'src', FALLBACK)
    }
    return origSetAttr.call(this, name, value)
  }
})()
