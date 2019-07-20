---
title: pandoc と revealjs で markdown によるスライド作成環境を作成した
description: スライド作成するの面倒じゃないですか？Markdown で書けたら超絶便利ですよね！
date: 2018-08-12 22:18:35
categories:
  - Document
  - Markdown
tags:
  - slide
  - markdown
  - pandoc
  - reveal.js
---

概要
---

社内で定期的に勉強会を開催しており、言い出しっぺであることもあり運用が安定するまでは毎回自分が発表するようにしています。テーマの選定と調査・実践に関してはまぁどうにかなっていはいるのですが、正直センス的な問題もあり、スライドの作成が少々面倒になっていたりします。

ブログの投稿もそうですが基本的に文章は Markdown で書くことが主なので、なんとか出来ないかなぁと考えていたのですが、そのとき見つけた reveal.js がとても良かったので、pandoc と組み合わせて Markdown からスライドを作成できる環境を整えてみました。

reveal.js
---

[reveal.js](https://revealjs.com) は、HTML によるプレゼンテーションを作成するためのフレームワークです。実際にリンク先を見て頂くのが早いと思いますが、HTML + CSS + JavaScript のリッチな表現を用いたスライドを作成することができます。基本的には HTML のタグにコンテンツを埋め込んでいく形になりますが、Markdown 形式での記述もサポートされており、HTML で直接マークアップしていくよりも効率的に作成することができます。

pandoc
---

[pandoc](http://pandoc.org/index.html) は、あるマークアップ形式のファイルから別のフォーマットへ変換することができるコンバーターです。インプット・アウトプットフォーマットの種類が豊富で、当然 Markdown 形式にも対応しています。reveal.js は外部 Markdown にも対応していますが、ローカルサーバーにホスティングする必要があったりと少々手間なところがあります。pandoc は reveal.js 形式のアウトプットにも対応しており、Markdown をインプットに直接出力できるので非常に便利です。

構築
---

とりあえずまず変換できればいいかな〜程度だったので、ほぼ手を加えていません。これからじっくり育てて行ければいいかな〜と思っています。

### 環境

* macOS High Sierra (v10.13.6)
* Homebrew (v1.7.1)

### pandoc のインストール

Homebrew でサクッとインストールします。

```bash
$ brew install pandoc
```

### reveal.js のダウンロード

GitHub から任意のディレクトリにクローンします（ダウンロードして解凍するでもOK）。自分はホームディレクトリに `.pandoc` ディレクトリを作成してそこにクローンしました。

```bash
$ mkdir ~/.pandoc
$ cd ~/.pandoc
$ git clone git@github.com:hakimel/reveal.js.git
```

変換してみる
---

適当な Markdown ファイルを作成後、以下のようなコマンドを実行します。

```bash
# ファイルを変換する
# --revealjs-url は出力されるファイルから見た reveal.js までのパスを書く必要がある（html が参照する css や js の場所を教えるため）
$ pandoc input.md -o output.html -s -t revealjs --self-contained --slide-level=2 -V revealjs-url=./.pandoc/reveal.js
# 出力したファイルをブラウザで開く
$ open output.html
```

* `-o`: 出力ファイル
* `-s`: スタンドアロンモード
* `-t`: 出力フォーマット (revealjs)
* `--self-contained`: アセットをまとめたファイルを出力する (css/js など)
* `--slide-level': スライド構造 (reveal.js の場合は`2` を指定すると2次元レイアウトになる)
* `revealjs-url`: revealjs のインストールディレクトリまでの相対パス

更に超絶簡単に使う方法（？）
---

常用するエディタが VisualStudioCode であれば、エクステンションの `vscode-reveal` を使うとその場のレンダリングだけでなく、HTML や PDF のエクスポートもできるのですごく楽チンです。 更に、[Marp](https://yhatt.github.io/marp/) という Electron 製のツールもあり、こちらも簡単に Markdown によるスライドが作成可能です。 自分の好みや目的にあったツールを選定すると良いでしょう。
