---
title: GCP Cloud Functions を使ってみる
date: 2019-02-21 23:21:03
categories:
  - Cloud
  - GCP
tags:
  - cloud functions
  - gcp
---

普段は AWS を利用していますが、GCP を触る機会がてできそうなので、少しずつ覚えていこうと思います。まずは理解が簡単そうな `Cloud Functions` から触ってみます。

Cloud Functions はサーバーレスなプログラム実行環境です。コンピューティングリソースおよび欄タムは GCP か管理してくれるので、利用者は中身のコードのみに集中することができます。AWS にも、`AWS Lambda` という同様のサービスがあります。

実行可能なランタイム
---

2019/2/21 時点では、次のランタイムが使用可能でした。

* Go 1.11
* Node.js 6
* Node.js 8
* Python 3.7

ランタイム自体は AWS Lambda の方が多いようです。ただし、Cloud Functions ではパッケージマネージャの機能が利用できるので、依存モジュールの管理／パッケージングがすごく楽だと感じました。

サンプル
---

ためしに、`pyjokes` モジュールに依存する簡単な python プログラムをデプロイしてみようと思います。

* main.py

```python
# !/usr/bin/env python3
import pyjokes


def get_joke(request):
    joke = pyjokes.get_joke()
    return f'joke: {joke}'


if __name__ == '__main__':
    print(get_joke(None, None))
```

* requirements.txt

```text
-i https://pypi.org/simple
pyjokes==0.5.0
```

デプロイ
---

今回はお試し版なので、管理コンソールからさくっとデプロイしてみます。まず最初にデプロイパッケージを作成しましょう。

### デプロイパッケージの作成

パッケージは zip 形式にする必要があります。

```bash
$ zip deploy main.py requirements.txt
```

### デプロイ

特にこだわりがなければ、画像を参考に適当に入れてしまいましょう。

![deploy](https://www.evernote.com/l/AE2fWTqVnW5HZ6-3pKwFxPQwvXxsfxL7gBAB/image.png "deploy")

### ファンクションを実行

デプロイが完了したらテストしてみます。ブラウザまたは curl 等でファンクションの URL を叩いてみましょう。ちゃんとデプロイできていれば、pyjokes が出力したメッセージが返ってきます。なお、ファンクションの URL は、関数のトリガータブに表示されています。

感想
---

簡単にクラウド上でコードが実行できる本サービスですが、何よりもパッケージマネージャが使えることが素晴らしいです。自分で依存モジュールをかき集める煩わしさから開放されるので、とてもデベロッパフレンドリなサービスだと感じました。

蛇足
---

近いうちにブログを WordPress から Hexo もしくは Gatsby に移そうと裏で奮闘中。
