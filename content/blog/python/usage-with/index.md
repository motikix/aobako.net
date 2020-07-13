---
title: Python における with 文の使用方法
description: Python には便利な言語仕様がたくさんあります。今回はコンテキストマネージャによって制御される with 文について触ってみました。
date: 2019-03-21 23:07:00
categories:
  - python
tags:
  - python
---

比較的よく見かける with 文ですが、使用箇所から感じるなんとなくの雰囲気だけでちゃんと調べたことも無かったので、今回軽く調べてみてのメモ書きです。

こんなとこに with
-----------------

比較的よく使う機能ですが、以下のような機能で with 文が使用されます。

- [file](https://docs.python.org/ja/3/tutorial/inputoutput.html#reading-and-writing-files)
- [urllib](https://docs.python.org/ja/3/library/urllib.request.html#examples)

結局、with 文はなんなのか？
---------------------------

[Python ドキュメント](https://docs.python.org/ja/3/library/stdtypes.html#context-manager-types) には次のように記されています。

> Python の with 文は、コンテキストマネージャによって定義される実行時コンテキストの概念をサポートします。これは、文の本体が実行される前に進入し文の終わりで脱出する実行時コンテキストを、ユーザ定義クラスが定義できるようにする一対のメソッドで実装されます。

何のこっちゃと思うところではありますが、要は with 文の最初 (enter) と最後 (exit) のタイミングに実行させたい処理をメソッド本体とは切り離して定義できますよ。ということでしょうか。

データベースやファイルなど外部リソース接続時のクローズ処理など、ある程度お決まり、かつ忘れるとよろしくない部分を予め実行されるように仕込んでおく、などの使い方ができます。

サンプル
--------

練習がてら、コンテキストマネージャと、with を用いた処理を書いてみます。

### ベーシック

クラスに `__enter__` メソッドと `__exit__` メソッドを実装します。

#### `__enter__` メソッド

with 文開始時にコールされます。

ここで返す値なりオブジェクトを with 文の as エイリアスで受けることができます（ドキュメントをよく読まず、数分ここでハマった）。

#### `__exit__` メソッド

with 文終了時にコールされます。

`exc_type`, `exc_value`, `traceback` は with 文内で例外が発生した際に例外情報を受取ります。例外が発生しないときはすべて None がセットされます。

また、このメソッドのレスポンスは例外発生時の例外の扱いを指示するものであり、`True` を返すと例外の伝播が抑止され、`False` を返すと例外が呼び出し元に伝播します。

```python
class Bar:
    def __init__(self, s):
        self.s = s

    def __enter__(self):
        print('__enter__ called')
        return self             # ここ忘れると悲しい

    def __exit__(self, exc_type, exc_value, traceback):
        print('__exit__ called')
        # with 文の中で例外が発生するとこれらの引数にエラー情報がセットされる
        # それ以外のときは NoneType
        print('exc_type: ' + str(exc_type))
        print('exc_value: ' + str(exc_value))
        print('traceback: ' + str(traceback))
        # True を返すと例外の伝播を抑止する
        # False を返すと例外が伝播する
        return True

    def bar(self):
        return 'bar: ' + self.s


if __name__ == '__main__':
    with Bar('with dayo') as bar:
        print(bar.bar())
```

これを実行すると、次の様な出力が得られるはずです。

```
__enter__ called
bar: with dayo
__exit__ called
exc_type: None
exc_value: None
traceback: None
```

なお、with 文を用いず、単純に `Bar` のインスタンスを作成する場合、コンテキストマネージャが働かず、
`__enter__`, `__exit__` は実行されません。

所感
----

アプリケーションを構築するうえでリソースの開放漏れというのは非常に厄介です。テストでは気づきにくく、ローンチ後も見かけ上は問題なく動作してしまいます。

問題に気づくのは大抵レスポンスが悪くなっていたり、最悪アプリケーションが停止したり何らかの目に見える被害が発生してからです。こういった不具合はビジネスにも大きな影響を与えることになります。

with 文の様に、言語レベルで予防策を講じることができるのは非常に有用だと思います。
