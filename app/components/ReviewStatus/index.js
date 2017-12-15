import React from "react";
import PropTypes from "prop-types";
import { compose, branch, renderNothing, shouldUpdate, mapProps } from "recompose";
import ReactInterval from "react-interval";

import shouldUpdateDeepEqual from "utils/shouldUpdateDeepEqual";
import dateOrFalse from "utils/dateOrFalse";
import getReviewStatusText from "utils/getReviewStatusText";
import H3 from "base/H3";
import Element from "base/Element";

ReviewStatus.propTypes = {
  reviewsCount: PropTypes.number.isRequired,
  vacationDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([false]),
  ]).isRequired,
  nextReviewDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([false]),
  ]).isRequired,
};

function ReviewStatus({ reviewsCount, vacationDate, nextReviewDate }) {
  return (
    <Element flexRow flexCenter>
      <H3>{getReviewStatusText({ reviewsCount, vacationDate, nextReviewDate })}</H3>
      {/* FIXME: uhhh... this will always be the same if there has been no server call for updated dates.... */}
      {/* TODO: Interval should be in parent container and pass changed props TO this component... */}
      <ReactInterval
        enabled
        timeout={5000}
        callback={() =>
          getReviewStatusText({ reviewsCount, vacationDate, nextReviewDate })
        }
      />
    </Element>
  );
}

export default compose(
  mapProps(({ nextReviewDate, vacationDate, ...rest }) => ({
    nextReviewDate: dateOrFalse(nextReviewDate),
    vacationDate: dateOrFalse(vacationDate),
    ...rest,
  })),
  branch(({ nextReviewDate }) => nextReviewDate === undefined, renderNothing),
  shouldUpdate(shouldUpdateDeepEqual)
)(ReviewStatus);
