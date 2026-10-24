import * as main from '../../index';
import * as client from '../../client';

describe('entry points', () => {
  it('should export the provider, the hook and the component from the main entry point', () => {
    expect(Object.keys(main).sort()).toEqual([
      'FeatureToggle',
      'FeatureToggleProvider',
      'useFeatureToggle',
    ]);
  });

  it('should keep `reactor-feature-toggle/client` with the same exports', () => {
    expect(Object.keys(client).sort()).toEqual(Object.keys(main).sort());
  });
});
