import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LockButton from '../index';

storiesOf('components.LockButton', module)
  .add('LockButton with isActionable={false}', () => (
    <LockButton
      title={'Unlock level'}
      isActionable={false}
      isLocked
      handleClick={action('lock-click')}
    />
  ))
  .add('LockButton with isActionable={true} & isLocked={true}', () => (
    <LockButton
      title={'Unlock level'}
      isActionable
      isLocked
      handleClick={action('lock-click')}
    />
  ))
  .add('LockButton with isActionable={true} & isLocked={false}', () => (
    <LockButton
      title={'Lock level'}
      isActionable
      isLocked={false}
      handleClick={action('lock-click')}
    />
  ));
