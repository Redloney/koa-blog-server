const FastScanner = require('fastscan')

const words = ['fuck', 'bitch', 'sb', '傻逼', '垃圾', '操你妈', '艹']

const scanner = new FastScanner(words)

const filter = (content) => {
  content = content.toUpperCase()
  const offWords = scanner.search(content, (option = { quick: true }))
  return offWords.length > 0 ? false : true
}

module.exports = filter
