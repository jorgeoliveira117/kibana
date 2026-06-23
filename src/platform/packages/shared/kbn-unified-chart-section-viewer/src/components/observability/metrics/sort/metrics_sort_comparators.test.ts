/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { ES_FIELD_TYPES } from '@kbn/field-types';
import type { ParsedMetricItem } from '../../../../types';
import {
  compareByMetricName,
  getMetricsSortComparator,
} from './metrics_sort_comparators';

const createMetricItem = (metricName: string): ParsedMetricItem => ({
  metricName,
  indexName: 'metrics-*',
  units: ['ms'],
  metricTypes: ['counter'],
  fieldTypes: [ES_FIELD_TYPES.DOUBLE],
  dimensionFields: [{ name: 'host.name' }],
});

describe('metrics sort comparators', () => {
  const unsortedNames = ['system.memory.utilization', 'k8s.pod.cpu', 'system.cpu.utilization'];
  const unsortedItems = unsortedNames.map(createMetricItem);
  const expectedAscNames = [...unsortedNames].sort((a, b) => a.localeCompare(b));

  describe('compareByMetricName', () => {
    it('sorts metric names A→Z using localeCompare', () => {
      const sorted = [...unsortedItems].sort(compareByMetricName);

      expect(sorted.map((item) => item.metricName)).toEqual(expectedAscNames);
    });

    it('returns 0 for equal metric names', () => {
      const itemA = createMetricItem('system.cpu.utilization');
      const itemB = createMetricItem('system.cpu.utilization');

      expect(compareByMetricName(itemA, itemB)).toBe(0);
    });
  });

  describe('getMetricsSortComparator', () => {
    it('returns A→Z ordering for name + asc', () => {
      const comparator = getMetricsSortComparator('name', 'asc');
      const sorted = [...unsortedItems].sort(comparator);

      expect(sorted.map((item) => item.metricName)).toEqual(expectedAscNames);
    });

    it('returns Z→A ordering for name + desc', () => {
      const comparator = getMetricsSortComparator('name', 'desc');
      const sorted = [...unsortedItems].sort(comparator);

      expect(sorted.map((item) => item.metricName)).toEqual([...expectedAscNames].reverse());
    });

    it('produces a stable sort when metric names tie', () => {
      const duplicateItems = [
        createMetricItem('system.cpu.utilization'),
        createMetricItem('system.cpu.utilization'),
        createMetricItem('system.memory.utilization'),
      ];
      const comparator = getMetricsSortComparator('name', 'asc');

      expect([...duplicateItems].sort(comparator).map((item) => item.metricName)).toEqual([
        'system.cpu.utilization',
        'system.cpu.utilization',
        'system.memory.utilization',
      ]);
    });

    it('handles empty and single-item arrays', () => {
      const comparator = getMetricsSortComparator('name', 'asc');

      expect([].sort(comparator)).toEqual([]);
      expect([createMetricItem('system.cpu.utilization')].sort(comparator)).toEqual([
        createMetricItem('system.cpu.utilization'),
      ]);
    });
  });
});
