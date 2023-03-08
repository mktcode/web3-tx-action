import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const provider: string = core.getInput('provider')
    core.debug(`Using provider ${provider} ...`)

    const result = {
      transactionHash: '0x1234567890abcdef'
    }

    core.setOutput('result', JSON.stringify(result))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
