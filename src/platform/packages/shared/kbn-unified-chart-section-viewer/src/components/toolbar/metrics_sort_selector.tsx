/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useMemo } from 'react';
import { i18n } from '@kbn/i18n';
import type { SelectableEntry } from '@kbn/shared-ux-toolbar-selector';
import { ToolbarSelector } from '@kbn/shared-ux-toolbar-selector';
import { METRICS_SORT_SELECTOR_DATA_TEST_SUBJ } from '../../common/constants';
import {
  decodeMetricsSortValue,
  encodeMetricsSortValue,
  METRICS_SORT_OPTIONS,
  type MetricsSortState,
} from '../observability/metrics/sort/metrics_sort_types';

interface MetricsSortSelectorProps {
  metricsSort: MetricsSortState;
  onChange: (sort: MetricsSortState) => void;
  fullWidth?: boolean;
}

const getSortOptionLabel = (sort: MetricsSortState): string => {
  if (sort.type === 'name' && sort.direction === 'asc') {
    return i18n.translate('metricsExperience.sort.nameAsc', {
      defaultMessage: 'A to Z',
    });
  }

  return i18n.translate('metricsExperience.sort.nameDesc', {
    defaultMessage: 'Z to A',
  });
};

export const MetricsSortSelector = ({
  metricsSort,
  onChange,
  fullWidth = false,
}: MetricsSortSelectorProps) => {
  const selectedValue = encodeMetricsSortValue(metricsSort);

  const options = useMemo<SelectableEntry[]>(
    () =>
      METRICS_SORT_OPTIONS.map((option) => {
        const value = encodeMetricsSortValue(option);
        return {
          key: value,
          value,
          label: getSortOptionLabel(option),
          checked: value === selectedValue ? 'on' : undefined,
        };
      }),
    [selectedValue]
  );

  const handleChange = useCallback(
    (chosenOption?: SelectableEntry) => {
      if (!chosenOption?.value) {
        return;
      }

      const nextSort = decodeMetricsSortValue(chosenOption.value);
      if (nextSort) {
        onChange(nextSort);
      }
    },
    [onChange]
  );

  const buttonLabel = i18n.translate('metricsExperience.sort.buttonLabel', {
    defaultMessage: 'Sort: {selection}',
    values: {
      selection: getSortOptionLabel(metricsSort),
    },
  });

  return (
    <ToolbarSelector
      data-test-subj={METRICS_SORT_SELECTOR_DATA_TEST_SUBJ}
      data-selected-value={selectedValue}
      searchable={false}
      buttonLabel={buttonLabel}
      popoverTitle={i18n.translate('metricsExperience.sort.popoverTitle', {
        defaultMessage: 'Sort metrics',
      })}
      options={options}
      onChange={handleChange}
      fullWidth={fullWidth}
    />
  );
};
