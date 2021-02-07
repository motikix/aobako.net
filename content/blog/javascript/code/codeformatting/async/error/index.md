---
title: async/await のエラーハンドリングを整理する
description: 備忘録
date: 2021-02-07 22:43:03
categories:
  - javascript
tags:
  - javascript
  - async
---

最近、しっかりと TypeScript を触る必要性が出てきて、非同期処理のエラーハンドリングまわりがうろ覚えになっていたので復習しておく。

```javascript
const f = p => new Promise((resolve, reject) => {
  if (p === 1) resolve('resolve!!')
  else if (p === 2) reject('reject!!')
  else throw new Error('throw!!')
})

f(1).then(r => console.log(r)).catch(r => console.log(`catch:: ${r}`)) // resolve!!
f(2).then(r => console.log(r)).catch(r => console.log(`catch:: ${r}`)) // catch:: reject!!
f(0).then(r => console.log(r)).catch(r => console.log(`catch:: ${r}`)) // catch:: Error: throw!!

;(async () => {
  console.log(await f(1).catch(e => `catch:: ${e}`)) // resolve!!
  console.log(await f(2).catch(e => `catch:: ${e}`)) // catch:: reject!!
  console.log(await f(0).catch(e => `catch:: ${e}`)) // catch:: Error: throw!!
  try {
    await f(2)
  } catch (e) {
    console.log(`catch:: ${e}`) // catch:: reject!!
  }
  try {
    await f(0)
  } catch (e) {
    console.log(`catch:: ${e}`) // catch:: Error: throw!!
  }
})()
```

関数 f は引数によって、 `Resolve` / `Reject` / `Error` のいずれかが返るようになっている。

Promise を `then` / `catch` で受けとる形式はお馴染で、Promise が **Resolve** された場合にその戻り値を `then` で受け取ることができ、 **Reject** または **Error が throw された** 場合は `catch` で補足することができる。

async / await は非同期処理を同期的に書くことができるが、async な関数の戻り値は結局解決された Promise なので、そのまま受けとることができる。Reject された値、もしくは Error は **try/catch** で拾うか、Promise 同様、 `catch` で拾うことができる。
