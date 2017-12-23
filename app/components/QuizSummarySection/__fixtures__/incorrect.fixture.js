import QuizSummarySection, { SECTION_TYPES } from "components/QuizSummarySection";

export default {
  component: QuizSummarySection,
  url: "/",
  props: {
    ...QuizSummarySection.defaultProps,
    sectionType: SECTION_TYPES.INCORRECT,
    items: {
      GURU: [
        {
          id: 12346,
          word: "無駄",
          furi: "0:む;1:だ",
          primaryMeaning: "no good",
          primaryReading: "むだ",
          secondaryMeanings: ["no, no good for me"],
          correct: 2,
          incorrect: 3,
        },
        {
          id: 12345,
          word: "承る",
          furi: "",
          primaryMeaning: "to consent",
          primaryReading: "うけたまわる",
          secondaryMeanings: ["to hear", "to be informed", "to listen to"],
          correct: 0,
          incorrect: 0,
        },
      ],
      BURNED: [
        {
          id: 12345,
          word: "系譜",
          furi: "0:けい;1:ふ",
          primaryMeaning: "family tree",
          primaryReading: "けいふ",
          secondaryMeanings: ["lineage", "genealogy"],
          correct: 4,
          incorrect: 1,
        },
      ],
    },
  },
};
