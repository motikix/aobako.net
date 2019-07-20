---
title: これから Python で Web アプリを作るなら Responder なのか？
date: 2018-12-26 01:05:38
categories:
  - Python
  - Responder
tags:
  - python
  - responder
---

今まで Python で Web アプリを作るとなると、[Django](https://www.djangoproject.com/) もしくは [Flask](http://flask.pocoo.org/) が選択肢になっていたと思う。

Django はフルスタックなフレームワークであり、ORM やテンプレートエンジン、テストクライアント等を内蔵し、それぞれフレームワークの作法に従うことで一貫性のある実装ができるので、大規模開発に向いているといえる。

一方で、Flask は軽量なフレームワークであり、ごく基本的な Web アプリケーションとしての機能と、テンプレートエンジン程度しか装備していない。大規模開発には向かないが、簡単に実装できることから小さなアプリケーションや、プロトタイピング等を作成する場合に活躍する。

Responder は Flask (や、Falcon) を踏襲し、それぞれの良いところを１つのフレームワークとしてまとめている。デコレータによるルーティングなどは Flask そのもので、Flask を触ったことがあるのであれば、特に難しいところもなく導入できてしまいそう。[この辺](https://python-responder.org/en/latest/#ideas)に Responder のウリが記載されている。

まずは手を動かしてみる。ということで早速やってみる。

インストール
---

普通に pip でインストールするだけだが、せっかくなので pipenv で環境を切り離してやる。仮想環境用のランタイムはプロジェクトルートに作成するのが好みなので、`export PIPENV_VENV_IN_PROJECT=true` している。

```bash
$ mkdir py-responder; cd py-responder
$ pipenv --three
$ pipenv install responder --pre
# 12/24 時点で、`starlette` をバージョン指定でインストールしないと動かない (https://github.com/kennethreitz/responder/issues/266)
$ pipenv install starlette==0.8
```

チュートリアル
---

チュートリアルにあるいくつかの API を実装してみる。

### Hello World

まずは単純に `hello, world!` の文字列を返す API から。

```python
# app.py
import responder

api = responder.API()


@api.route('/')
def hello_world(req, res):
	res.text = 'hello, world!'


api.run(port=8080)
```

`localhost:8080` にアクセスすると、`hello, world!` が返ってくる。

クライアントからのリクエストを受信すると、`@api.route` でデコレートされた関数にルーティングされる。この辺は Flask と同様であるが、request/response を関数の引数で直接受け取り、`res.text` や `res.media` などレスポンスのフィールドに戻りの値をセットするだけで、任意のレスポンスを返すことができ、非常に簡単に API を実装できる。

### パスパラメータ

パスパラメータを用いた URI を使用すると、パラメータ部分を関数の引数で直接受け取ることができる。

```python
# app.py

@api.route('/hello/{who}')
def hello_to(req, res, *, who):
	res.text = f'hello, {who}!'
```

`localhost:8080/hello/hoge` にアクセスすると、`hello, hoge!` が返ってくる。

### YAML / JSON を返す

`res.media` フィールドに戻りの値をセットすると、JSON 形式のレスポンスを受け取れる。この場合、戻りの値は dict 形式の値をセットすればよい。

また、クライアントが `Accept: application/x-yaml` ヘッダ付きでリクエストしてくる場合、戻りの型も自動的に x-yaml 形式で返る模様（そんなに使わないんじゃないかな）。

```python
# app.py
    
@api.route('/hello/{who}/jsonyaml')
def hello_to_json_or_yaml(req, res, *, who):
	res.media = {'hello': who}
```

`localhost:8080/hello/hoge/jsonyaml` にアクセスすると、`{"hello": "hoge"}` が返ってくる。

### テンプレートを使用する

[jinja2](http://jinja.pocoo.org/docs/2.10/) を内蔵しているようなので、ビューにテンプレートを利用できる。

```python
# app.py

# テンプレートの配置ディレクトリは api のイニシャライズで指定する（デフォルトは `templates`）。
api = responder.API(templates_dir='tmp')

@api.route('/hello/{who}/html')
def hello_to_html(req, res, *, who):
	res.content = api.template('hello.html', who=who)


<!-- tmp/hello.html -->
<html>
  <head>
	<title>Response with Jinja2</title>
  </head>
  <body>
	Hello { { who }} !
  </body>
</html>
```

`localhost:8080/hello/hoge/html` にアクセスすると、次のようなレスポンスが返る。

```html
<html>
  <head>
	<title>Response with Jinja2</title>
  </head>
  <body>
	Hello hoge !
  </body>
</html>
```

### HTTP ステータスコードを指定する

HTTP ステータスコードの指定もシンプルに実装できる。

```python
# app.py

@api.route('/418')
def teapot(req, res):
	res.status_code = api.status_codes.HTTP_418  # 直接 418 をセットしても同じ
```

### レスポンスヘッダを指定する

`res.headers` が辞書型なので、普通に項目を追加するだけ。

```python
# app.py

@api.route('/pizza')
def pizza_pizza(req, res):
	res.headers['X-Pizza'] = '42'
```

### 非同期 API

`async/await` を用いたバックグラウンド処理を実装できる。レスポンスは直ぐ様クライアントに返るが、バックグラウンド処理はレスポンスが返ったあとも動き続ける。

```python
# app.py

@api.route('/incoming')
async def receive_incoming(req, res):

	@api.background.task
	def process_data(data):
		time.sleep(3)
		print('3 second passed')

	data = await req.media()
	process_data(data)
	res.media = {'success': True}
```

`localhost:8080/incoming` にアクセスすると、すぐに `{"success": true}` というレスポンスが返り、3 秒後に `3 second passed` というメッセージが出力される。

まとめ
---

まずはチュートリアルの API を実際に実装してみて、雰囲気を掴むことはできた。Flask と比べて、Request/Response へのアクセスが容易であったり、サードパーティ製のモジュールなしに JSON/YAML のデータを扱えたりと実装者に優しいフレームワークになっていると感じた。まだまだ新しいフレームワークであり、ドキュメントも整っているとは言い難く、しばらくあれこれと触ってみようかと思う。
