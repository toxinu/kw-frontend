import { keyframes } from 'styled-components';

const timings = {

  inQuad: 'cubic-bezier(0.550,  0.085, 0.680, 0.530)',
  inCubic: 'cubic-bezier(0.550,  0.055, 0.675, 0.190)',
  inQuart: 'cubic-bezier(0.895,  0.030, 0.685, 0.220)',
  inQuint: 'cubic-bezier(0.755,  0.050, 0.855, 0.060)',
  inSine: 'cubic-bezier(0.470,  0.000, 0.745, 0.715)',
  inExpo: 'cubic-bezier(0.950,  0.050, 0.795, 0.035)',
  inCirc: 'cubic-bezier(0.600,  0.040, 0.980, 0.335)',
  inBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
  outQuad: 'cubic-bezier(0.250,  0.460, 0.450, 0.940)',
  outCubic: 'cubic-bezier(0.215,  0.610, 0.355, 1.000)',
  outQuart: 'cubic-bezier(0.165,  0.840, 0.440, 1.000)',
  outQuint: 'cubic-bezier(0.230,  1.000, 0.320, 1.000)',
  outSine: 'cubic-bezier(0.390,  0.575, 0.565, 1.000)',
  outExpo: 'cubic-bezier(0.190,  1.000, 0.220, 1.000)',
  outCirc: 'cubic-bezier(0.075,  0.820, 0.165, 1.000)',
  outBack: 'cubic-bezier(0.175,  0.885, 0.320, 1.275)',
  inOutQuad: 'cubic-bezier(0.455,  0.030, 0.515, 0.955)',
  inOutCubic: 'cubic-bezier(0.645,  0.045, 0.355, 1.000)',
  inOutQuart: 'cubic-bezier(0.770,  0.000, 0.175, 1.000)',
  inOutQuint: 'cubic-bezier(0.860,  0.000, 0.070, 1.000)',
  inOutSine: 'cubic-bezier(0.445,  0.050, 0.550, 0.950)',
  inOutExpo: 'cubic-bezier(1.000,  0.000, 0.000, 1.000)',
  inOutCirc: 'cubic-bezier(0.785,  0.135, 0.150, 0.860)',
  inOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550',
};

export function easing(name = 'inOutQuad') {
  const timing = timings[name];
  if (!timing) console.warn(new Error(`Unknown timing provided to easing(): ${name}`)); // eslint-disable-line no-console
  return timing;
}

const wobble = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-8deg);
  }
  75% {
    transform: rotate(8deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const shake = keyframes`
  from, to {
    transform: translate3d(0, 0, 0);
  }

  10%, 40%, 70% {
    transform: translate3d(-8px, 0, 0);
  }

  25%, 55%, 85% {
    transform: translate3d(8px, 0, 0);
  }
}`;

// .shake {
//   animation: shake .6s;
//   animation-fill-mode: both;
// }

const fadeOutUp = keyframes`
  0% {
    opacity: 1;
    transform: translate3d(0,0,0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate3d(0, -125px, 0) scale(1.4);
  }
}`;

const srsRankUp = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 3.5em, 0);
  }

  30% {
    opacity: .1;
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}`;

const srsRankDown = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, -3.5em, 0);
  }

  30% {
    opacity: .1;
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}`;

export {
  wobble,
  shake,
  fadeOutUp,
  srsRankDown,
  srsRankUp,
};
