import { css } from 'styled-components'

type AnimationNames =
  | 'fade'
  | 'fadeSlideUp'
  | 'fadeSlideDown'
  | 'slideUp'
  | 'slideRight'
  | 'fadeSlideRight'
  | 'slideLeft'
  | 'slideDown'
  | 'fadeExpand'
  | 'spin';

const animateEntrance = (
  name: AnimationNames = 'fadeSlideUp',
  duration = 1000,
  delay = 0,
  easing = 'cubic-bezier(0, 0, 0.25, 1.01)',
) => {
  switch (name) {
    case 'fade': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      opacity: 0;
      transform: translateY(0em);
    `
    case 'fadeSlideUp': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      opacity: 0;
      transform: translateY(0.65em);
    `
    case 'fadeSlideDown': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      opacity: 0;
      transform: translateY(-0.65em);
    `
    case 'slideRight': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      transform: translateX(-100%);
    `
    case 'fadeSlideRight': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      opacity: 0;
      transform: translateX(-100%);
    `
    case 'slideUp': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      transform: translateY(1em);
    `
    case 'slideLeft': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      transform: translateX(100%);
    `
    case 'slideDown': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay}ms;
      transform: translateY(-100%);
    `
    case 'fadeExpand': return css`
      animation: moveToPosition ${duration}ms ${easing} forwards;
      animation-delay: ${delay};
      opacity: 0;
      transform: scale(0.5);
    `
    case 'spin': return css`
      animation: spin ${duration}ms infinite ${easing};
    `
    default: return ''
  }
}

export default animateEntrance
