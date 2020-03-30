import styled from 'styled-components/macro'

const HelperText = styled('p')`
  color: ${(props) => props.theme.darkGray};
  font-weight: 600;
  font-style: italic;
  margin-bottom: 2em;
`

export { HelperText }
