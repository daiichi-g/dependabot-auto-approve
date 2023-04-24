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
| github-token |必須 | GitHubトークン |
| check-only | | true: mainブランチの更新チェックのみ |
