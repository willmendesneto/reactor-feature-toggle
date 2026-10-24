import * as server from '../../index';
import * as client from '../../client';

describe('entry points', () => {
  it('should only export server-safe APIs from the main entry point', () => {
    expect(Object.keys(server).sort()).toEqual(['FeatureToggle']);
  });

  it('should export client-only APIs from `reactor-feature-toggle/client`', () => {
    expect(Object.keys(client).sort()).toEqual([
      'FeatureToggleProvider',
      'useFeatureToggle',
    ]);
  });
});
