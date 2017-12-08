import { createLogic } from 'redux-logic';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { purgeStoredState } from 'redux-persist';
import { uniq, difference } from 'lodash';
import * as reduxFormActions from 'redux-form';

// TODO: inject some of these in store.js as logic dependencies instead?
import * as api from 'shared/api';
import { setToken, clearToken } from 'utils/auth';

import {
  serializeUserResponse,
  serializeLevelsResponse,
  serializeReviewResponse,
  serializeReviewEntries,
  serializeQueueResponse,
  serializeLevelResponse,
  serializeAnnouncementsResponse,
  serializeAddSynonymResponse,
  serializeVocabularySearch,
} from 'shared/serializers';

import { selectLevelsSubmitting } from 'pages/VocabLevelsPage/selectors';

import * as sel from './selectors';
import app from './actions';

const { startSubmit, stopSubmit, reset } = reduxFormActions;

export const userRegisterLogic = createLogic({
  type: app.user.register.request,
  process({ action: { payload } }, dispatch, done) {
    const form = 'multiLogin';
    dispatch(startSubmit(form));
    api
      .registerUser(payload)
      .then(() => {
        dispatch(app.user.login.request(payload));
        dispatch(stopSubmit(form));
        done();
      })
      .catch(({ body }) => {
        if (body) {
          dispatch(stopSubmit(form, {
            ...body,
            apiKey: body.api_key,
            _error: body.non_field_errors,
          }));
          dispatch(app.user.register.failure(body));
        }
        console.warn(`Register failure. Response body was: ${JSON.stringify(body)}`);
        done();
      });
  },
});

export const userLoginLogic = createLogic({
  type: app.user.login.request,
  process({ action: { payload } }, dispatch, done) {
    const form = 'multiLogin';
    dispatch(startSubmit(form));
    api
      .loginUser(payload)
      .then(({ body: { token } }) => {
        dispatch(app.user.login.success(token));
        dispatch(stopSubmit(form));
        done();
      })
      .catch(({ body }) => {
        if (body) {
          dispatch(app.user.login.failure(body));
          dispatch(stopSubmit(form, { ...body, _error: body.non_field_errors }));
        }
        console.warn(`Login failure. Response body was: ${JSON.stringify(body)}`);
        done();
      });
  },
});

export const loginRedirectLogic = createLogic({
  type: app.user.login.success,
  process({ action }, dispatch, done) {
    setToken(action.payload);
    dispatch(push('/'));
    done();
  },
});

export const userResetPasswordLogic = createLogic({
  type: app.user.resetPassword.request,
  process({ action: { payload } }, dispatch, done) {
    const form = 'multiLogin';
    dispatch(startSubmit(form));
    api
      .resetPassword(payload)
      .then((res) => {
        dispatch(app.user.resetPassword.success(res));
        dispatch(stopSubmit(form));
        // TODO: notify user
        done();
      })
      .catch(({ body }) => {
        if (body) {
          dispatch(stopSubmit(form, { ...body, _error: body.non_field_errors }));
          dispatch(app.user.resetPassword.failure(body));
        }
        console.warn(`API failure. Response body was: ${JSON.stringify(body)}`);
        done();
      });
  },
});
/* eslint-disable no-console */
export const userLogoutLogic = createLogic({
  type: app.user.logout,
  process({ persistConfig }, dispatch, done) {
    clearToken();
    purgeStoredState(persistConfig)
      .then(() => {
        console.info('persisted KW state purged');
      })
      .catch((err) => {
        console.warn('persisted KW state failed to purge: ', err);
      });
    dispatch({ type: 'RESET' }); // redux-reset in app/store.js
    dispatch(push('/welcome'));
    done();
  },
});
/* eslint-enable */

export const userLoadLogic = createLogic({
  type: app.user.load.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.user.load.success,
    failType: app.user.load.failure,
  },

  process() {
    return api.getUserProfile().then(({ body }) => serializeUserResponse(body));
  },
});

export const loadQueuesIfNeededLogic = createLogic({
  type: app.user.load.success,
  latest: true,
  process({ getState }, dispatch, done) {
    const state = getState();
    const {
      reviewCount, lessonCount, reviewQueue, lessonQueue,
    } = {
      reviewCount: sel.selectSessionCount(state, { category: 'reviews' }),
      lessonCount: sel.selectSessionCount(state, { category: 'lessons' }),
      reviewQueue: sel.selectQueue(state, { category: 'reviews' }),
      lessonQueue: sel.selectQueue(state, { category: 'lessons' }),
    };

    const needReviewsQueue = reviewCount > 0 && reviewQueue.length <= 0;
    const needLessonsQueue = lessonCount > 0 && lessonQueue.length <= 0;
    if (needReviewsQueue) {
      dispatch(app.reviews.queue.load.request());
    }
    if (needLessonsQueue) {
      dispatch(app.lessons.queue.load.request());
    }
    done();
  },
});

export const announcementsLoadLogic = createLogic({
  type: app.announcements.load.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.announcements.load.success,
    failType: app.announcements.load.failure,
  },

  process() {
    return api
      .getAnnouncements()
      .then(({ body }) => serializeAnnouncementsResponse(body));
  },
});

export const reviewsQueueLoadLogic = createLogic({
  type: app.reviews.queue.load.request,
  warnTimeout: 8000,
  latest: true,

  processOptions: {
    successType: app.reviews.queue.load.success,
    failType: app.reviews.queue.load.failure,
  },

  process({ getState, action: { payload } }) {
    return api.getCurrentReviews(payload).then(({ body }) => {
      const { reviews, ids } = serializeQueueResponse(body);
      return {
        reviews,
        ids: difference(ids, [sel.selectCurrentId(getState())]),
      };
    });
  },
});

export const lessonsQueueLoadLogic = createLogic({
  type: app.lessons.queue.load.request,
  warnTimeout: 8000,
  latest: true,

  processOptions: {
    successType: app.lessons.queue.load.success,
    failType: app.lessons.queue.load.failure,
  },

  process({ action: { payload } }) {
    return api
      .getCurrentLessons(payload)
      .then(({ body }) => serializeQueueResponse(body));
  },
});

export const levelsLoadLogic = createLogic({
  type: app.levels.load.request,
  throttle: 60000,
  latest: true,
  warnTimeout: 10000,
  processOptions: {
    successType: app.levels.load.success,
    failType: app.levels.load.failure,
  },

  process() {
    return api.getLevels().then(({ body }) => serializeLevelsResponse(body));
  },
});

export const levelLockLogic = createLogic({
  type: app.level.lock.request,
  warnTimeout: 10000,
  processOptions: {
    failType: app.level.lock.failure,
  },

  process({ action: { payload: { id } } }, dispatch, done) {
    api.lockLevel({ id }).then(() => {
      dispatch(app.reviews.queue.clear());
      dispatch(app.lessons.queue.clear());
      dispatch(app.level.lock.success({ id }));
      dispatch(app.user.load.request());
      done();
    });
  },
});

export const levelUnlockLogic = createLogic({
  type: app.level.unlock.request,
  warnTimeout: 10000,
  validate({ getState, action }, allow, reject) {
    const alreadySubmitting = selectLevelsSubmitting(getState()).length >= 1;
    if (alreadySubmitting) {
      alert('Please unlock levels one at a time. Turtles get tired too.');
      reject(/* TODO: app.notifications.alert */);
    } else {
      allow(action);
    }
  },

  processOptions: {
    failType: app.level.unlock.failure,
  },

  process({ action: { payload: { id } } }, dispatch, done) {
    api.unlockLevel({ id }).then(() => {
      dispatch(app.level.load.request({ id }));
      dispatch(app.level.unlock.success({ id }));
      dispatch(app.user.load.request());
      done();
    });
  },
});

export const reviewSearchLogic = createLogic({
  type: app.review.search.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    failType: app.review.search.failure,
  },

  process({ getState, action: { payload } }, dispatch, done) {
    const form = 'searchBar';
    dispatch(startSubmit(form));
    return api.getVocabulary(payload).then(({ body }) => {
      const persistedReviews = sel.selectReviewEntities(getState());
      const allIds = uniq(serializeVocabularySearch(body));
      const haveIds = allIds.reduce(
        (list, id) => (persistedReviews[id] ? list.concat(id) : list),
        []
      );
      const missingIds = difference(allIds, haveIds);
      // FIXME: filter out unviewable reviews, waiting on backend issue #344
      dispatch(app.review.search.success({
        ids: haveIds,
        loading: true,
        finished: false,
      }));
      Promise.all(missingIds.map((id) => api.getReviewEntry({ id }).then((res) => res.body))).then((missingReviews) => {
        dispatch(stopSubmit(form));
        dispatch(reset(form));
        dispatch(app.reviews.update({
          reviews: serializeReviewEntries(missingReviews),
        }));
        dispatch(app.review.search.success({
          ids: allIds,
          loading: false,
          finished: true,
        }));
        done();
      });
    });
  },
});

export const reviewSearchClearLogic = createLogic({
  type: LOCATION_CHANGE,
  validate({ action, getState }, allow, reject) {
    if (getState().searchResults.length) {
      allow(action);
    }
    reject();
  },
  process(_, dispatch, done) {
    dispatch(app.review.clearSearch());
    done();
  },
});

export const reviewLoadLogic = createLogic({
  type: app.review.load.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.load.success,
    failType: app.review.load.failure,
  },

  process({ action: { payload: { id } } }) {
    return api
      .getReviewEntry({ id })
      .then(({ body }) => serializeReviewResponse(body));
  },
});

export const reviewLockLogic = createLogic({
  type: app.review.lock.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.lock.success,
    failType: app.review.lock.failure,
  },

  process({ action: { payload: { id } } }) {
    return api.lockReview({ id }).then(() => ({ id, isHidden: true }));
  },
});

export const reviewUnlockLogic = createLogic({
  type: app.review.unlock.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.unlock.success,
    failType: app.review.unlock.failure,
  },

  process({ action: { payload: { id } } }) {
    return api.unlockReview({ id }).then(() => ({ id, isHidden: false }));
  },
});

export const reviewNotesLogic = createLogic({
  type: app.review.notes.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    failType: app.review.notes.failure,
  },

  process({ action: { payload: { id, notes } } }) {
    return api
      .saveReviewNotes({ id, notes })
      .then(() => app.review.update({ id, notes }));
  },
});

export const addSynonymLogic = createLogic({
  type: app.review.synonym.add.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.synonym.add.success,
    failType: app.review.synonym.add.failure,
  },

  process({ action: { payload: { reviewId, character, kana } } }) {
    return api
      .addSynonym({ reviewId, character, kana })
      .then(({ body }) => serializeAddSynonymResponse(body));
  },
});

export const removeSynonymLogic = createLogic({
  type: app.review.synonym.remove.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.synonym.remove.success,
    failType: app.review.synonym.remove.failure,
  },

  process({ action: { payload: { id, reviewId } } }) {
    return api.removeSynonym({ id }).then(() => ({ id, reviewId }));
  },
});

export const levelLoadLogic = createLogic({
  type: app.level.load.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.level.load.success,
    failType: app.level.load.failure,
  },

  process({ action: { payload: { id } } }) {
    return api
      .getReviews({ id, limit: 150 })
      .then(({ body: { results } }) => serializeLevelResponse({ id, results }));
  },
});

export const contactLogic = createLogic({
  type: app.contact.request,
  warnTimeout: 10000,

  process({ action: { payload } }, dispatch, done) {
    const form = 'contact';
    dispatch(startSubmit(form));
    api
      .sendContactMessage(payload)
      .then(() => {
        // FIXME: server response sends CSRF token and no json which errors in fetch decode (despite 202 response)
        dispatch(app.contact.success());
        dispatch(stopSubmit(form));
        done();
      })
      .catch(({ body }) => {
        dispatch(stopSubmit(form, { ...body }));
        dispatch(reset(form));
        // TODO: failure notification
        dispatch(app.contact.failure(body));
        done();
      });
  },
});

// All logic to be loaded
export default [
  userLoginLogic,
  userRegisterLogic,
  loginRedirectLogic,
  userResetPasswordLogic,
  userLogoutLogic,
  userLoadLogic,
  announcementsLoadLogic,
  reviewsQueueLoadLogic,
  lessonsQueueLoadLogic,
  loadQueuesIfNeededLogic,
  levelsLoadLogic,
  levelLockLogic,
  levelUnlockLogic,
  reviewLoadLogic,
  reviewSearchLogic,
  reviewSearchClearLogic,
  addSynonymLogic,
  removeSynonymLogic,
  reviewLockLogic,
  reviewUnlockLogic,
  reviewNotesLogic,
  levelLoadLogic,
  contactLogic,
];
