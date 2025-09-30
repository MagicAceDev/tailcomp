type StateStyles = {
  static: string
  hover?: string
  focus?: string
  active?: string
  visited?: string
  target?: string
  first?: string
  last?: string
  only?: string
  odd?: string
  even?: string
  empty?: string
  disabled?: string
  enabled?: string
  checked?: string
  indeterminate?: string
  default?: string
  required?: string
  valid?: string
  invalid?: string
  autofill?: string
}

type ColourStyles = {
  dark?: StateStyles | string
}

type MediaStyles = StateStyles & ColourStyles

type TailcompStyles = {
  'base': MediaStyles
  'sm'?: MediaStyles
  'md'?: MediaStyles
  'lg'?: MediaStyles
  'xl'?: MediaStyles
  '2xl'?: MediaStyles
}

export default function tc(classes: TailcompStyles): string {
  let classString = ''

  // A generic function to get object keys with proper typing
  const getObjectKeys = <T extends Object>(obj: T) =>
    Object.keys(obj) as Array<keyof T>

  // Generate class string with optional prefix (for media, state, and color scheme)
  const genString = (prefix: string, styles: string | undefined) => {
    if (!styles) return '' // Guard clause for undefined styles
    return styles
      .split(' ')
      .map((c) => `${prefix}${c}`)
      .join(' ')
  }

  const genPrefix = (type: keyof StateStyles | 'dark') =>
    `${type === 'static' ? '' : `${type}:`}`

  for (const mediaType of getObjectKeys(classes)) {
    const mediaStyles = classes[mediaType]
    if (!mediaStyles) continue

    const mediaPrefix = mediaType === 'base' ? '' : `${mediaType}:`

    for (const styleType of getObjectKeys(mediaStyles)) {
      if (styleType === 'dark' && mediaStyles.dark) {
        if (typeof mediaStyles.dark === 'string') {
          classString += ` ${genString(
            `${mediaPrefix}dark:`,
            mediaStyles.dark
          )}`
          continue
        }

        for (const stateType of getObjectKeys(mediaStyles.dark)) {
          const prefix = genPrefix(stateType)
          const styles = mediaStyles.dark[stateType]
          classString += ` ${genString(`${mediaPrefix}dark:${prefix}`, styles)}`
        }
      } else {
        const prefix = genPrefix(styleType)
        const styles = mediaStyles[styleType as keyof StateStyles]
        classString += ` ${genString(`${mediaPrefix}${prefix}`, styles)}`
      }
    }
  }

  return classString.trim()
}
