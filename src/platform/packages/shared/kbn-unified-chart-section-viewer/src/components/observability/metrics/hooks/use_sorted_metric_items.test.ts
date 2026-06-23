/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { renderHook } from '@testing-library/react';
import { ES_FIELD_TYPES } from '@kbn/field-types';
import type { ParsedMetricItem } from '../../../../types';
import { useSortedMetricItems } from './use_sorted_metric_items';
import { DEFAULT_METRICS_SORT } from '../sort/metrics_sort_types';

const createMetricItem = (metricName: string): ParsedMetricItem => ({
  metricName,
  indexName: 'metrics-*',
  units: ['ms'],
  metricTypes: ['counter'],
  fieldTypes: [ES_FIELD_TYPES.DOUBLE],
  dimensionFields: [{ name: 'host.name' }],
});

describe('useSortedMetricItems', () => {
  const unsortedItems = [
    createMetricItem('system.memory.utilization'),
    createMetricItem('k8s.pod.cpu'),
    createMetricItem('system.cpu.utilization'),
  ];

  it('returns A to Z ordering for the default sort', () => {
    const { result } = renderHook(() => useSortedMetricItems(unsortedItems, DEFAULT_METRICS_SORT));

    expect(result.current.map((item) => item.metricName)).toEqual([
      'k8s.pod.cpu',
      'system.cpu.utilization',
      'system.memory.utilization',
    ]);
  });

  it('returns Z to A ordering when direction is desc', () => {
    const { result } = renderHook(() =>
      useSortedMetricItems(unsortedItems, { type: 'name', direction: 'desc' })
    );

    expect(result.current.map((item) => item.metricName)).toEqual([
      'system.memory.utilization',
      'system.cpu.utilization',
      'k8s.pod.cpu',
    ]);
  });

  it('returns an empty array for empty input', () => {
    const { result } = renderHook(() => useSortedMetricItems([], DEFAULT_METRICS_SORT));

    expect(result.current).toEqual([]);
  });

  it('memoizes the sorted array when inputs are unchanged', () => {
    const { result, rerender } = renderHook(
      ({ items, sort }) => useSortedMetricItems(items, sort),
      {
        initialProps: {
          items: unsortedItems,
          sort: DEFAULT_METRICS_SORT,
        },
      }
    );

    const firstResult = result.current;
    rerender({ items: unsortedItems, sort: DEFAULT_METRICS_SORT });

    expect(result.current).toBe(firstResult);
  });
});
