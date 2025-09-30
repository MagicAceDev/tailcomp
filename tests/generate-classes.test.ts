import {
  generateClassString,
  getTCcalls,
} from '../src/generate-classes-utils.js'

describe('generate-classes-utils', () => {
  describe('getTCcalls', () => {
    it('should extract tc() calls from various contexts', () => {
      const singleCall = `const className = tc({ base: { static: 'flex' } })`
      expect(getTCcalls(singleCall)).toHaveLength(1)
      expect(getTCcalls(singleCall)[0]).toBe("tc({ base: { static: 'flex' } })")

      const multipleCalls = `
        const class1 = tc({ base: { static: 'flex' } })
        const class2 = tc({ base: { static: 'grid' } })
        const class3 = tc({ base: { static: 'block' } })
      `
      const calls = getTCcalls(multipleCalls)
      expect(calls).toHaveLength(3)
      expect(calls[0]).toContain('flex')
      expect(calls[1]).toContain('grid')
      expect(calls[2]).toContain('block')

      const jsxContext = `
        <div className={tc({ base: { static: 'flex' } })}>
          <span className={tc({ base: { static: 'text-sm' } })}>Text</span>
        </div>
      `
      const jsxCalls = getTCcalls(jsxContext)
      expect(jsxCalls).toHaveLength(2)
      expect(jsxCalls[0]).toContain('flex')
      expect(jsxCalls[1]).toContain('text-sm')
    })

    it('should handle multi-line and nested tc() calls', () => {
      const multiLine = `
        const className = tc({
          base: {
            static: 'flex items-center',
            hover: 'bg-blue-500'
          },
          md: {
            static: 'flex-row'
          }
        })
      `
      const calls = getTCcalls(multiLine)
      expect(calls).toHaveLength(1)
      expect(calls[0]).toContain('base')
      expect(calls[0]).toContain('md')

      const withDarkMode = `
        const btn = tc({
          base: {
            static: 'px-4 py-2',
            dark: {
              static: 'bg-gray-800',
              hover: 'bg-gray-700'
            }
          }
        })
      `
      const darkCalls = getTCcalls(withDarkMode)
      expect(darkCalls).toHaveLength(1)
      expect(darkCalls[0]).toContain('dark')
      expect(darkCalls[0]).toContain('bg-gray-800')
    })

    it('should handle edge cases correctly', () => {
      expect(getTCcalls('')).toEqual([])
      expect(getTCcalls('import React from "react"')).toEqual([])

      const sameLine = `const classes = tc({ base: { static: 'flex' } }) + ' ' + tc({ base: { static: 'gap-4' } })`
      expect(getTCcalls(sameLine)).toHaveLength(2)

      const withComments = `
        // This is a button class
        const buttonClass = tc({ base: { static: 'px-4 py-2' } })
        /* Multi-line comment */
        const cardClass = tc({ base: { static: 'p-6 rounded' } })
      `
      expect(getTCcalls(withComments)).toHaveLength(2)

      const similarNames = `
        const matchFunc = () => {}
        const catchError = () => {}
        const tc_helper = () => {}
        const actualTc = tc({ base: { static: 'flex' } })
      `
      const calls = getTCcalls(similarNames)
      expect(calls).toHaveLength(1)
      expect(calls[0]).toContain('flex')
    })
  })

  describe('generateClassString', () => {
    it('should generate and deduplicate classes', () => {
      const tcCalls = [
        "tc({ base: { static: 'flex items-center' } })",
        "tc({ base: { static: 'flex justify-center' } })",
      ]
      const result = generateClassString(tcCalls)
      expect(result).toContain('flex')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-center')
      expect(result.split(' ').filter((c) => c === 'flex').length).toBe(1)

      expect(generateClassString([])).toBe('')

      const duplicate = [
        "tc({ base: { static: 'bg-blue-500 text-white' } })",
        "tc({ base: { static: 'bg-blue-500 rounded' } })",
        "tc({ base: { static: 'text-white p-4' } })",
      ]
      const dedupResult = generateClassString(duplicate)
      const classes = dedupResult.split(' ')
      expect(classes.filter((c) => c === 'bg-blue-500').length).toBe(1)
      expect(classes.filter((c) => c === 'text-white').length).toBe(1)
      expect(dedupResult).toContain('rounded')
      expect(dedupResult).toContain('p-4')
    })

    it('should handle pseudo-classes and states', () => {
      const pseudoClasses = [
        "tc({ base: { static: 'bg-blue-500', hover: 'bg-blue-700' } })",
      ]
      const result = generateClassString(pseudoClasses)
      expect(result).toContain('bg-blue-500')
      expect(result).toContain('hover:bg-blue-700')

      const complex = [
        `tc({
          base: {
            static: 'px-4 py-2 rounded',
            hover: 'bg-blue-600',
            focus: 'ring-2 ring-blue-500',
            active: 'bg-blue-700',
            disabled: 'opacity-50 cursor-not-allowed'
          }
        })`,
      ]
      const complexResult = generateClassString(complex)
      expect(complexResult).toContain('px-4')
      expect(complexResult).toContain('hover:bg-blue-600')
      expect(complexResult).toContain('focus:ring-2')
      expect(complexResult).toContain('active:bg-blue-700')
      expect(complexResult).toContain('disabled:opacity-50')
    })

    it('should handle dark mode variants', () => {
      const simple = [
        "tc({ base: { static: 'bg-white', dark: 'bg-gray-900' } })",
      ]
      const result = generateClassString(simple)
      expect(result).toContain('bg-white')
      expect(result).toContain('dark:bg-gray-900')

      const nested = [
        `tc({ 
          base: { 
            static: 'bg-white',
            dark: {
              static: 'bg-gray-900',
              hover: 'bg-gray-800'
            }
          } 
        })`,
      ]
      const nestedResult = generateClassString(nested)
      expect(nestedResult).toContain('bg-white')
      expect(nestedResult).toContain('dark:bg-gray-900')
      expect(nestedResult).toContain('dark:hover:bg-gray-800')
    })

    it('should handle responsive breakpoints', () => {
      const simple = [
        "tc({ base: { static: 'flex-col' }, md: { static: 'flex-row' } })",
      ]
      const result = generateClassString(simple)
      expect(result).toContain('flex-col')
      expect(result).toContain('md:flex-row')

      const allBreakpoints = [
        `tc({ 
          base: { static: 'text-xs' },
          sm: { static: 'text-sm' },
          md: { static: 'text-base' },
          lg: { static: 'text-lg' },
          xl: { static: 'text-xl' },
          '2xl': { static: 'text-2xl' }
        })`,
      ]
      const allResult = generateClassString(allBreakpoints)
      expect(allResult).toContain('text-xs')
      expect(allResult).toContain('sm:text-sm')
      expect(allResult).toContain('md:text-base')
      expect(allResult).toContain('lg:text-lg')
      expect(allResult).toContain('xl:text-xl')
      expect(allResult).toContain('2xl:text-2xl')
    })

    it('should handle conditional classes with object syntax', () => {
      const conditional = [
        `tc({
          base: {
            static: {
              'px-4 py-2': true,
              'bg-blue-500': true,
              'bg-gray-500': false,
              'hidden': false
            }
          }
        })`,
      ]
      const result = generateClassString(conditional)
      expect(result).toContain('px-4')
      expect(result).toContain('bg-blue-500')
      expect(result).not.toContain('bg-gray-500')
      expect(result).not.toContain('hidden')

      const mixed = [
        `tc({
          base: {
            static: {
              'px-4 py-2': true,
              'bg-blue-500': true,
              'bg-gray-500': false
            },
            hover: 'opacity-90'
          }
        })`,
      ]
      const mixedResult = generateClassString(mixed)
      expect(mixedResult).toContain('px-4')
      expect(mixedResult).toContain('bg-blue-500')
      expect(mixedResult).not.toContain('bg-gray-500')
      expect(mixedResult).toContain('hover:opacity-90')

      const inPseudo = [
        `tc({
          base: {
            static: 'p-4 rounded',
            hover: {
              'bg-blue-700': true,
              'cursor-not-allowed': false
            },
            focus: {
              'ring-2': true,
              'ring-red-500': false,
              'ring-blue-500': true
            }
          }
        })`,
      ]
      const pseudoResult = generateClassString(inPseudo)
      expect(pseudoResult).toContain('hover:bg-blue-700')
      expect(pseudoResult).not.toContain('hover:cursor-not-allowed')
      expect(pseudoResult).toContain('focus:ring-2')
      expect(pseudoResult).toContain('focus:ring-blue-500')
      expect(pseudoResult).not.toContain('focus:ring-red-500')
    })

    it('should handle README card example', () => {
      const tcCalls = [
        `tc({
          base: {
            static: 'flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow',
            hover: 'bg-gray-100',
            dark: {
              static: 'border-gray-700 bg-gray-800',
              hover: 'bg-gray-700',
            },
          },
          md: {
            static: 'flex-row max-w-xl',
          },
        })`,
      ]
      const result = generateClassString(tcCalls)
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('bg-white')
      expect(result).toContain('hover:bg-gray-100')
      expect(result).toContain('dark:border-gray-700')
      expect(result).toContain('dark:bg-gray-800')
      expect(result).toContain('dark:hover:bg-gray-700')
      expect(result).toContain('md:flex-row')
      expect(result).toContain('md:max-w-xl')
    })

    it('should handle edge cases', () => {
      const empty = [
        "tc({ base: { static: '' } })",
        "tc({ base: { static: 'flex' } })",
      ]
      expect(generateClassString(empty)).toBe('flex')

      const allFalse = [
        `tc({
          base: {
            static: {
              'hidden': false,
              'invisible': false
            }
          }
        })`,
      ]
      expect(generateClassString(allFalse)).toBe('')

      const orderIndependent1 = [
        "tc({ base: { static: 'flex items-center' } })",
        "tc({ base: { static: 'justify-center gap-4' } })",
      ]
      const orderIndependent2 = [
        "tc({ base: { static: 'justify-center gap-4' } })",
        "tc({ base: { static: 'flex items-center' } })",
      ]
      expect(generateClassString(orderIndependent1).split(' ').sort()).toEqual(
        generateClassString(orderIndependent2).split(' ').sort()
      )
    })

    it('should handle large numbers of calls efficiently', () => {
      const tcCalls = Array(100)
        .fill(null)
        .map((_, i) => `tc({ base: { static: 'class-${i} shared-class' } })`)
      const result = generateClassString(tcCalls)
      const classes = result.split(' ')
      expect(classes.length).toBe(101)
      expect(classes.filter((c) => c === 'shared-class').length).toBe(1)
      expect(result).toContain('class-0')
      expect(result).toContain('class-99')
    })
  })

  describe('Integration: getTCcalls + generateClassString', () => {
    it('should extract and generate classes from a complete component', () => {
      const fileContent = `
        import tc from 'tailcomp'
        
        const Button = () => {
          const baseClasses = tc({
            base: {
              static: 'px-4 py-2 rounded font-medium',
              hover: {
                'bg-blue-600': theme === 'primary',
                'bg-red-500': theme === 'secondary'
              },
              focus: 'ring-2 ring-blue-500'
            }
          })
          
          const cardClasses = tc({
            base: {
              static: 'p-6 rounded-lg shadow',
              dark: 'bg-gray-800'
            },
            md: {
              static: 'p-8'
            }
          })
          
          return <div className={cardClasses}><button className={baseClasses}>Click</button></div>
        }
      `

      const tcCalls = getTCcalls(fileContent)
      expect(tcCalls).toHaveLength(2)

      const classes = generateClassString(tcCalls)
      expect(classes).toContain('px-4')
      expect(classes).toContain('hover:bg-blue-600')
      expect(classes).toContain('focus:ring-2')
      expect(classes).toContain('p-6')
      expect(classes).toContain('dark:bg-gray-800')
      expect(classes).toContain('md:p-8')

      const classArray = classes.split(' ')
      const uniqueClasses = [...new Set(classArray)]
      expect(classArray.length).toBe(uniqueClasses.length)
    })
  })
})
