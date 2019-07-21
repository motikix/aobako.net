---
title: ブログを Gatsby + Netlify に移行した
description: Wordpress で構築されていたブログを Gatsby + Netlify 構成で再構築した。ここまでできて無料の Netlfy すごい。
date: 2019-07-21
categories:
  - blog
tags:
  - gatsby
  - netlify
---

Wordpress は CMS の中でもメジャーで、自身がブログを開始した際も特別深く考えずに Wordpress を採用した記憶がある。

テーマ、プラグイン共に非常に豊富で、運用面で特に不満があったわけではないが、どうせならエンジニア色の強いプロダクトを採用したいなという思いが急に湧き上がり、いくつかのライブラリを触ってみた結果、React(SPA) + GraphQL という何とも魅力的な技術要素を含んだ [GatsbyJS](https://www.gatsbyjs.org/) を採用してみることにした。

## GatsbyJS
GatsbyJS は、React, Webpack, CSS(SASS, CSS modules, styled components) といったモダンなフロントエンド技術を用い、かつ GraphQL によるシームレスなデータバインドを実現している。

GraphQL 自体、実際の運用で使うにはどうにもとっつき辛い印象であったが、マークダウンをデータリソースとして GraphQL でデータを吸い上げ → React コンポーネントにバインド → HTML を生成といった様に、ビルドシーケンスの中にうまく GraphQL が統合されている。

ビルド時にフックすることで、独自の処理を差し込んだりとカスタマイズ性も高く、単にブログとして記事を書く以外にも楽しめる部分が多いのではないだろうか。

## Netlify
高機能なホスティングサービスで、ホスティングのみに留まらず、Github などのコード管理システムと連携することで、ビルド → デプロイ → ホスティングを簡単な操作のみで構築できるようになる。また、無料の範囲でもカスタムドメイン、SSL 対応まで完備。

元々 Wordpress でブログを構築していたときは、XServer + お名前.com という構成であったが、ドメインはともかく、サーバー代を払い続けることにどうにも抵抗があり、今回 Netlify を採択した。

GitHub Pages でも同様のことはできるが、Netlify のマネージド DNS を利用することで CDN が利用できるということで魅力を感じた。

## 構築メモ
そう何回もやるものでも無いが、構築手順をメモしたので記載しておく。なお、実際に利用しているリポジトリは [syuni/aobako.net](https://github.com/syuni/aobako.net) である。

なお、下準備として Wordpress で構築していた際の記事は全て Markdown 化している。

### ローカル
ローカルの環境構築手順を記す。

まずは Gatsby コンテンツを操作 (開発サーバー、ビルド、サーブ) するための CLI を導入する。

```shell:title=bash
$ npm install -g gatsby-cli
```

つづいて、新規 Web サイトを作成する。

```shell:title=bash
$ cd /path/to/workspace

# スターターに gatsby-starter-blog を使用する
$ gatsby new aobako.net https://github.com/gatsbyjs/gatsby-starter-blog
```

つづいて、依存モジュールをインストールし、開発サーバーを立ちあげる。

```shell:title=bash
$ cd aobako.net

# 依存モジュールのインストール
$ yarn

# 開発サーバー (localhost:8000) の起動
$ yarn develop
```

`localhost:8000` にアクセスすることで、ブログが閲覧できることを確認する。

### GitHub
新規リポジトリを作成し、上記で作成したプロジェクトを Push しておく。

見栄えは違うだろうけど、多分 ![GitHub](https://www.evernote.com/l/AE1rzLMzkyJEZbvO5O3TKb324ixK5H4FyywB/image.png "GitHub") こんな感じになっているはず。

### Netlify
Netlify 側の設定 (アカウント作成、GitHub 連携、カスタムドメイン、SSL) 手順を記す。

- [公式 Web](https://www.netlify.com/) にて `Get started for free` ボタンをクリック。

![account-1](https://www.evernote.com/l/AE10Yc7Kr2JDFLVOAOnQMemNWV03u6_LlN0B/image.png "account-1")

- 各種サービスアカウント or Email にてサインアップする。

![account-2](https://www.evernote.com/l/AE1QiunRGA9PboVexU1QhsR6hGVNB0LOPzsB/image.png "account-2")

- (GitHub と連携した場合) `New site from Git` をクリック。

![account-3](https://www.evernote.com/l/AE0CFrP-HeFAW5ltaYEqFXYVk6TrWufL6iAB/image.png "account-3")

- `GitHub` ボタンをクリック。

![account-4](https://www.evernote.com/l/AE01LJEA7jtDir234bMOUIdlvrIGPC36d1oB/image.png "account-4")

- 連携するリポジトリを選択する (ここで先程作成したリポジトリを選択)。

![account-5](https://www.evernote.com/l/AE1PxyclMCtN4a4e_9ebykAo1J8Gj3bJm5MB/image.png "account-5")

![account-6](https://www.evernote.com/l/AE1dm1l4_itIFqgQ4qZPNeMBmT7Ja46jTr8B/image.png "account-6")

- オーナー & デプロイするブランチを指定する。`Basic build settings` は好みの設定で (この手順に従うのであれば、特に変更はしない)。

![account-7](https://www.evernote.com/l/AE3Fzt4bBalNRad66dKBXCQJuy7VGlyMwLAB/image.png "account-7")

- しばらく待って、デプロイが完了すれば、既にサイトに接続できる状態になっている。左上にあるアンカーが自身のサイト (Netlify ドメイン) となる。

![account-8](https://www.evernote.com/l/AE0UESbMFf5LAqewZY4_g5TM_9caN_Wf_egB/image.png "account-8")

### DNS
DNS 側 (お名前.com 利用) での設定手順を記す。

- Netlify 管理コンソールのルート (`xxx's team` 的な階層) の `Domain` タブから、カスタムドメインを登録する。

![](https://www.evernote.com/l/AE2t8E-yVvxIoq7akZgOIlrEATlaUb3QaQcB/image.png)

- Netlify ネームサーバーの次の 4 つのドメインを控えておく。

![](https://www.evernote.com/l/AE1sGEF7FO9M2Yo7mbi1EmzQiPht9UMLA_IB/image.png)

- お名前.com にログインし、ドメイン設定 → ネームサーバーの設定 → ネームサーバーの変更にて、先程控えたドメインを登録する。場合によっては更新完了に時間がかかることがあるので、気長にまつ。

![](https://www.evernote.com/l/AE12iFBL3WNE8YXryscZXZwBoosXEcCvCmYB/image.png)

### SSL
HTTPS に対応させるには、Netlify 管理コンソールのサイトの Settings → Domain management → HTTPS の項目にて、`Let's Encrypt` にて証明書を有効にすれば良い。

### リダイレクト
http でのアクセスを https にリダイレクトする or Netlify ドメインでのアクセスをカスタムドメインにリダイレクトするには、`static` ディレクトリに `_redirects` というファイルを用意してデプロイすれば良い。

参考までに、自分の設定は次のとおり。

```text:title=_redirects
http://aobako.netlify.com/*  https://aobako.net/:splat  301!
https://aobako.netlify.com/*  https://aobako.net/:splat  301!
http://aobako.net/*  https://aobako.net/:splat  301!
http://www.aobako.net/*  https://aobako.net/:splat  301!
https://www.aobako.net/*  https://aobako.net/:splat  301!
```

## まとめ
Wordpress 時代から Markdown で執筆していたので、特に違和感なく移行できた。むしろ、管理画面に入らずにローカルマシンから記事の更新ができるなど、運用面で非常に快適となった。もちろんそれだけでなく、SPA であることを多いに活かした高速なレンダリングやページ遷移などすばらしい部分が多い。

デザイン面やその他のコンテンツについてはまだまだ対応できていないが、次第にパワーアップさせていきたい。
