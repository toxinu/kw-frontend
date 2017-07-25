import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose } from 'recompose';
import toKana from 'wanakana/toKana';
import { onlyKanjiOrKana, onlyKana } from 'shared/validations';

import app from 'containers/App/actions';
import quiz from 'containers/QuizPage/actions';

import { Heading } from 'components/VocabEntrySynonyms/styles';
import AddSynonymField from './AddSynonymField';
import { Form, SubmitButton } from './styles';

AddSynonym.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  answerValue: PropTypes.string,
  answerType: PropTypes.string,
};

AddSynonym.defaultProps = {
  answerValue: '',
  answerType: '',
};

const convertInput = (value) => toKana(value.toLowerCase(), { IMEMode: true });

function AddSynonym({ handleSubmit, submitting, answerValue, answerType }) {
  return (
    <Form onSubmit={handleSubmit} >
      <Heading>Add New Synonym</Heading>
      <Field
        name="kanji"
        type="text"
        component={AddSynonymField}
        label="Kanji"
        normalize={convertInput}
        userAnswer={answerValue}
        answerType={answerType}
      />
      <Field
        name="kana"
        type="text"
        component={AddSynonymField}
        label="Kana"
        normalize={convertInput}
        userAnswer={answerValue}
        answerType={answerType}
      />
      <SubmitButton
        type="submit"
        active={submitting}
        disabled={submitting}
      >
        Submit
      </SubmitButton>
    </Form>
  );
}

const enhance = compose(
  reduxForm({
    form: 'addSynonym',
    onSubmit: ({ kanji, kana }, dispatch, { id, category }) => {
      const errors = {
        kanji: onlyKanjiOrKana(kanji),
        kana: onlyKana(kana),
      };
      if (Object.values(errors).some(Boolean)) {
        throw new SubmissionError(errors);
      } else {
        dispatch(app.review.synonym.add.request({ reviewId: id, character: kanji, kana }));
        dispatch(quiz.answer.ignore({ category }));
      }
    },
  }),
);

export default enhance(AddSynonym);