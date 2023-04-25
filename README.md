# dependabotが作成したPRを承認するアクション
PRの作成後にmainブランチが更新されていない場合のみ承認  
(mainブランチが更新されている場合は、dependabotにPRブランチのrebaseを依頼)

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
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

### mainブランチの更新チェックのみ
```yaml
      - uses: daiichi-g/dependabot-auto-approve@v1
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          check-only: true
```

## パラメータ
| パラメータ名 | 必須 | 説明 |
|:---|:---:|:---|
| github-token |必須 | GitHubトークン(※1) |
| check-only | | true: mainブランチの更新チェックのみ |

※1 Personal access tokens(Classic)、または Fine-grained tokens(contents,pull_request Read and Write)を指定
