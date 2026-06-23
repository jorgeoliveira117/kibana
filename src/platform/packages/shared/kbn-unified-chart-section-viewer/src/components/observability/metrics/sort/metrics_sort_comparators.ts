/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { ParsedMetricItem } from '../../../../types';
import type { MetricsSortDirection, MetricsSortType } from './metrics_sort_types';

export type MetricsSortComparator = (a: ParsedMetricItem, b: ParsedMetricItem) => number;

export const compareByMetricName = (a: ParsedMetricItem, b: ParsedMetricItem): number =>
  a.metricName.localeCompare(b.metricName);

const reverseComparator =
  (comparator: MetricsSortComparator): MetricsSortComparator =>
  (a, b) =>
    comparator(b, a);

const comparatorsByType: Record<MetricsSortType, MetricsSortComparator> = {
  name: compareByMetricName,
};

export const getMetricsSortComparator = (
  type: MetricsSortType,
  direction: MetricsSortDirection
): MetricsSortComparator => {
  const comparator = comparatorsByType[type];
  return direction === 'desc' ? reverseComparator(comparator) : comparator;
};
