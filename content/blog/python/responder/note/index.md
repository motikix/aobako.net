---
title: Responder + gunicorn 構成でハマったところメモ
description: マニュアルをちゃんと読めば回避できた
date: 2020-03-16 21:48
categories:
  - Python
  - Responder
tags:
  - python
  - responder
---

２度とつらみを味わわないために．

KeepAlive
---
[デフォルトで２秒](https://docs.gunicorn.org/en/stable/settings.html#keepalive)になっている．これが前段のロードバランサーのアイドルタイムより短いと時たま 502 BAD_GATEWAY が発生していた．

AWS ALB とかだと 60 秒キープするので，それより長い値をセットする必要がある．

Blocking i/o
---
ASGIアプリであることの意味をちゃんと理解しておく．

どうやら Responder は async を付けるとイベントループで，付けないとスレッドで動くようだ（このへん -> https://github.com/taoufik07/responder/blob/df89d1d58ba962f232c425dbcba50c25128752cb/responder/routes.py#L131-L138）．

イベントループの場合は全てのリクエストが同スレッドで動くので，ブロッキング i/o が発生するとそこで他のリクエストの処理がとまる．

別に async じゃなくてええんや．と思っても POST ボディを読み込もうとすると[こいつの戻りが awaitable](https://responder.kennethreitz.org/en/latest/_modules/responder/models.html#Request.media)なので，async が必要．外部 API を呼んだりする必要があるのであれば，[aiohttp](https://github.com/aio-libs/aiohttp) 等ノンブロッキングなクライアントを使用する必要がある．
