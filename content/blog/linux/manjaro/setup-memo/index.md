---
title: Manjaro の初期セットアップでやること
description: いつも忘れるのでメモ
date: 2020-10-11 00:04
categories:
  - linux
tags:
  - linux
  - manjaro
  - ibus
  - skk
  - vim
---

Manjaro に限った話ではないのだが、いつもセットアップまわりで忘れてしまうのでメモしておく。インストール方法は良質な記事がネットに転がっているのでそちらを見れば大丈夫であろう。

## 環境

* MacBook Pro (Retina, 15-inch, Mid 2015)
* Manjaro Cinnamon (20.1.1)

### パッケージマネージャ

* pacman
* yay

### シェル

* fish
* fisher

### ターミナル

* tilix
* tmux (+ https://github.com/gpakosz/.tmux)
* starship

### エディタ

* vim (なんとなく素の状態で使いたいときはこっち)
* neovim

### 日本語入力

* ibus
* ibus-skk

### その他

* git
* asdf
* docker
* fzf
* ripgrep
* exa
* fd
* bat
* tokei
* colordiff
* diff-so-fancy

## メモ

dconf で何かやったような着もするがあまり覚えてない…。

### CapsLock を Control キーにする

`Menu` -> `Keyboard` -> `Layouts` の `Options` から設定できる (Ctrl Position)。

これやらないとつらい。

### Emacs キーバインドにする

    gsettings set org.cinnamon.desktop.interface gtk-key-theme Emacs

### Command キーでメニューが開かないようにする

macOS 時は Google 日本語入力を使用しており、Karabiner-Elements で Command キーで IME の切り替えを行なっていた。今回は日本語入力に SKK を導入するので、手癖で押してしまったときにいちいちメニューが開いて煩わしいのでショートカットを無効にしておく。

ここ微妙にハマって、ずっと `Keyboard` のショートカットメニューを探していたが、実際はメニューアイコンのコンテキストメニューから設定画面を開くことができる。

今回は `Super + A` でメニューが開くように変更した。

### ウィンドウタイリング、ワークスペースまわりの設定をする

`Menu` -> `Keyboard` にて。

* Super + ↑↓←→ :: ウィンドウの移動
    * Shift を押しながらでウィンドウを別ディスプレイに送る
* Super + Enter :: 最大化
* Ctrl + Alt + (←→ or 1-5) :: ワークスペースの移動 (大体 5 ワークスペースくらいにしている)
    * Shift を押しながらでウィンドウを別ワークスペースに送る

### Super + @ でウィンドウを閉じるようにする

押しやすいから。

### タッチパッドでブラウザバックやピンチできるようにする

`libinput-gestures` でやる。
