import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const isCheckOnly: boolean = core.getInput('check-only') === 'true'

    const pullRequest = github.context.payload.pull_request

    core.debug(`token: ${token.length > 0 ? '*****' : ''}...`)
    core.debug(`isCheckOnly: ${isCheckOnly}`)
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
    const result = await octokit.rest.issues.createComment({
      issue_number: pullRequest.number,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      body: 'コメントテスト'
    })

    core.debug(`result: ${JSON.stringify(result, null, '    ')}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
