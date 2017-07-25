import React from 'react';
import PropTypes from 'prop-types';
import { withStateHandlers } from 'recompose';

import ReadingHeader from 'components/ReadingHeader';
import SentencePair from 'components/SentencePair';
import VocabEntryLinks from 'components/VocabEntryLinks';
import Reading from 'components/Reading';
import IconButton from 'components/IconButton';
import KanjiStroke from 'components/KanjiStroke';

import { Li, ReadingContent } from './styles';

// prevent xhr if not rendered
const renderKanjiStroke = (character) => <KanjiStroke character={character} />;

VocabEntryReading.propTypes = {
  character: PropTypes.string.isRequired,
  kana: PropTypes.arrayOf(PropTypes.string).isRequired,
  sentenceEn: PropTypes.string.isRequired,
  sentenceJa: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  detailLevel: PropTypes.number.isRequired,
  showLock: PropTypes.bool.isRequired,
  showKanjiSvg: PropTypes.bool.isRequired,
  toggleKanjiSvg: PropTypes.func.isRequired,
};

function VocabEntryReading({
  character,
  kana,
  sentenceEn,
  sentenceJa,
  tags,
  index,
  id,
  detailLevel,
  showLock,
  toggleKanjiSvg,
  showKanjiSvg,
}) {
  return (
    <Li>
      {detailLevel >= 1 && <ReadingHeader showLock={showLock && index === 0} id={id} character={character} tags={tags} />}
      {detailLevel >= 1 && <VocabEntryLinks character={character} />}
      <ReadingContent>
        <Reading character={character} kana={kana} />
        {detailLevel >= 1 && <SentencePair
          sentenceEn={sentenceEn}
          sentenceJa={sentenceJa}
          character={character}
          kana={kana}
        />}
      </ReadingContent>
      {detailLevel >= 1 && (
      <div>
        {!showKanjiSvg && <IconButton name="BRUSH" title="View stroke diagram" size="1.8em" handleClick={toggleKanjiSvg} />}
        {showKanjiSvg && renderKanjiStroke(character)}
      </div>
    )}
    </Li>
  );
}

const enhance = withStateHandlers(
  () => ({ showKanjiSvg: false }),
  { toggleKanjiSvg: () => () => ({ showKanjiSvg: true }) },
);

export default enhance(VocabEntryReading);