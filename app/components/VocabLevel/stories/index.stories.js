import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { levels } from 'shared/testTables';
import VocabLevel from '../index';

storiesOf('components.VocabLevel', module)
  .add('VocabLevel with required props', () => (
    <VocabLevel
      level={12}
      handleLevelLock={action('handleLevelLock')}
    />
  ))
  .add('VocabLevel with isLocked={true} & isActionable={true}', () => (
    <VocabLevel
      {...levels[11]}
      handleLevelLock={action('handleLevelLock')}
      isLocked
      isActionable
    />
  ))
  .add('VocabLevel with isLocked={false} & isActionable={true}', () => (
    <VocabLevel
      {...levels[11]}
      handleLevelLock={action('handleLevelLock')}
      isLocked={false}
      isActionable
    />
  ));
