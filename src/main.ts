import * as core from '@actions/core'
import {ethers} from 'ethers'

type Tx = {
  to: string
  value: string
  data: string
  gasLimit?: string
}

async function run(): Promise<void> {
  try {
    const providerUrl: string = core.getInput('provider')
    const walletKey: string = core.getInput('walletKey')
    const to: string = core.getInput('to')
    const value: string = core.getInput('value')
    const data: string = core.getInput('data')
    const gasLimit: string = core.getInput('gasLimit')

    core.debug(`provider: ${providerUrl}`)
    core.debug(`walletKey: ${walletKey}`)
    core.debug(`to: ${to}`)
    core.debug(`value: ${value}`)
    core.debug(`data: ${data}`)
    core.debug(`gasLimit: ${gasLimit}`)

    const provider = new ethers.providers.JsonRpcProvider(providerUrl)

    let wallet: ethers.Wallet | undefined = undefined

    if (walletKey) {
      wallet = new ethers.Wallet(walletKey, provider)
    }

    if (!ethers.utils.isAddress(to)) throw new Error('Invalid to address')

    const tx: Tx = {
      to,
      value,
      data
    }

    let result

    if (wallet) {
      tx.gasLimit = gasLimit
      core.debug(
        `Sending transaction ${JSON.stringify(tx)} from ${wallet.address}`
      )
      result = await wallet.sendTransaction(tx)
    } else {
      core.debug(`Sending call ${JSON.stringify(tx)}`)
      result = await provider.call(tx)
    }

    core.setOutput('result', JSON.stringify(result))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
