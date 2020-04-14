import { createGlobalStyle } from 'styled-components'
import theme from './theme'
import reset from './reset'

const GlobalStyles = createGlobalStyle`
  ${reset}

  /* For accessibility, add visible focus if user starts tabbing, otherwise hide it. */
  body:not(.user-is-tabbing) * {
    outline: none;
  }

  html, body {
    font-family: ${theme.fonts.main};
    color: ${theme.black};
    font-size: ${theme.ms(0)};
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 900;
  }
  h1 {
    font-size: ${theme.ms(3)};
  }
  h2 {
    font-size: ${theme.ms(2)};
  }
  h3 {
    font-size: ${theme.ms(1)};
  }
  h4 {
    font-size: ${theme.ms(0)};
    font-weight: bold;
  }
  h5 {
    font-size: ${theme.ms(-1)};
    text-transform: uppercase;
    font-weight: bold;
  }
  h6 {
    font-size: ${theme.ms(-1)};
  }
  p {
    margin-bottom: 1em;
  }


  /* Lists */
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style-type: none;
  }

  /* Forms */
  button, input, textarea {
    background: none;
  }
  button {
    border: 0;
    cursor: pointer;
    color: inherit;
    &:disabled {
      opacity: 0.25 !important;
      cursor: not-allowed;
    }
  }
  input, textarea {
    color: inherit;
    border: none;
    border-radius: 10px;
    box-shadow: 0 2px 23px transparent;
    border: 1px solid ${theme.lightGreen};
    -webkit-appearance: none;
    transition: box-shadow 150ms ease-out, border-color 150ms ease-out;
    &:focus {
      border-color: transparent;
      box-shadow: 0 2px 23px ${theme.lightGreen};
    }
  }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
  }

  input[type=number] {
      -moz-appearance: textfield !important;
  }
  textarea {
    padding: 0.75rem 1rem;
    resize: none;
  }

  /* Animations */
  @keyframes moveToPosition {
    to {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes pulseRight {
    from {
      transform: translateX(-300%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`

export default GlobalStyles
