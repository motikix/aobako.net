---
title: Rust で json を扱う
description: データのやりとりでデファクトスタンダードな json を Rust で取り扱う．
date: 2019-09-16 01:42:00
categories:
  - Rust
tags:
  - rust
  - json
---

## どのモジュールを使うの?
いきなり迷子になった．「rust json」でググってみると，それっぽい [serialize::json](https://doc.rust-lang.org/1.1.0/serialize/json/index.html) なるモジュールがあったわけだが，「Unstable: deprecated in favor of rustc-serialize on crates.io」の一文が．

それじゃあ [Crate rustc_serialize](https://docs.rs/rustc-serialize/0.3.24/rustc_serialize/) 使うかとドキュメントを開いたら今度は

> NOTE: This crate is deprecated in favor of serde. No new feature development will happen in this crate, although bug fixes proposed through PRs will still be merged. It is very highly recommended by the Rust Library Team that you use serde, not this crate.

だと…．

ということで辿り着いたのが [Serde](https://serde.rs/) である．

## Serde
シリアライズ/デシリアライズの共通的なインタフェースを提供するフロントエンド実装で，json に限らず任意のバックエンド実装と組み合わせて利用するようだ．今回は json がテーマなので，次の内容を Cargo.toml に書く．

```toml:title=cargo.toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```
## 使いかた
使い方はシンプルで，Go のように扱うオブジェクトを構造体で指示してやればよい．構造体には `#[derive(Serialize, Deserialize)]` を付与しておく．

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 1, y: 2 };

    let serialized = serde_json::to_string(&point).unwrap();
    println!("serialized = {}", serialized);  // serialized = {"x":1,"y":2}

    let deserialized: Point = serde_json::from_str(&serialized).unwrap();
    println!("deserialized - {:?}", deserialized);  // deserialized - Point { x: 1, y: 2 }
}
```

### ネスト & flatten
普通に構造体をネストすると，シリアライズ後もネストした状態となるが，flatten をマークしておくことで，その名の通りフラットに展開することができる．

```rust
#[derive(Serialize, Deserialize, Debug)]
struct Pagination {
    limit: u64,
    offset: u64,
    total: u64,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
struct Users {
    users: Vec<User>,

    #[serde(flatten)]
    pagination: Pagination,
}

#[derive(Serialize, Deserialize, Debug)]
struct User {
    id: String,
    username: String,
}

// このような感じにシリアライズできる
// {
//     "limit": 100,
//     "offset": 200,
//     "total": 500,
//     "users": [
//        {"id": "8c57d32e-d298-11e9-bb65-2a2ae2dbcce4", "username": "foo", "mascot": "hoge"},
//        {"id": "8c57d8ce-d298-11e9-bb65-2a2ae2dbcce4", "username": "bar", "mascot": "fuga"},
//        {"id": "8c57da4a-d298-11e9-bb65-2a2ae2dbcce4", "username": "baz", "mascot": "piyo"} 
//     ]
// }

```

## 参考
* https://doc.rust-lang.org/1.1.0/serialize/json/index.html
* https://docs.rs/rustc-serialize/0.3.24/rustc_serialize/
* https://serde.rs/
* https://qiita.com/nacika_ins/items/0948fe2e49964dcc4858
