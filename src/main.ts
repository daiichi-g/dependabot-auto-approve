import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const isCheckOnly: boolean = core.getInput('check-only') === 'true'

    const pullRequest = github.context.payload.pull_request
    const baseSha = github.context.payload.pull_request?.base.sha
    const headSha = github.context.payload.pull_request?.head.sha

    core.debug(`isCheckOnly: ${isCheckOnly}`)
    core.debug(`base.sha: ${baseSha}`)
    core.debug(`head.sha: ${headSha}`)

    // アクションの実行イベントを検証
    if (!pullRequest) {
      core.setFailed('ERROR: プルリクエストのイベントから実行してください。')
      return
    }

    const octokit = github.getOctokit(token)

    // PR作成/更新後にmainブランチが変更されてないことを確認
    const res = await octokit.rest.repos.getBranch({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      branch: 'main'
    })
    const mainSha = res.data.commit.sha
    if (mainSha !== baseSha) {
      await octokit.rest.issues.createComment({
        issue_number: pullRequest.number,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        body: [
          `mainブランチ更新あり( ${baseSha} → ${mainSha} )`,
          '@dependabot rebase'
        ].join('\n')
      })
      core.setFailed(
        'ERROR: mainブランチが更新されているため、承認処理を中断しました。'
      )
      return
    }

    if (isCheckOnly) {
      return
    }

    // PRをマージする
    const mergeMethod = pullRequest.commits > 1 ? 'merge' : 'rebase'
    const result = await octokit.rest.issues.createComment({
      issue_number: pullRequest.number,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      body: `承認(${mergeMethod})...`
    })
    octokit.rest.pulls.merge({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: pullRequest.number,
      merge_method: mergeMethod
    })

    core.debug(`result: ${JSON.stringify(result, null, '    ')}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
