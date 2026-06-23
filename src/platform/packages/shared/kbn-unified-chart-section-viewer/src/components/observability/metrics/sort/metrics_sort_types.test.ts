/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import {
  DEFAULT_METRICS_SORT,
  decodeMetricsSortValue,
  encodeMetricsSortValue,
  METRICS_SORT_OPTIONS,
} from './metrics_sort_types';

describe('metrics sort types', () => {
  it('defines the default sort as name ascending', () => {
    expect(DEFAULT_METRICS_SORT).toEqual({ type: 'name', direction: 'asc' });
  });

  it('encodes and decodes sort state values', () => {
    for (const sort of METRICS_SORT_OPTIONS) {
      const encoded = encodeMetricsSortValue(sort);
      expect(decodeMetricsSortValue(encoded)).toEqual(sort);
    }
  });

  it('returns undefined for invalid encoded values', () => {
    expect(decodeMetricsSortValue('invalid')).toBeUndefined();
    expect(decodeMetricsSortValue('name:up')).toBeUndefined();
  });
});
