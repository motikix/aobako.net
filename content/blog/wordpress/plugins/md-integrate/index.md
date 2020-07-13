---
title: WordPress も Markdown でラフに書こうよ
description: Qiita、はてブメインで技術ブログを書いていた僕が WordPress にきて Markdown で記事を書くために導入したプラグインを紹介します。
date: 2018-04-22 23:34:46
categories:
  - wordpress
tags:
  - wordpress
  - markdown
  - jp markdown
---

こんにちは。syuni です。

WordPress でブログを書いているみなさん。記事はどんな環境で書いていますか？WordPress 上の WYSIWYG エディタ？メモ帳？はたまたアレクサに話しかけて文字起こし？と、文章を書く環境にも全くこまらない今日このごろですが、ぼくはもともと Qiita に投稿していた口なんですが、そのせいかとりあえず Markdown で書く癖が付いてしまっています。

ということで、今回は Markdown でラフに記事を書いて、WordPress で投稿するためのプラグインをご紹介します。

\* 今回の記事は [Atom](https://atom.io/) & [Markdown](http://www.markdown.jp/what-is-markdown/) で書いたものを、WordPress にコピペしています。

Markdown（マークダウン）とは
---

軽量マークアップ言語のひとつで、特定書式のプレーンなテキストをレンダリングすることでマークアップ（HTML）を生成します。

例えば、Markdown における `#` は見出しを表します。

```markdown
# 見出し１
```

これは以下のように解釈されます。

```markdown
<h1>見出１</h1>
```

このようにに少ない記述で手軽に文章構造を表現できるので、簡易的なメモとしても比較的使いやすいテキスト形式です。

JP Markdown
---

WordPress で手軽に Markdown を扱うためのプラグインが [JP markdown](https://wordpress.org/plugins/jetpack-markdown/)です。導入するだけで、Markdown での投稿が可能になります。導入も簡単。WordPress の管理コンソールのプラグインで「JP Markdown」と入力すれば OK。

### 基本的なシンタックス

いくつかシンタックスがありますが、簡単なのですぐに覚えられるでしょう。

代表的なものを紹介します。

```markdown
## 見出し

# h1
## h2
### h3
#### h4
##### h5
###### h6

## 文字装飾

_イタリック_
*イタリック*

__ボールド__
**ボールド**

## リスト

- リスト
- リスト
  - リスト
  - リスト
- リスト

* リスト
* リスト
  * リスト
  * リスト
* リスト

## 番号つきリスト

1. リスト
1. リスト
  1. リスト
  1. リスト
1. リスト

## テーブル

| Markdown | を | 使うと |
| :-: | :-: | :-: |
| テーブルも | 簡単に | 書けます |

## リンク

この記事は [マークダウン](https://ja.wikipedia.org/wiki/Markdown) で書いています。

あとでまとめてリンクを張る場合は次の記述になります。

syuni のソーシャルリンク [twitter][1] 、 [facebook][2] です。フォローしてね。

[1]: https://twitter.com/motikix "ツイッター"
[2]: https://www.facebook.com/inoue.syun.33 "フェイスブック"

## イメージ

![イメージへのリンク](https://3.bp.blogspot.com/-tMg5p4_GxfQ/WmqhZvwM-MI/AAAAAAABJ1M/Mc9xGyqFwEUpNtreR0VO_CXMt4gS4DVGwCEwYBhgL/s800/game_social_sns_happy.png 'イメージへのリンク')

## 引用

> 行頭に (>) 記号で引用になります。

## コードブロック

\`\`\`
バックティック3つで囲うとコードブロックになります。
\`\`\`
```

一部ではありますが、このあたりのシンタックスさえ覚えてしまえば問題ないでしょう。WordPressで使用可能なシンタックス一覧は[こちら](https://en.support.wordpress.com/markdown-quick-reference/)を参照下さい。

上記のマークダウンは、次の様にレンダリングされます。[別ページで確認する](/sample-markdown)

まとめ
---

今回は Markdown で簡単に文章を書く方法をご紹介しました。Markdown は手軽に文章を書ける一方、レンダリングする側次第で使えないシンタックスがあったりと、かなり派生文法があることも特徴です。あくまで下書きを Markdown で書き起こし、清書は別のライティングツールで。といった分担をすることも重要かもしれません。ここまで書いておいてあれですが、ご自身にあったライティングで快適な WordPress 生活を送りましょう。
