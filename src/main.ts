import * as core from '@actions/core'
import {Interface, isAddress, JsonRpcProvider, Wallet} from 'ethers'

async function run(): Promise<void> {
  try {
    const providerUrl: string = core.getInput('providerUrl')
    const walletKey: string = core.getInput('walletKey')
    const to: string = core.getInput('to')
    const value: string = core.getInput('value')
    const data: string = core.getInput('data')
    const method = core.getInput('method')
    const args = core.getInput('args')
    const gasLimit: string = core.getInput('gasLimit')

    core.debug(`providerUrl: ${providerUrl}`)
    core.debug(`walletKey: ${walletKey}`)
    core.debug(`to: ${to}`)
    core.debug(`value: ${value}`)
    core.debug(`data: ${data}`)
    core.debug(`gasLimit: ${gasLimit}`)

    if (!isAddress(to)) throw new Error('Invalid to address')

    const tx: Record<string, string> = {
      to,
      value
    }

    if (data) {
      tx.data = data
    } else if (method) {
      const contractInterface = new Interface([`function ${method}`])
      tx.data = contractInterface.encodeFunctionData(
        contractInterface.getFunctionName(method),
        args ? JSON.parse(args) : []
      )
    }

    let result
    let wallet: Wallet | null = null
    const provider = new JsonRpcProvider(providerUrl)

    if (walletKey) {
      wallet = new Wallet(walletKey, provider)
    }

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
