import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { titleCase } from "voca";
import cuid from "cuid";

import StripeHeading from "components/StripeHeading";
import VocabList, { ITEM_TYPES as VOCABLIST_TYPES } from "components/VocabList";

import { gutter } from "shared/styles/layout";

// prettier-ignore
const Wrapper = styled.div`
  ${gutter({ type: "inner" })}
`;

const VocabListRanked = ({
  items, sectionType, color, cardsExpanded,
}) =>
  Object.entries(items).map(([rank, words]) => (
    <Wrapper key={cuid()}>
      <StripeHeading text={titleCase(rank)} count={words.length} />
      <VocabList
        itemType={cardsExpanded ? VOCABLIST_TYPES.CARD : VOCABLIST_TYPES.CHIP}
        items={words}
        color={color}
        tooltipSuffix={`${sectionType}-${rank}`}
      />
    </Wrapper>
  ));

VocabListRanked.propTypes = {
  items: PropTypes.array,
  sectionType: PropTypes.string,
  color: PropTypes.string,
  cardsExpanded: PropTypes.bool,
};

export default VocabListRanked;
