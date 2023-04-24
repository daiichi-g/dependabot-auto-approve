import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const isCheckOnly: boolean = core.getInput('check-only') === 'true'

    const pullRequest = github.context.payload.pull_request
    const baseSha = github.context.payload.pull_request?.base.sha
    const headSha = github.context.payload.pull_request?.head.sha

    core.debug(`token: ${token.length > 0 ? '*****' : ''}...`)
    core.debug(`isCheckOnly: ${isCheckOnly}`)
    core.debug(`base.sha: ${baseSha}`)
    core.debug(`head.sha: ${headSha}`)
    core.debug('======================== pullRequest ========================')
    core.debug(`${JSON.stringify(pullRequest, null, '    ')}`)
    core.debug('======================== context ========================')
    core.debug(`${JSON.stringify(github.context, null, '    ')}`)
    core.debug('=========================================================')

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
          `mainブランチが更新されています( ${baseSha} → ${mainSha} )`,
          'dependabotにPR更新を依頼します',
          '@dependabot rebase'
        ].join('\n')
      })
      core.setFailed('ERROR: mainブランチが更新されています。')
      return
    }

    // PRをマージする
    const result = await octokit.rest.issues.createComment({
      issue_number: pullRequest.number,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      body: 'PRをマージする'
    })

    core.debug(`result: ${JSON.stringify(result, null, '    ')}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
