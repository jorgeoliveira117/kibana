/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { expect } from '@kbn/scout/ui';
import {
  spaceTest,
  testData,
  DEFAULT_TIME_RANGE,
} from '../../fixtures/metrics_experience';

spaceTest.describe(
  'Metrics in Discover - grid sort',
  { tag: testData.METRICS_EXPERIENCE_TAGS },
  () => {
    spaceTest.beforeAll(async ({ apiServices, scoutSpace }) => {
      await apiServices.core.settings({
        'feature_flags.overrides': {
          [testData.METRICS_EXPERIENCE_GRID_SORT_FEATURE_FLAG_KEY]: true,
        },
      });
      await scoutSpace.savedObjects.load(testData.KBN_ARCHIVE);
      await scoutSpace.uiSettings.setDefaultIndex(testData.DATA_VIEW_NAME);
      await scoutSpace.uiSettings.setDefaultTime(DEFAULT_TIME_RANGE);
    });

    spaceTest.beforeEach(async ({ browserAuth, pageObjects }) => {
      await browserAuth.loginAsViewer();
      await pageObjects.discover.goto({ queryMode: 'esql' });
    });

    spaceTest.afterAll(async ({ apiServices, scoutSpace }) => {
      await apiServices.core.settings({
        'feature_flags.overrides': {
          [testData.METRICS_EXPERIENCE_GRID_SORT_FEATURE_FLAG_KEY]: null,
        },
      });
      await scoutSpace.uiSettings.unset('defaultIndex', 'timepicker:timeDefaults');
      await scoutSpace.savedObjects.cleanStandardList();
    });

    spaceTest('shows the sort selector when the feature flag is enabled', async ({
      pageObjects,
    }) => {
      await pageObjects.discover.writeAndSubmitEsqlQuery(testData.ESQL_QUERIES.TS);

      await expect(pageObjects.metricsExperience.grid).toBeVisible();
      await expect(pageObjects.metricsExperience.sortSelectorButton).toBeVisible();
      await expect(pageObjects.metricsExperience.sortSelectorButton).toContainText('Sort:');
    });
  }
);
