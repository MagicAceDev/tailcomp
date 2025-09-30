import * as JSON5 from 'json5'
import tc from './index.js'

export function getTCcalls(fileContents: string): string[] {
  const tcCalls = fileContents.match(/tc\(([^)]+)\)/g)
  return tcCalls || []
}

export function generateClassString(tcCalls: string[]): string {
  const allClasses = tcCalls
    .map((call) => {
      const obj = JSON5.parse(call.slice(3, -1))
      return tc(obj)
    })
    .join(' ')
    .split(' ')
    .filter((c) => c)

  const uniqueClasses = [...new Set(allClasses)].join(' ')
  return uniqueClasses
}
