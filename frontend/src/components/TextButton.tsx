import React from 'react'
import styled from 'styled-components'
import { IconPrefix, IconName } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import theme from '../lib/theme'

interface StyleProps {
  fontSize: string
  color: string
  bg: string
  hoverBg: string
  padding: string
  border: string
  boxShadow: string
  weight: string
  width: string
}

const Container = styled('button')<{ styles: StyleProps }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.styles.padding};
  border: ${props => props.styles.border};
  border-radius: 5px;
  width: ${props => props.styles.width};
  max-width: 20rem;
  color: ${props => props.styles.color};
  text-transform: uppercase;
  font-weight: ${props => props.styles.weight};
  background: ${props => props.styles.bg};
  box-shadow: ${props => props.styles.boxShadow};
  transition: opacity 100ms ease-out, background-color 100ms ease-out;
  .loading {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.75);
    svg {
      font-size: ${props => props.theme.ms(2)};
      color: ${props => props.theme.darkGreen};
    }
  }
  span {
    line-height: 1;
    font-size: ${props => props.styles.fontSize};
  }
  .leading-icon {
    margin-right: 0.5rem;
  }
  .trailing-icon {
    margin-left: 0.5rem;
  }
  &:hover {
    opacity: 0.75;
    background: ${props => props.styles.hoverBg};
  }
`

interface Props {
  text: string | React.ReactNode
  onClick: () => void
  type?: 'button' | 'submit'
  variant?: 'cta' | 'cta-reverse' | 'big' | 'simple' | 'simple-reverse'
  color?: string
  bg?: string
  hoverBg?: string
  border?: string
  weight?: string
  width?: string
  leadingIcon?: [IconPrefix, IconName]
  trailingIcon?: [IconPrefix, IconName]
  disabled?: boolean
  showLoading?: boolean
}

const TextButton: React.FC<Props> = ({
  text,
  onClick,
  type = 'button',
  variant,
  color,
  bg,
  hoverBg,
  border,
  weight,
  width,
  leadingIcon,
  trailingIcon,
  disabled,
  showLoading: loading,
}) => {
  // Put the style props into an object for modification.
  // Declare defaults here!
  const styles: StyleProps = {
    fontSize: theme.ms(-1),
    color: color ?? theme.darkGreen,
    bg: bg ?? 'none',
    hoverBg: hoverBg ?? theme.lightGray,
    boxShadow: 'none',
    border: border ?? '1px solid transparent',
    padding: '0.65rem 1.05rem',
    weight: weight ?? 'bold',
    width: width ?? 'auto',
  }

  // Modify based on the variant, if present.
  if (variant === 'cta') {
    styles.color = theme.black
    styles.bg = theme.green
    styles.hoverBg = theme.green
  }
  if (variant === 'cta-reverse') {
    styles.color = 'fff'
    styles.fontSize = theme.ms(0)
    styles.bg = theme.darkGreen
    styles.hoverBg = theme.lightGreen
    styles.padding = '1.5em 4em'
    styles.width = '100%'
  }
  if (variant === 'big') {
    styles.fontSize = theme.ms(0)
    styles.color = theme.black
    styles.bg = theme.green
    styles.hoverBg = theme.green
    styles.padding = '2em 2em'
    styles.width = '100%'
  }
  if (variant === 'simple') {
    styles.padding = '0'
    styles.bg = 'none'
    styles.hoverBg = 'none'
  }
  if (variant === 'simple-reverse') {
    styles.padding = '0'
    styles.bg = 'none'
    styles.hoverBg = 'none'
    styles.color = theme.black
  }

  return (
    <Container
      className="text-button"
      onClick={onClick}
      type={type}
      disabled={disabled}
      styles={styles}
    >
      {loading && (
        <div className="loading">
          <FontAwesomeIcon icon={['fas', 'spinner-third']} spin />
        </div>
      )}
      {leadingIcon && (
        <FontAwesomeIcon icon={leadingIcon} className="leading-icon" />
      )}
      <span>{text}</span>
      {trailingIcon && (
        <FontAwesomeIcon icon={trailingIcon} className="trailing-icon" />
      )}
    </Container>
  )
}

export default TextButton
