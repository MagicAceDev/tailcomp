import tc from '../src/index.js'

describe('tc function', () => {
  describe('Basic functionality', () => {
    it('should handle basic cases and whitespace', () => {
      expect(tc({ base: { static: '' } })).toBe('')
      expect(tc({ base: { static: 'flex items-center justify-center' } })).toBe(
        'flex items-center justify-center'
      )
      expect(tc({ base: { static: '  flex   items-center  ' } })).toBe(
        'flex items-center'
      )
    })
  })

  describe('Pseudo-classes', () => {
    it('should handle single and multiple pseudo-classes', () => {
      const single = tc({
        base: {
          static: 'bg-blue-500',
          hover: 'bg-blue-700',
        },
      })
      expect(single).toBe('bg-blue-500 hover:bg-blue-700')

      const multiple = tc({
        base: {
          static: 'bg-blue-500',
          hover: 'bg-blue-700',
          focus: 'ring-2 ring-blue-300',
          active: 'bg-blue-900',
        },
      })
      expect(multiple).toContain('bg-blue-500')
      expect(multiple).toContain('hover:bg-blue-700')
      expect(multiple).toContain('focus:ring-2 focus:ring-blue-300')
      expect(multiple).toContain('active:bg-blue-900')
    })

    it('should handle all supported pseudo-classes', () => {
      const result = tc({
        base: {
          static: 'base',
          visited: 'visited-class',
          target: 'target-class',
          first: 'first-class',
          last: 'last-class',
          only: 'only-class',
          odd: 'odd-class',
          even: 'even-class',
          empty: 'empty-class',
          disabled: 'disabled-class',
          enabled: 'enabled-class',
          checked: 'checked-class',
          indeterminate: 'indeterminate-class',
          default: 'default-class',
          required: 'required-class',
          valid: 'valid-class',
          invalid: 'invalid-class',
          autofill: 'autofill-class',
        },
      })

      const pseudoClasses = [
        'base',
        'visited:visited-class',
        'target:target-class',
        'first:first-class',
        'last:last-class',
        'only:only-class',
        'odd:odd-class',
        'even:even-class',
        'empty:empty-class',
        'disabled:disabled-class',
        'enabled:enabled-class',
        'checked:checked-class',
        'indeterminate:indeterminate-class',
        'default:default-class',
        'required:required-class',
        'valid:valid-class',
        'invalid:invalid-class',
        'autofill:autofill-class',
      ]
      pseudoClasses.forEach((cls) => expect(result).toContain(cls))
    })
  })

  describe('Dark mode', () => {
    it('should handle dark mode variants', () => {
      const simple = tc({
        base: {
          static: 'bg-white',
          dark: 'bg-gray-900',
        },
      })
      expect(simple).toBe('bg-white dark:bg-gray-900')

      const nested = tc({
        base: {
          static: 'bg-white',
          dark: {
            static: 'bg-gray-900',
            hover: 'bg-gray-800',
          },
        },
      })
      expect(nested).toContain('bg-white')
      expect(nested).toContain('dark:bg-gray-900')
      expect(nested).toContain('dark:hover:bg-gray-800')

      const multiplePseudo = tc({
        base: {
          static: 'text-black',
          dark: {
            static: 'text-white',
            hover: 'text-gray-300',
            focus: 'text-gray-400',
          },
        },
      })
      expect(multiplePseudo).toContain('text-black')
      expect(multiplePseudo).toContain('dark:text-white')
      expect(multiplePseudo).toContain('dark:hover:text-gray-300')
      expect(multiplePseudo).toContain('dark:focus:text-gray-400')
    })
  })

  describe('Media queries', () => {
    it('should handle responsive breakpoints', () => {
      const single = tc({
        base: { static: 'flex-col' },
        md: { static: 'flex-row' },
      })
      expect(single).toBe('flex-col md:flex-row')

      const multiple = tc({
        'base': { static: 'text-sm' },
        'sm': { static: 'text-base' },
        'md': { static: 'text-lg' },
        'lg': { static: 'text-xl' },
        'xl': { static: 'text-2xl' },
        '2xl': { static: 'text-3xl' },
      })
      expect(multiple).toContain('text-sm')
      expect(multiple).toContain('sm:text-base')
      expect(multiple).toContain('md:text-lg')
      expect(multiple).toContain('lg:text-xl')
      expect(multiple).toContain('xl:text-2xl')
      expect(multiple).toContain('2xl:text-3xl')

      const withPseudo = tc({
        base: {
          static: 'bg-blue-500',
          hover: 'bg-blue-700',
        },
        lg: {
          static: 'bg-green-500',
          hover: 'bg-green-700',
        },
      })
      expect(withPseudo).toContain('bg-blue-500')
      expect(withPseudo).toContain('hover:bg-blue-700')
      expect(withPseudo).toContain('lg:bg-green-500')
      expect(withPseudo).toContain('lg:hover:bg-green-700')
    })
  })

  describe('Complex combinations', () => {
    it('should handle breakpoints with dark mode and pseudo-classes', () => {
      const result = tc({
        base: {
          static: 'bg-white text-black',
          hover: 'bg-gray-100',
          dark: {
            static: 'bg-gray-900 text-white',
            hover: 'bg-gray-800',
          },
        },
        md: {
          static: 'max-w-xl',
          dark: 'border-gray-700',
        },
      })
      const expected = [
        'bg-white',
        'text-black',
        'hover:bg-gray-100',
        'dark:bg-gray-900',
        'dark:text-white',
        'dark:hover:bg-gray-800',
        'md:max-w-xl',
        'md:dark:border-gray-700',
      ]
      expected.forEach((cls) => expect(result).toContain(cls))
    })

    it('should handle the README card example', () => {
      const result = tc({
        base: {
          static:
            'flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow',
          hover: 'bg-gray-100',
          dark: {
            static: 'border-gray-700 bg-gray-800',
            hover: 'bg-gray-700',
          },
        },
        md: {
          static: 'flex-row max-w-xl',
        },
      })

      const expected = [
        'flex',
        'flex-col',
        'items-center',
        'bg-white',
        'hover:bg-gray-100',
        'dark:border-gray-700',
        'dark:bg-gray-800',
        'dark:hover:bg-gray-700',
        'md:flex-row',
        'md:max-w-xl',
      ]
      expected.forEach((cls) => expect(result).toContain(cls))
    })
  })

  describe('Conditional styles (object syntax)', () => {
    it('should handle object with boolean values', () => {
      const result = tc({
        base: {
          static: {
            'bg-blue-500': true,
            'text-white': true,
            'hidden': false,
          },
        },
      })
      expect(result).toContain('bg-blue-500')
      expect(result).toContain('text-white')
      expect(result).not.toContain('hidden')
    })

    it('should handle mixed string and object styles', () => {
      const isActive = true
      const isDisabled = false

      const result = tc({
        base: {
          static: 'p-4 rounded',
          hover: {
            'bg-blue-700': isActive,
            'cursor-not-allowed': isDisabled,
          },
        },
      })
      expect(result).toContain('p-4')
      expect(result).toContain('rounded')
      expect(result).toContain('hover:bg-blue-700')
      expect(result).not.toContain('cursor-not-allowed')
    })

    it('should handle object styles in dark mode', () => {
      const isDarkEnabled = true

      const result = tc({
        base: {
          static: 'bg-white',
          dark: {
            static: {
              'bg-gray-900': isDarkEnabled,
              'bg-black': !isDarkEnabled,
            },
          },
        },
      })
      expect(result).toContain('bg-white')
      expect(result).toContain('dark:bg-gray-900')
      expect(result).not.toContain('dark:bg-black')
    })

    it('should handle mixed conditional and static classes', () => {
      const isActive = true
      const isPending = false

      const result = tc({
        base: {
          static: {
            'px-4 py-2': true,
            'bg-blue-500': isActive,
            'bg-gray-500': !isActive,
            'animate-pulse': isPending,
          },
          hover: 'opacity-90',
        },
      })

      expect(result).toContain('px-4')
      expect(result).toContain('bg-blue-500')
      expect(result).not.toContain('bg-gray-500')
      expect(result).not.toContain('animate-pulse')
      expect(result).toContain('hover:opacity-90')
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined values gracefully', () => {
      expect(tc({ base: { static: 'flex' }, md: undefined as any })).toBe(
        'flex'
      )
      expect(tc({ base: { static: 'flex', hover: undefined } })).toBe('flex')
      expect(tc({ base: { static: {} } })).toBe('')
    })

    it('should not add extra spaces between classes', () => {
      const result = tc({
        base: {
          static: 'flex items-center',
          hover: 'bg-blue-500',
        },
      })
      expect(result).not.toMatch(/\s{2,}/)
    })

    it('should handle extremely long class strings efficiently', () => {
      const result = tc({
        base: {
          static:
            'p-1 p-2 p-3 p-4 m-1 m-2 m-3 m-4 text-xs text-sm text-base text-lg',
          hover: 'bg-red-100 bg-red-200 bg-red-300 bg-red-400',
          focus: 'ring-1 ring-2 ring-3 ring-4',
          active: 'scale-90 scale-95 scale-100 scale-105',
          dark: {
            static: 'bg-gray-700 bg-gray-800 bg-gray-900',
            hover: 'bg-gray-600 bg-gray-700',
          },
        },
        md: {
          static: 'p-5 p-6 p-7 p-8',
          hover: 'bg-blue-500 bg-blue-600',
        },
        lg: {
          static: 'p-9 p-10',
        },
      })

      expect(result.length).toBeGreaterThan(0)
      expect(result).not.toMatch(/\s{2,}/)
    })
  })
})
