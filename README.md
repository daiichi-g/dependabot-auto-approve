## 概要

```mermaid
flowchart LR
A["mainブランチの更新チェック"]-->|更新なし|B["PRをマージ(承認)"]

A-->|更新あり|C["PRに「@dependabot rebase」コメントを追加"]

```


## 使い方

### 承認
```yaml
      - uses: daiichi-g/dependabot-auto-approve@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### mainブランチの更新チェックのみ
```yaml
      - uses: daiichi-g/dependabot-auto-approve@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          check-only: true
```

## パラメータ
| パラメータ名 | 必須 | 説明 |
|:---|:---:|:---|
| github-token |必須 | GitHubトークン(※1) |
| check-only | | true: mainブランチの更新チェックのみ |
(※1) Personal access tokes(Classic)、または Fine-grained tokens(contents,pull_request Read and Write)を指定
