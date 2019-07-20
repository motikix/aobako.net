---
title: eslint & prettier で javascript のコードを常にきれいに
date: 2018-07-24 01:24:36
categories:
  - JavaScript
  - Code
tags:
  - javascript
  - linter
  - formatter
  - eslint
  - prettier
---

一人でコードを書く分には、自分の頭の中のコード規約に従い常に一定のコードを書くことは可能です。しかし、チームでの複数人開発となると、どれだけコード規約がしっかりと文書化されていても、完璧に規約に遵守したコードを維持するのは大変です。コードレビューを実施するにしても非常にコストが掛かるし、なによりプロダクトコードの内容を評価すべきレビューで規約との突き合わせをチェックするのは本質的ではありません。

javascript のレビューがツラい
---

javascript は非常に面白い言語ですが、動的型付けや ECMAScript の仕様改訂のサイクルが短く、常に新たな記法に対する対応が求められます。また、自由度も高いために実装者独自のセンスでかなりコードの雰囲気に差が出てくる言語でもあります。規約に従っていることが必ずしもプロダクトの品質に直結するわけではありませんが、メンテナビリティを考えると一定のレベルでの一貫性を持たせたいと思うのは誰もが思うところではないでしょうか。

構文チェッカとコードフォーマッタ
---

このような場面で力を発揮するのが、構文チェッカとコードフォーマッタです。構文チェッカはプログラムの文法や型、変数の未宣言などを静的に検知するツールです。C言語では lint と呼ばれているものがありますが、eslint はその ECMAScript バージョンと言えます。コードフォーマッタはその名のとおり、プログラムをある一定のルールに従い整形するツールを指します。eclipse などの IDE で目にする人も多いのではないでしょうか。今回は構文チェッカに eslint、コードフォーマッタに prettier を用いて、チーム開発におけるコードの質を一定に保つ方法をご紹介します。

実践してみよう！
---

早速、実践してみることにします。なお、これから使用するツール類は Node.js 上で動作します。モジュールも npm でインストールすることになりますので、予め準備しておきましょう。

### Step1. プロジェクト作成

まずは作業ディレクトリを作成し、プロジェクトルートとします。

```bash
$ mkdir ~/js-code-quality
$ cd ~/js-code-quality
```

ディレクトリに移動後、以下のコマンドを実行し、プロジェクトを作成します。（パッケージ管理に yarn を使用していますが、npm を使用しているかたは適宜読み替えるようにお願いします）

```bash
    $ yarn init -y
```

package.json が作成されていれば成功です。

### Step2. esilnt を試す

まずは eslint を単独で試してみましょう。次のコマンドを実行し、eslint をインストールします。

```bash
$ yarn add --dev eslint
```

インストールできましたか？次のコマンドを実行してみましょう。

```bash
    $ yarn eslint --version
    v5.1.0
```

インストールに成功していれば、eslint のバージョンが表示されます。続いて、eslint のルールファイルを作成します。eslint はユーザが独自にルールをカスタマイズできるようにコンフィグベースで動作するようになっています。一から手作業で作成することもできますが、面倒なのでウィザードにお任せすることにします。

```bash
$ yarn eslint --init
? How would you like to configure ESLint? Answer questions about your style
? Which version of ECMAScript do you use? ES2015
? Are you using ES6 modules? Yes
? Where will your code run? Node
? Do you use JSX? No
? What style of indentation do you use? Spaces
? What quotes do you use for strings? Single
? What line endings do you use? Unix
? Do you require semicolons? No
? What format do you want your config file to be in? JSON
Successfully created .eslintrc.json file in .../js-code-quality
```

質問と選択した内容は以下のとおりです。他にどのような選択肢があるかは公式のドキュメントを参照してみてください。

| No | 質問 | 質問の意味 | 回答 | 回答の意味 |
| :-: | :-- | :-- | :-- | :-- |
| 1 | How would you like to configure ESLint? | どのようにコンフィグを生成するか | Answer questions about your style | 質問に答えて |
| 2 | Which version of ECMAScript do you use? | どのバージョンの ECMAScript を使用するか | ES2015 | ES2015 (es6) を使用する |
| 3 | Are you using ES6 modules? | ES modules を使用するか | Yes | 使用する |
| 4 | Where will your code run | どのプラットフォームでコードを実行するか | Node | Node.js で実行する |
| 5 | Do you use JSX? | JSX を使用するか | No | 使用しない |
| 6 | What style of indentation do you use?| インデントスタイルに何を使用するか | Spaces | スペースを使用する |
| 7 | What quotes do you use for strings? | 文字列の引用符に何を使用するか | Single | シングルクォートを使用する |
| 8 | What line endings do you use? | 改行コードに何を使用するか | Unix | Unix (LF) を使用する |
| 9 | Do you require semicolons? | セミコロンを強制するか | No | 強制しない |
| 10 | What format do you want your config file to be in? | コンフィグファイルのフォーマットはどうするか | JSON | JSON形式にする |

上述の内容が反映された、`eslint.config.json` が作成されています。使用するプロジェクトの特性に応じて、独自にカスタマイズして使用するのが、eslint の基本的な利用方法となります。

さて、早速 eslint の動きを見てみましょう。まずは適当なコードをプロジェクトルートに作成します。ここでは、`index.js` とでもしておきます。

```bash
// index.js
"use strict"

const sum = (...values) => values.reduce((prev, curr) => prev + curr);

console.log(`1 + 2 + 3 = ${sum(1, 2, 3)}`)
```

先程指定したルールに即していない部分があります。２行目のダブルクォートと、４行目末尾のセミコロンです。（実は、`console.log` も怒られるポイントなのですがここでは無視します）

ターミナルを起動し、プロジェクトルートで次のコマンドを実行してみます。

```bash
$ cd path/to/project
$ yarn eslint index.js
../js-code-quality/index.js
  1:1   error  Strings must use singlequote  quotes
  3:70  error  Extra semicolon               semi
  5:1   error  Unexpected console statement  no-console

&#x2716; 3 problems (3 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

ちゃんと指摘してくれました。（なお、`--fix` オプションを指定して実行すると、エラー箇所を同時に修正してくれます）

### Step3. prettier を試す

続いて、prettier を用いて、コードフォーマットをかけてみましょう。

先程の `--fix` オプションのように、eslint でもある程度のコードフォーマットは可能ですが、eslint はあくまでもリントツールですので、フォーマット自体は prettier にまかせてしまうのが得策です。

以下の２パッケージをインストールします。

```bash
$ yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier
```

* prettier prettier 本体。
* eslint-config-prettier フォーマット関連のルールを無効にする。（eslint と prettier の競合項目を無効にする）
* eslint-plugin-prettier eslint のルールとして prettier を実行する。

`eslint.config.json` を次のように修正します。

```json
{
  "env": {
	"es6": true,
	"node": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "plugins": ["prettier"],
  "parserOptions": {
	"ecmaVersion": 2015,
	"sourceType": "module"
  },
  "rules": {
	"no-console": "off",
	"prettier/prettier": [
	  "error",
	  {
		"semi": false,
		"singleQuote": true,
		"trailingComma": "none"
	  }
	]
  }
}
```

ミソは `extends` タグと `plugins` タグ、それに `rules` タグです。それぞれ prettier 関連の定義を追加しています。これにより、prettier でフォーマットしたコードが eslint に渡され構文チェックが実行されるようになります。

### Step4. エディタと連携する

上述のようにいちいちコマンドラインでフォーマット＆チェックを実行するのは非効率です。特定のモダンなエディタであれば、eslint や prettier と連携することができるので、活用していきましょう。ここでは詳細は割愛します。詳しくは、ご利用のエディタのエクステンションを探して見てください。

### Step5. Gitと連携する

上記のタスクを実施することでチーム開発におけるコードのフォーマットに関する課題はほぼほぼ解消できると言えます。しかしながら、各メンバが必ずしもフォーマッタを実行するとは限りません（人によってはエディタも異なるので、そもそもフォーマッタが実行されない可能性もあります）。これでは未整形のコードが開発リポジトリに紛れ込む可能性がありますので、ダメ押しの一手を打っておくことにします。

Git にはフックと呼ばれる機構があり、予めスクリプトを用意しておくことで Git の特定のイベントに反応してスクリプト処理を実行することができます。今回はコミット前にコードをフォーマットできればよいので、`precommit` と呼ばれるフックを定義し、メンバーがコミットコマンドを叩いたタイミングでフォーマットされるようにします。

まずは、次のパッケージをインストールします。

```bash
$ yarn add --dev lint-staged husky
```

* `lint-staged` は Git ステージに上がっているコードに対してリントを実行するライブラリです。
* `husky` は Git の各フックに対応する処理を package.json に定義できるライブラリです。

続いて、package.json に commit 時にフックする処理を定義します。

```diff
{
	...
+   "scripts": {
+     "precommit": "lint-staged"
+   },
+   "lint-staged": {
+     "*.js": [
+       "eslint --fix",
+       "git add"
+     ]
+   },
  ...
}
```

これで準備完了です。`git commit` でコードが整形された状態でコミットされていることを確認しましょう。

```bash
$ git add .
$ git commit -m "try lint-staged"
husky > npm run -s precommit (node v10.6.0)

 ✔ Running tasks for *.js
[master (root-commit) e0bcc0a] try lint-staged
 6 files changed, 1912 insertions(+)
 create mode 100644 .eslintrc.json
 create mode 100644 .gitignore
 create mode 100644 .vscode/settings.json
 create mode 100644 index.js
 create mode 100644 package.json
 create mode 100644 yarn.lock
```

以上、チーム開発で力を発揮する eslint と prettier の使い方でした。
