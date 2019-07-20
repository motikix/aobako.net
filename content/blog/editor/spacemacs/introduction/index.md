---
title: vim のような emacs のような。spacemacs に入門する
description: 誰しも自分好みのエディタを持っています。わたしも、、、わたしも、、、わたしも。。。今日から私は spacemacs を使います！！
date: 2018-11-04 23:21:03
categories:
  - Editor
  - Spacemacs
tags:
  - spacemacs
---

育児と仕事を言い訳に全く更新できておらず、久しぶりの投稿です。

普段使いのエディタは vscode だったりサクラエディタだったらりメモ帳だったりと気分や編集内容に応じて適当に使い分けています。サーバ作業のときは vim で適当にやってしまっており、emacs いいよ〜と耳にはしつつも、実際に使ったことがありませんでした。

vim で問題ないしなぁ。と思いつつも emacs で検索していると spacemacs というキーワードが…。公式 web のスクリーンショットを見て一発で惚れました。ロクでも無い動機ですが、自端末にインストールしてみたのでその導入までのメモです。

マシン
---

    macOS Mojave (10.14)
    

インストール
---

### emacs のインストール

spacemacs を使用するには、emacs 自体が必要となりますので、まずは emacs をインストールします。mac であれば homebrew でインストールできますので、サクッと入れてしまいましょう。

```bash
$ brew tap d12frosted/emacs-plus
$ brew install emacs-plus
$ brew linkapps emacs-plus
```

### spacemacs のインストール

続いて spacemacs のインストールを行います。インストールは GitHub からプロジェクトをクローンすることで行えます。 既に emacs を使用しているなど、ホームディレクトリに `.emacs.d` ディレクトリや `.emacs` ファイルが存在する場合はリネームして退避しておきましょう。

```bash
$ cd ~
$ mv .emacs.d .emacs.d.bak
$ mv .emacs .emacs.bak
```

リポジトリをクローンします。

```bash
$ git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d
```

spacemacs のデフォルトフォントが `Source Code Pro` なので、必要であればインストールしておきます（後から自由に変更可能なので、必須ではないです）。作業としてはこれだけで、ターミナルから emacs と打てば起動して、必要なパッケージが勝手にダウンロードされていきます。

[![Image from Gyazo](https://i.gyazo.com/76367d81668c3616ae01313de4b6c428.png)](https://gyazo.com/76367d81668c3616ae01313de4b6c428)

うーん。かっこいい…。

まだまだ使い始めたばかりでカスタマイズも全然できていませんので、これからゆっくりと温めていこうと思います。
