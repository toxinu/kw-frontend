import styled, { css } from 'styled-components';
import { lighten, darken } from 'polished';

import { white, purple } from 'common/styles/colors';
import BackgroundImg from 'common/components/BackgroundImg';
// match review background image svg color
export const backgroundImageColor = '#e5e5e5';

export const Upper = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 30vh;
  color: ${white};
  ${({ bgColor }) => css`
    background-color: ${bgColor || purple};
    background-image: linear-gradient(180deg, ${lighten(0.05, bgColor || purple)}, ${darken(0.05, bgColor || purple)});
    background-repeat: repeat-x;
  `}
`;

export const Lower = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  min-height: 100%;
  background-color: ${backgroundImageColor};
`;

export const Background = BackgroundImg.extend`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  max-width: 100%;
  min-height: auto;
  max-height: 25vmax;
  margin-top: auto;
  opacity: .9;
  z-index: 0;
  background-position: bottom right;
`;
