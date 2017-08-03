import styled, { css } from 'styled-components';
import { placeholder } from 'polished';

import StreakIcon from 'components/StreakIcon';
import IconButton from 'components/IconButton';

import { visuallyHidden } from 'shared/styles/utils';
import { shadowBox, innerMedium } from 'shared/styles/shadows';
import { kilo } from 'shared/styles/typography';
import { gutter } from 'shared/styles/layout';
import { fastEaseQuad, shake } from 'shared/styles/animation';
import { transparent, white, whiteLight, whiteDark, black, yellowOrange, red, green, orange } from 'shared/styles/colors';

const bgColorMixin = ({ marked, valid, correct, incorrect, ignored }) => {
  if (marked && !valid) {
    return `background-color: ${yellowOrange};`;
  }
  if (ignored) {
    return `background-color: ${orange};`;
  }
  if (correct) {
    return `background-color: ${green};`;
  }
  if (incorrect) {
    return `background-color: ${red};`;
  }
  return false;
};

export const AnswerWrapper = styled.div`
  position: relative;
  color: currentColor;
  background-color: ${whiteLight};
  ${shadowBox}
`;

export const Form = styled.form`
  ${gutter({ prop: 'margin' })}
  ${kilo}
  position: relative;
  overflow: hidden;
  max-width: 100%;
  color: ${({ marked, valid }) => marked && valid ? white : black};
  background-color: ${transparent};
  border: 0;
  border-radius: 0;
  outline: none;
  appearance: none;
  z-index: 2;

  & ${AnswerWrapper} {
    ${bgColorMixin}
  }
`;

export const Label = styled.label`
  ${visuallyHidden}
`;

export const Input = styled.input`
  ${kilo}
  display: block;
  width: 100%;
  margin: 0;
  outline: none;
  border: 0;
  line-height: 1.75;
  min-height: 2.2em;
  text-align: center;
  color: currentColor;
  box-shadow: ${innerMedium};
  background-color: inherit;

  /* leave some space for streak icon / submit button */
  padding-left: 30px;
  padding-right: 40px;
  transition: all ${fastEaseQuad};

  &:placeholder-shown {
    ${placeholder({ color: whiteDark })} /* focused input placeholder text color */
  }

  ${({ marked, valid }) => {
    const color = valid ? white : black;
    return marked && css`
      color: ${color}; /* Override Android / IE font color change */
      -webkit-opacity: 1; /* Override iOS opacity change affecting text & background color */
      ${placeholder({ color })} /* Override browser-forced color */
      &:placeholder-shown {
        ${placeholder({ color })} /* Override browser-forced color */
      }
    `;
  }}

  ${({ ignored }) => ignored && `
    animation: ${shake} .4s linear;
  `}

  &:focus {
    outline: none;
  }

  /*hide stupid X on IE*/
  &::-ms-clear {
    display: none;
  }
`;

export const Streak = styled(StreakIcon)`
  display: block;
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  left: .35em;
  transition: all ${fastEaseQuad};
  z-index: 2;
`;

export const ActionButtons = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
`;

const ActionButton = styled(IconButton)`
  height: 100%;
  align-self: center;
  color: currentColor;
  background-color: ${transparent};
  transition: all ${fastEaseQuad};
  padding: 0 !important;
  z-index: 2;

  &:hover {
    opacity: 1;
  }
`;

export const SubmitButton = ActionButton;
export const IgnoreButton = ActionButton.extend`
 opacity: .5;
`;
