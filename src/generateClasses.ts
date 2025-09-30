import * as fs from 'fs'
import * as JSON5 from 'json5'
import * as path from 'path'
import tc from './index'

const validFileTypes = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.html',
  '.astro',
  '.vue',
  '.svelte',
  '.mjs',
  '.cjs',
  '.mdx',
]

function endsWithAny(str: string, suffixes: string[]): boolean {
  return suffixes.some((suffix) => str.endsWith(suffix))
}

function getFiles(pathName: string, acc: string[] = []): string[] {
  const srcPath = path.resolve(pathName)

  for (const file of fs.readdirSync(srcPath)) {
    const filePath = path.join(srcPath, file)
    const fileStat = fs.statSync(filePath)
    if (fileStat.isDirectory()) {
      getFiles(filePath, acc)
    } else if (endsWithAny(filePath, validFileTypes)) {
      acc.push(filePath)
    }
  }
  return acc
}

function getTCcalls(file: string): string[] {
  const fileContents = fs.readFileSync(file, 'utf-8')
  const tcCalls = fileContents.match(/tc\(([^)]+)\)/g)
  return tcCalls || []
}

function main() {
  const allFiles: string[] = getFiles('./src', [])
  const tcCalls: string[] = allFiles.reduce(
    (acc: string[], file: string) => acc.concat(getTCcalls(file)),
    []
  )

  const allClasses = tcCalls
    .map((call) => {
      const obj = JSON5.parse(call.slice(3, -1))
      return tc(obj)
    })
    .join(' ')
    .split(' ')
    .filter((c) => c)

  const uniqueClasses = [...new Set(allClasses)].join(' ')

  fs.writeFileSync(
    './src/styles/tailcomp.js',
    `export const tailcomp = \`${uniqueClasses}\``
  )
}

main()
