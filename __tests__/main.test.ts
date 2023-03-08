import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {Interface} from 'ethers'

const TEST_ABI = ['function balanceOf(address owner) view returns (uint256)']

const contractInterface = new Interface(TEST_ABI)
const data = contractInterface.encodeFunctionData('balanceOf', [
  '0x27711f9c07230632F2EE1A21a967a9AC4729E520'
])

test('returns expected result', () => {
  process.env['INPUT_PROVIDER'] = process.env.SEPOLIA_PROVIDER_URL
  process.env['INPUT_TO'] = '0xab879B28006F5095ab346Eb525daFeA2cf18Bc3f'
  process.env['INPUT_VALUE'] = '0'
  process.env['INPUT_DATA'] = data
  process.env['INPUT_GASLIMIT'] = '21000'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  // try {
    const output = cp.execFileSync(np, [ip], options).toString()
    const resultStr = output.match(/::set-output name=result::(.*)/)?.[1] || ''
    const result = JSON.parse(resultStr)
    expect(result).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002'
    )
  // } catch (error: any) {
  //   const output = error.stdout.toString()
  //   console.log(output)
  // }
})
