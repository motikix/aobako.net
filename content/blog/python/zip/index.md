---
title: (備忘) よくわすれる zip 
description: 
date: 2019-08-31 01:20:00
categories:
  - Python
tags:
  - python
---

Python には zip という組み込み関数が存在するが，割と使用するくせに良く使用方法を忘れるのでメモしておく．

## zip(*iterables)
公式では次のように触れられている．

> それぞれのイテラブルから要素を集めたイテレータを作ります。

つまり，リストなどのイテラブルなデータを複数わたすことで，合成したひとつのイテラブルなオブジェクトが返ってくる．

```python:title=sample_1
l_a = ["foo", "bar", "baz"]
l_b = [1, 2, 3]

zipped = zip(l_a, l_b)

print(zipped)

# <zip object at 0x10a220f00>
```

イテレータなので，ループでまわせる．

```python:title=sample_2
for item in zipped:
    print(item)

# ('foo', 1)
# ('bar', 2)
# ('baz', 3)
```

↑タプルでとれる．

```python:title=sample_3
for a, b in zipped:
    print(a, b)

# foo 1
# bar 2
# baz 3
```

↑とすればそれぞれの変数に展開．

また，list & dict に直接キャストすることができる．

```python:title=sample_4
print(list(zipped))
# [('foo', 1), ('bar', 2), ('baz', 3)]

print(dict(zipped))
# {'foo': 1, 'bar': 2, 'baz': 3}
```

zip したリストを元に戻す場合は次のようにする．

```python:title=sample_5
a, b = zip(*zip(l_a, l_b))
print(a)
# ('foo', 'bar', 'baz')
print(b)
# (1, 2, 3)

```

これでちゃんと覚えた．
