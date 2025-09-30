type Style = string | { [key: string]: boolean }

type StateStyles = {
  static: Style
  hover?: Style
  focus?: Style
  active?: Style
  visited?: Style
  target?: Style
  first?: Style
  last?: Style
  only?: Style
  odd?: Style
  even?: Style
  empty?: Style
  disabled?: Style
  enabled?: Style
  checked?: Style
  indeterminate?: Style
  default?: Style
  required?: Style
  valid?: Style
  invalid?: Style
  autofill?: Style
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

  const genPrefix = (type: keyof StateStyles | keyof ColourStyles) =>
    `${type === 'static' ? '' : `${type}:`}`

  const evaluate = (styles: Style): string => {
    if (typeof styles === 'string') return styles.trim()

    let string = ''
    for (const [style, evaluater] of Object.entries(styles))
      if (evaluater) string += ` ${style}`

    return string.trim()
  }

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
          const styles = mediaStyles.dark[stateType]
          if (!styles) continue

          const prefix = genPrefix(stateType)
          classString += ` ${genString(`${mediaPrefix}dark:${prefix}`, evaluate(styles))}`
        }
      } else {
        const styles = mediaStyles[styleType as keyof StateStyles]
        if (!styles) continue

        const prefix = genPrefix(styleType)
        classString += ` ${genString(`${mediaPrefix}${prefix}`, evaluate(styles))}`
      }
    }
  }

  // Remove any multi-spaces and trailing spaces
  return classString.trim().replace(/ +/g, ' ')
}
