---
title: レーベンシュタイン距離 (LD)
description: 二つの文字列がどの程度異なっているかを示す距離
date: 2020-10-12 01:15
categories:
  - algorithm
tags:
  - algorithm
  - go
---

編集距離ともいうらしい。編集 (挿入、削除、置換) を何回行うことで同一文字に変形できるか、その最短距回数を数値化したもの。距離が短ければその文字は似ているということなのかな？

アルゴリズムの疑似コードは [wikipedia](https://ja.wikipedia.org/wiki/%E3%83%AC%E3%83%BC%E3%83%99%E3%83%B3%E3%82%B7%E3%83%A5%E3%82%BF%E3%82%A4%E3%83%B3%E8%B7%9D%E9%9B%A2#:~:text=%E3%83%AC%E3%83%BC%E3%83%99%E3%83%B3%E3%82%B7%E3%83%A5%E3%82%BF%E3%82%A4%E3%83%B3%E8%B7%9D%E9%9B%A2%EF%BC%88%E3%83%AC%E3%83%BC%E3%83%99%E3%83%B3%E3%82%B7%E3%83%A5%E3%82%BF%E3%82%A4%E3%83%B3,%3A%20edit%20distance%EF%BC%89%E3%81%A8%E3%82%82%E5%91%BC%E3%81%B0%E3%82%8C%E3%82%8B%E3%80%82) にある。

Go で書いてみるとこんな感じだろうか。

```go
package main

import (
	"fmt"
	"flag"
)

func levenshtein_distance(s1, s2 string) int {
	m := [][]int{}
	for i := 0; i < len(s1) + 1; i++ {
		inner := []int{}
		for j := 0; j < len(s2) + 1; j++ {
			inner = append(inner, j)
		}
		m = append(m, inner)
	}

	for i := 0; i < len(s1) + 1; i++ {
		m[i][0] = i
	}

	for j := 0; j < len(s2) + 1; j++ {
		m[0][j] = j
	}

	for i := 1; i < len(s1) + 1; i++ {
		for j := 1; j < len(s2) + 1; j++ {
			cost := 0
			if s1[i - 1] != s2[j - 1] {
				cost = 1
			}
			m[i][j] = min(m[i - 1][j] + 1, min(m[i][j - 1] + 1, m[i - 1][j - 1] + cost))
		}
	}

	return m[len(s1)][len(s2)]
}

func min(a, b int) int {
	if a >= b {
		return b
	}
	return a
}

func main() {
	flag.Parse()
	fmt.Println(levenshtein_distance(flag.Arg(0), flag.Arg(1)))
}
```

```console
$ go run levenshtein_distance.go kitten sitting
3

$ go run levenshtein_distance.go kitten
6

$ go run levenshtein_distance.go kitten aaaaaa
6
```
