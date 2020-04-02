export const theme = {
  // Colors
  black: '#444',
  darkGray: '#767676',
  middleGray: '#d6d6d6',
  lightGray: '#F4F4F4',
  offWhite: '#FAFAFA',
  darkGreen: '#69A98F',
  middleGreen: '#8FC6B0',
  green: '#A7D6B6',
  lightGreen: '#D1E9D9',
  red: '#ec3d12',

  // Custom easing
  ease: {
    cubic: 'cubic-bezier(.23,1,.32,1)',
  },

  // Fonts
  fonts: {
    main: 'Nunito Sans, Helvetica, arial, sans-serif',
  },

  /**
   * Typographic module scale! Base font size here is 16px. Change to
   * whatever you want.
   *
   * Calculated from base font size with a ratio of 1.25. So, ms(0) is your
   * base font size, and you can go up and down from there.
   * https://www.modularscale.com.
   */
  ms: (modifier: number) => `${(18 * (1.33 ** modifier)).toFixed(2)}px`,
}

export default theme
