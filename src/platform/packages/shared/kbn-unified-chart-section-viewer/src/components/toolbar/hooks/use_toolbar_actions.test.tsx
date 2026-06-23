/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiProvider } from '@elastic/eui';
import { fireEvent, render, screen } from '@testing-library/react';
import { __IntlProvider as IntlProvider } from '@kbn/i18n-react';
import { useToolbarActions } from './use_toolbar_actions';
import * as metricsExperienceStateProvider from '../../observability/metrics/context/metrics_experience_state_provider';
import { DEFAULT_METRICS_SORT } from '../../observability/metrics/sort/metrics_sort_types';
import { METRICS_SORT_SELECTOR_DATA_TEST_SUBJ } from '../../../common/constants';

jest.mock('../../observability/metrics/context/metrics_experience_state_provider');

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
            onClick={() => onChange?.(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    ),
  };
});

const useMetricsExperienceStateMock =
  metricsExperienceStateProvider.useMetricsExperienceState as jest.MockedFunction<
    typeof metricsExperienceStateProvider.useMetricsExperienceState
  >;

const ToolbarActionsHarness = (props: Partial<Parameters<typeof useToolbarActions>[0]> = {}) => {
  const { leftSideActions } = useToolbarActions({
    allDimensions: [],
    renderToggleActions: () => undefined,
    ...props,
  });

  return <>{leftSideActions}</>;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <EuiProvider highContrastMode={false}>
    <IntlProvider locale="en">{children}</IntlProvider>
  </EuiProvider>
);

describe('useToolbarActions sort selector', () => {
  const onMetricsSortChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useMetricsExperienceStateMock.mockReturnValue({
      currentPage: 0,
      selectedDimensions: [],
      onDimensionsChange: jest.fn(),
      onPageChange: jest.fn(),
      isFullscreen: false,
      searchTerm: '',
      onSearchTermChange: jest.fn(),
      metricsSort: DEFAULT_METRICS_SORT,
      onMetricsSortChange,
      onToggleFullscreen: jest.fn(),
      flyoutState: undefined,
      onFlyoutStateChange: jest.fn(),
      onFlyoutSelectedTabChange: jest.fn(),
      profileId: 'test-profile-id',
    });
  });

  it('does not render the sort selector when isGridSortEnabled is false', () => {
    render(<ToolbarActionsHarness />, { wrapper });

    expect(
      screen.queryByTestId(`${METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}Button`)
    ).not.toBeInTheDocument();
  });

  it('renders the sort selector when isGridSortEnabled is true', () => {
    render(<ToolbarActionsHarness isGridSortEnabled={true} />, { wrapper });

    expect(screen.getByTestId(`${METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}Button`)).toBeInTheDocument();
  });

  it('calls onMetricsSortChange when a sort option is selected', () => {
    render(<ToolbarActionsHarness isGridSortEnabled={true} />, { wrapper });

    fireEvent.click(screen.getByTestId(`${METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}Option-name:desc`));

    expect(onMetricsSortChange).toHaveBeenCalledWith({ type: 'name', direction: 'desc' });
  });
});
