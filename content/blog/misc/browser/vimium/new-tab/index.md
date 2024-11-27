---
title: vimium 入れたときにちょっとやったこと
date: 2024-11-27 19:45
categories:
  - misc
tags:
  - browser
  - vimium
  - edge
---

普段は vim を使っているが、ブラウザに関しては vimium の存在を知ってはいながら、別にいいやと思って使っていなかった。

だけど Edge に入れたらちょっと便利だったので、既存拡張との兼ね合いで変更したことや、追加で導入した拡張についてメモしておく。

## [daily.dev](https://chromewebstore.google.com/detail/dailydev-the-homepage-dev/jlmpjdjjbgclbocgajdjefcidcncaied?hl=ja)

この拡張機能によって、新規タブを開いたときに daily.dev のページを開くようにしていた。しかし vimium で `t` でタブを開いて、`o` で Google 検索。みたいなフローをやろうとしたときに、daily.dev 上で vimium が動かなかったので、拡張機能版ではなく、Web アプリ版 ([https://app.daily.dev/](https://app.daily.dev/)) を開くようにした。

## [Custom New Tab](https://chromewebstore.google.com/detail/custom-new-tab/lfjnnkckddkopjfgmbcpdiolnmfobflj?hl=ja)

上記フローを実現しようとしたときに、新規タブを開いたときに特定のページを開くような設定が Edge にないことに気づき、この拡張を入れることにした。タブを開いたときにアドレスバーにフォーカスを当てるかどうかを設定できるのも評価ポイント。

## [catppuccin/vimium](https://github.com/catppuccin/vimium)

ここのところ Catppuccin 以外のテーマを使う気にはなれないのよね。
