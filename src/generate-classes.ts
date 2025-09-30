import * as fs from 'fs'
import * as path from 'path'
import { generateClassString, getTCcalls } from './generate-classes-utils'

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

function writeClassFile(
  classes: string,
  outputPath: string = './src/styles/tailcomp.js'
): void {
  fs.writeFileSync(outputPath, `export const tailcomp = \`${classes}\``)
}

function main() {
  const allFiles: string[] = getFiles('./src', [])
  const tcCalls: string[] = allFiles.reduce(
    (acc: string[], file: string) =>
      acc.concat(getTCcalls(fs.readFileSync(file, 'utf-8'))),
    []
  )

  const uniqueClasses = generateClassString(tcCalls)
  writeClassFile(uniqueClasses)
}

main()
