import PitchDiagram from "components/PitchDiagram";

export default {
  component: PitchDiagram,
  props: {
    reading: "こうこうがっこう",
    pitchNum: 2,
    showMora: true,
    showLabel: true,
    colors: {
      heiban: "#d20ca3",
      odaka: "#0cd24d",
      nakadaka: "#27a2ff",
      atamadaka: "#ea9316",
      unknown: "#cccccc",
    },
  },
};
