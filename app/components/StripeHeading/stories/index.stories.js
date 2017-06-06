import React from 'react';
import { storiesOf } from '@storybook/react';
import StripeHeading from '../index';

storiesOf('components.StripeHeading', module)
  .add('StripeHeading with required text prop', () => (
    <StripeHeading text="Apprentice" />
  ))
  .add('StripeHeading with optional count prop', () => (
    <StripeHeading text="Apprentice" count={22} />
  ));
