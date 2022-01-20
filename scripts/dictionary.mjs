import fetch from 'node-fetch'
import fs from 'fs'

async function main() {
  const res = await fetch('https://raw.githubusercontent.com/BramboraSK/slovnik-slovenskeho-jazyka/main/opravene.txt')
  const raw = await res.text()

  const data = raw.split('\n').filter(word => {
    const item = word.replace(/\/.*$/, '')
    return word.match('/') && item.length === 5 && item[0].toLowerCase() === item[0]
  }).map(item => item.replace(/\/.*$/, ''))

  const randomIds = []
  while(randomIds.length < data.length){
    var r = Math.floor(Math.random() * 1000000) + 1;
    if(randomIds.indexOf(r) === -1) {
      randomIds.push(r);
    }
  }

  const obj = data.reduce((acc, item, index) => ({ ...acc, [randomIds[index]]: item}), {})

  fs.writeFileSync('./dictionary.json', JSON.stringify(obj))
}

main()
