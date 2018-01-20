// TODO: consider using Chromatism to create a more unified color scheme
// https://github.com/toish/chromatism
// or go ahead with simple shades palette
// https://www.reshader.com/

import { mix, rgb } from 'polished';

export const chromeDefaultBg = rgb(250, 250, 250);
export const whiteLight = '#fafafa';
export const white = '#f0f0f0';
export const whiteDark = '#d9d9d9';
export const greyLight = '#ababab';
export const grey = '#8c8c8c';
export const greyDark = '#616161';
export const blackLight = '#4d4d4d';
export const black = '#3b3b3b';
export const blackDark = '#141414';
export const purpleLight = '#8523e7';
export const purple = '#890ce9';
export const purpleDark = '#6331b9';
export const blueLight = '#30c0f9';
export const blue = '#4c81d6';
export const blueDark = '#2e50dc';
export const green = '#7fd468';
export const teal = '#19d6b1';
export const pink = '#ff00c3';
export const pinkLight = mix(0.7, whiteLight, pink);
export const red = '#e2325b';
export const orange = '#f66f46';
export const yellowOrange = '#ffd800';
export const yellow = '#f5d800';
export const tan = '#e2b46a';
export const golden = '#f7f7c9';

// safer than 'transparent' css value since browser implementations are different
export const transparent = 'rgba(0, 0, 0, 0)';

// we often reference Object.keys(COLORS) or COLORS[color]
// ensure that we can still set currentColor easily instead of setting 'undefined'
export const currentColor = 'currentColor';

export const link = blue;
export const linkHover = blueLight;

export const SRS_COLORS = {
  UNTRAINED: pinkLight,
  APPRENTICE: pink,
  GURU: purpleLight,
  MASTER: blueDark,
  ENLIGHTENED: blueLight,
  BURNED: blackLight,
};