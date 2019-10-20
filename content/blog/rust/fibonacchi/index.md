---
title: Rust でフィボナッチ
description: 今更フィボナッチ！？とか言わない。
date: 2019-10-20 22:54:00
categories:
  - Rust
tags:
  - rust
  - fibonacci
---

最近、ちゃんと Rust を触ってみようかと思ったわけですが、何からやっていけばいいのか良くわからず、準備運動的にフィボナッチ数を出力させてみました。

フィボナッチ数列とは 0, 1, 1, 2, 3, 5, 8, 13, 21, ... のように、最初の 2 項以外の項が、直前の 2 項の和になっている数列です。パッと見ではそれだけの数列なのですが、自然界の物質の中にこの数列が出てきたり、2 項の比率が黄金比に収斂していったり、数学苦手な自分でも数学って面白いなと感じるなんとも不思議な数です。

シンプルな再帰で書いてみる
--
最初の 2 項が 0, 1 となる以外は、前の 2 項と足すと次の項の値になるので、次の関数で表せます。

* F0:: 0
* F1:: 1
* Fn:: F(n-2) + F(n-1)

コード化すると次のような感じです。パターンマッチがめちゃくちゃ便利。

```rust
fn fibonacci(n: u64) -> u64 {
    return match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 2) + fibonacci(n - 1)
    }
}
```

このコードが正しいことを確認するテストを書いてみます。Rust のテストは `#[test]` 属性をつけることで Cargo から実行できるみたいですね。これはすごく楽です。

```rust
#[test]
fn test_fibonacchi() {
    assert_eq!(fibonacci(0), 0);
    assert_eq!(fibonacci(1), 1);
    assert_eq!(fibonacci(2), 1);
    assert_eq!(fibonacci(3), 2);
    assert_eq!(fibonacci(4), 3);
    assert_eq!(fibonacci(10), 55);
}
```

実行するとテストがパスするはずです。

```shell
rust-fib is 📦 v0.1.0 via 🦀 v1.38.0
❯ cargo test
   Compiling rust-fib v0.1.0 (/home/syuni/Documents/workspace/rust-fib)
    Finished dev [unoptimized + debuginfo] target(s) in 0.28s
     Running target/debug/deps/rust_fib-c94740de3d5de995

running 1 test
test test_fibonacchi ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

メモ化してパフォーマンスを上げてみる
--
上記の関数でも正しい値は導けるものの、何度も同じ値に対する関数が呼び出されるので効率的ではありません。こういった場面ではメモ化することで関数の呼び出しを抑えるとよいでしょう。

```rust
fn fibonacci_memo(n: u64, m: &mut HashMap<u64, u64>) -> u64 {
    return match m.get(&n) {
        None => {
            let new_num = fibonacci_memo(n - 2, m) + fibonacci_memo(n - 1, m);
            m.insert(n, new_num);
            new_num
        },
        _ => m[&n]
    }
}

fn main() {
    let num = 10;
    let mut memo: HashMap<u64, u64> = HashMap::new();
    memo.insert(0, 0);
    memo.insert(1, 1);
    fibonacci_memo(num, &mut memo);
}
```

計測用のコードの詳細は書きませんが、メモ化の有無でそれぞれ次のような結果になりました。

num | メモ化しない | メモ化する
:-- | --: | --:
10 | 9.102µs | 55.59µs
20 | 98.652µs | 87.527µs
30 | 11.352848ms | 180.516µs
40 | 1.395133995s | 255.112µs
50 | 159.481959241s | 291.524µs

最初のほうこそハッシュ更新のオーバーヘッドが掛かってしまうものの、メモ化しないケースでは指数関数的に処理時間が増加しているのに対して、メモ化するケースでの増加は微々たるものになっています。

Rust の所有権とか参照やら借用といった部分を正しく理解できていないのでいろいろと怪しいコードではありますが、パフォーマンス的には改善が見られたのでよしとしましょう。

まとめ
--
Rust は真面目に勉強しないと駄目だ…。Go みたいにノリで書ける気がしない。
