---
title: Reflex に FastAPI のエンドポイントを生やす
date: 2024-11-22 22:28
categories:
  - programming
tags:
  - python
  - reflex
  - fastapi
---

普通にマニュアルにあった -> [https://reflex.dev/docs/api-routes/overview/](https://reflex.dev/docs/api-routes/overview/)

Reflex のバックエンド部分は FastAPI で構築されており、エントリーポイントでやっているであろう `app = rx.App()` で作られる App インスタンスには `.api` でアクセスできるフィールドがある。それが `FastAPI` のインスタンスになっているので、`app.api.add_api_route()` とすることで自由にエンドポイントを生やすことができる。

ただし、`/ping`, `/_event`, `_upload` は reflex で予約されているらしく、上書きしてしまうと壊れる可能性があるので注意。今後のバージョンアップも見込んで `/api/xxx` のように一段階深い階層にしておくと良さそうだ。

例:

```python
# main.py
import reflex as rx
from .api.echo import echo

class State(rx.State):
    ...

def index() -> rx.Component:
    ...

app = rx.App()
app.add_page(index)
app.api.add_api_route("/api/echo", methods=["POST"], endpoint=echo)

# ./api/echo.py
from pydantic import BaseModel

class EchoBody(BaseModel):
    message: str

async def echo(body: EchoBody) -> EchoBody:
    return EchoBody(message=f"echo: {body.message}")
```
