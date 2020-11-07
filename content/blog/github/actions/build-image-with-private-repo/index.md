---
title: GitHub Actions でプライベートリポジトリの Python パッケージを使ってみる
description: GitHub Actions + Docker + Pipenv でプライベートリポジトリのパッケージをインストールするときの Tips
date: 2020-11-07 00:51
categories:
  - github
  - github actions
  - docker
  - pipenv
tags:
  - github
  - github actions
  - docker
  - pipenv
---

通常、GitHub で管理されている Python パッケージは次のようにインストールすることができる。

```console
$ pipenv install git+ssh://git@github.com/syuni/test-private-b.git#egg=private-b
```

このとき、プライベートなリポジトリの場合は認証が必要になるので、SSH を使用する場合は別途認証用のキーペアを作成し、GitHub のアカウントに登録しているだろう (HTTPS の場合は PAT あたりになると思うが、自分はいつも SSH でやっている)。

これと同様のことを GitHub Actions 上でやろうとしたときに少々悩んだので一度整理しておく。

前提、およびやりたいこと
--

* リポジトリＡとリポジトリＢがあり、Ａの Python プログラムはＢの Python パッケージを参照しているとする (リポジトリＢはプライベートである)。
* リポジトリＡは Docker コンテナによるコンテナライズされたアプリケーションである。
* GitHub Actions によって、イメージを自動ビルドする CI を構築したい。

問題となるところ
--

* プライベートリポジトリのパッケージをインストールするために、SSH の鍵が必要で、これを GitHub Actions --> Docker Build にそれぞれ連携する必要がある。

アプローチ
--

基本的に CircleCI でやっていた方法と似ている。CircleCI の場合は SSH 鍵を登録する機能が存在するが、GitHub Actions には無いので、Secret 経由で秘密鍵のフレーズを連携し、自分で鍵を SSH-Agent に登録する感じになる。

### 準備

まず、鍵ペアが無い場合は予め作成しておく必要がある。鍵をデプロイキーとするか、ユーザーキーとするかは用途次第だが、今回はユーザーキーであるものとする。

キーペアを作成と公開鍵の登録が完了したら、続いてリポジトリＡへ秘密鍵を登録する。登録はリポジトリ -> Settings -> Secrets から実施できる。ここで。 `SSH_KEY` という名前で登録した場合、アクション内では `${{ secrets.SSH_KEY }}` とすることで参照できる。

### GitHub Actions ワークフロー

概ね次のような内容でうまく動作する。

```yaml
name: build
on: push
jobs:
  build:
    name: Build docker image with SSH key
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Setup SSH key
        env:
          SSH_AUTH_SOCK: /tmp/ssh_agent.sock
          SSH_KEY: ${{ secrets.SSH_KEY }}
        run: |
          mkdir -p ~/.ssh
          ssh-keyscan github.com >> ~/.ssh/known_hosts
          ssh-agent -a $SSH_AUTH_SOCK > /dev/null
          ssh-add - <<< "${SSH_KEY}"
      - name: Build docker image
        env:
          DOCKER_BUILDKIT: 1
          SSH_AUTH_SOCK: /tmp/ssh_agent.sock
        run: docker build --ssh default -t actions-test:latest .
      - name: Run image
        run: docker run actions-test:latest
```

ここで重要なのが 2 つ目のステップで、秘密鍵を登録 & Docker ビルドコンテナに鍵を渡すために `ssh-agent` を起動すること。Docker は `--ssh` オプションを使用することで、安全に秘密鍵を渡すことができる。

### Refs

* https://qiita.com/suthio/items/2760e4cff0e185fe2db9
* https://www.webfactory.de/blog/use-ssh-key-for-private-repositories-in-github-actions
* https://qiita.com/takasp/items/56e1399a484ed5bfaade#%E3%81%AF%E3%81%98%E3%82%81%E3%81%AB
