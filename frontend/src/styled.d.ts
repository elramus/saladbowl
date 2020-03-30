import 'styled-components/macro'
import theme from './lib/theme'

type ThemeInterface = typeof theme;

declare module 'styled-components/macro' {
  interface DefaultTheme extends ThemeInterface {}
}
