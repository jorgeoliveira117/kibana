/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { __IntlProvider as IntlProvider } from '@kbn/i18n-react';
import { MetricsSortSelector } from './metrics_sort_selector';
import {
  DEFAULT_METRICS_SORT,
  encodeMetricsSortValue,
} from '../observability/metrics/sort/metrics_sort_types';
import { METRICS_SORT_SELECTOR_DATA_TEST_SUBJ } from '../../common/constants';

jest.mock('@kbn/shared-ux-toolbar-selector', () => {
  const actual = jest.requireActual('@kbn/shared-ux-toolbar-selector');
  return {
    ...actual,
    ToolbarSelector: ({
      options,
      onChange,
      buttonLabel,
      'data-test-subj': dataTestSubj,
    }: {
      options: Array<{ key: string; value: string; label: string; checked?: string }>;
      onChange?: (option: { value: string }) => void;
      buttonLabel: React.ReactNode;
      'data-test-subj'?: string;
    }) => (
      <div data-test-subj={dataTestSubj}>
        <div data-test-subj={`${dataTestSubj}Button`}>{buttonLabel}</div>
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            data-test-subj={`${dataTestSubj}Option-${option.value}`}
            data-checked={option.checked}
            onClick={() => onChange?.(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    ),
  };
});

const renderSelector = (props: Partial<React.ComponentProps<typeof MetricsSortSelector>> = {}) => {
  const onChange = props.onChange ?? jest.fn();

  render(
    <IntlProvider locale="en">
      <MetricsSortSelector metricsSort={DEFAULT_METRICS_SORT} onChange={onChange} {...props} />
    </IntlProvider>
  );

  return { onChange };
};

describe('MetricsSortSelector', () => {
  it('renders with the default A to Z selection', () => {
    renderSelector();

    expect(screen.getByTestId(METRICS_SORT_SELECTOR_DATA_TEST_SUBJ)).toBeInTheDocument();
    expect(screen.getByTestId(`${METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}Button`)).toHaveTextContent(
      'Sort: A to Z'
    );
    expect(
      screen.getByTestId(
        `${METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}Option-${encodeMetricsSortValue(
          DEFAULT_METRICS_SORT
        )}`
      )
    ).toHaveAttribute('data-checked', 'on');
  });

  it('calls onChange with Z to A when that option is selected', () => {
    const onChange = jest.fn();
    renderSelector({ onChange });

    fireEvent.click(screen.getByTestId(`${METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}Option-name:desc`));

    expect(onChange).toHaveBeenCalledWith({ type: 'name', direction: 'desc' });
  });

  it('shows Z to A in the button label when that sort is selected', () => {
    renderSelector({ metricsSort: { type: 'name', direction: 'desc' } });

    expect(screen.getByTestId(`${METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}Button`)).toHaveTextContent(
      'Sort: Z to A'
    );
  });
});
