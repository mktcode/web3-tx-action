import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

test('returns expected result', () => {
  process.env['INPUT_PROVIDER'] = 'https://infura...'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  const output = cp.execFileSync(np, [ip], options).toString()
  const resultStr = output.match(/::set-output name=result::(.*)/)?.[1] || ''
  const resultObj = JSON.parse(resultStr)
  expect(resultObj.transactionHash).toBe('0x1234567890abcdef')
})
