import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test, describe} from '@jest/globals'
import {Interface} from 'ethers'

const TEST_ABI = ['function balanceOf(address owner) view returns (uint256)']

const contractInterface = new Interface(TEST_ABI)
const data = contractInterface.encodeFunctionData('balanceOf', [
  '0x27711f9c07230632F2EE1A21a967a9AC4729E520'
])

const np = process.execPath
const ip = path.join(__dirname, '..', 'lib', 'main.js')
const options: cp.ExecFileSyncOptions = {
  env: process.env
}

describe('returns expected result', () => {
  test('for custom data call', () => {
    process.env['INPUT_PROVIDERURL'] = process.env.SEPOLIA_PROVIDER_URL
    process.env['INPUT_TO'] = '0xab879B28006F5095ab346Eb525daFeA2cf18Bc3f'
    process.env['INPUT_GASLIMIT'] = '21000'
    process.env['INPUT_VALUE'] = '0'
    process.env['INPUT_DATA'] = data

    try {
      const output = cp.execFileSync(np, [ip], options).toString()
      const resultStr =
        output.match(/::set-output name=result::(.*)/)?.[1] || ''
      const result = JSON.parse(resultStr)
      expect(result).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000002'
      )
    } catch (error: any) {
      const output = error.stdout.toString()
      console.log(output)
      expect(true).toBe(false)
    }
  })

  test('for method/args call', () => {
    process.env['INPUT_PROVIDERURL'] = process.env.SEPOLIA_PROVIDER_URL
    process.env['INPUT_TO'] = '0xab879B28006F5095ab346Eb525daFeA2cf18Bc3f'
    process.env['INPUT_GASLIMIT'] = '21000'
    process.env['INPUT_VALUE'] = '0'
    process.env['INPUT_METHOD'] = 'balanceOf(address)'
    process.env['INPUT_ARGS'] = '["0x27711f9c07230632F2EE1A21a967a9AC4729E520"]'
    delete process.env['INPUT_DATA']

    try {
      const output = cp.execFileSync(np, [ip], options).toString()
      const resultStr =
        output.match(/::set-output name=result::(.*)/)?.[1] || ''
      const result = JSON.parse(resultStr)
      expect(result).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000002'
      )
    } catch (error: any) {
      const output = error.stdout.toString()
      console.log(output)
      expect(true).toBe(false)
    }
  })
})
