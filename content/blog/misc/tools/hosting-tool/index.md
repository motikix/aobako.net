---
title: シングルバイナリでさくっとローカルサーバー起動したい
description: miniserve はいいぞ
date: 2024-11-21 22:35
categories:
  - misc
tags:
  - rust
  - hosting
---

たまーに、ローカルサーバーを立てて何かしらを配信したいときがある。NPM パッケージなり VSCode 拡張なりで簡単にできるとはいえ、それをバイナリ一つで実行できるのはやはり魅力的である。

`exa (eza)` や `ripgrep` など、Rust 製の超便利な CLI ツールが多い昨今なので、HTTP Server の CLI ツールもあるやろ。と思い探したらありました。

- [static-web-server/static-web-server](https://github.com/static-web-server/static-web-server)
- [svenstaro/miniserve](https://github.com/svenstaro/miniserve)

前者はどうにもコネクションが開いているとシャットダウンに時間が掛かるバグがあるっぽくて（依存している hyper が古いらしい）、後者を使っています。便利。
