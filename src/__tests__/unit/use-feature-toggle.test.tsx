import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  FeatureToggleProvider,
  useFeatureToggle,
} from '../../feature-toggle-provider';
import { FeatureToggle } from '../../feature-toggle';
import { FeatureToggleServiceConfig } from 'feature-toggle-service';
import { vi } from 'vitest';

describe('useFeatureToggle', () => {
  const featureToggleService: FeatureToggleServiceConfig = {
    thisOneIsEnabled: true,
    thisOneIsDisabled: false,
    anotherEnabledFeature: true,
  };

  describe('when used within FeatureToggleProvider', () => {
    it('should return isOn function that checks enabled features', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();

        return (
          <div>
            <div data-testid="enabled">
              {isOn('thisOneIsEnabled') ? 'yes' : 'no'}
            </div>
            <div data-testid="disabled">
              {isOn('thisOneIsDisabled') ? 'yes' : 'no'}
            </div>
          </div>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('enabled').textContent).toBe('yes');
      expect(screen.getByTestId('disabled').textContent).toBe('no');
    });

    it('should return toggles object with all feature flags', () => {
      const TestComponent = () => {
        const { toggles } = useFeatureToggle();

        return <div data-testid="toggles">{JSON.stringify(toggles)}</div>;
      };

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      const togglesElement = screen.getByTestId('toggles');
      expect(togglesElement.textContent).toBe(
        JSON.stringify(featureToggleService)
      );
    });

    it('should return false for non-existent features', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();

        return (
          <div data-testid="non-existent">
            {isOn('nonExistentFeature') ? 'yes' : 'no'}
          </div>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('non-existent').textContent).toBe('no');
    });

    it('should work with multiple feature checks in same component', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();
        const hasFeature1 = isOn('thisOneIsEnabled');
        const hasFeature2 = isOn('anotherEnabledFeature');
        const hasFeature3 = isOn('thisOneIsDisabled');

        return (
          <div data-testid="result">
            {hasFeature1 && hasFeature2 && !hasFeature3
              ? 'correct'
              : 'incorrect'}
          </div>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('result').textContent).toBe('correct');
    });

    it('should work in deeply nested components', () => {
      const DeepComponent = () => {
        const { isOn } = useFeatureToggle();

        return (
          <div data-testid="deep">
            {isOn('thisOneIsEnabled') ? 'enabled' : 'disabled'}
          </div>
        );
      };

      const MiddleComponent = () => (
        <div>
          <DeepComponent />
        </div>
      );

      const TestComponent = () => (
        <div>
          <MiddleComponent />
        </div>
      );

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('deep').textContent).toBe('enabled');
    });

    it('should handle conditional rendering based on feature flags', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();

        if (isOn('thisOneIsEnabled')) {
          return <div data-testid="enabled-ui">Enabled UI</div>;
        }

        return <div data-testid="disabled-ui">Disabled UI</div>;
      };

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('enabled-ui')).toBeInTheDocument();
      expect(screen.queryByTestId('disabled-ui')).not.toBeInTheDocument();
    });

    it('should update when feature flags change', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();

        return (
          <div data-testid="feature-status">
            {isOn('thisOneIsEnabled') ? 'enabled' : 'disabled'}
          </div>
        );
      };

      const { rerender } = render(
        <FeatureToggleProvider
          featureToggleService={{ thisOneIsEnabled: true }}
        >
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('feature-status').textContent).toBe('enabled');

      rerender(
        <FeatureToggleProvider
          featureToggleService={{ thisOneIsEnabled: false }}
        >
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('feature-status').textContent).toBe('disabled');
    });
  });

  describe('when used WITHOUT FeatureToggleProvider', () => {
    beforeAll(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should throw error with descriptive message', () => {
      const TestComponent = () => {
        useFeatureToggle();

        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFeatureToggle must be used within FeatureToggleProvider');
    });

    it('should throw error when trying to access isOn', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();

        return <div>{isOn('feature') ? 'yes' : 'no'}</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFeatureToggle must be used within FeatureToggleProvider');
    });

    it('should throw error when trying to access toggles', () => {
      const TestComponent = () => {
        const { toggles } = useFeatureToggle();

        return <div>{JSON.stringify(toggles)}</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFeatureToggle must be used within FeatureToggleProvider');
    });

    it('should throw error in deeply nested component without provider', () => {
      const DeepComponent = () => {
        useFeatureToggle();

        return <div>Deep Component</div>;
      };

      const MiddleComponent = () => (
        <div>
          <DeepComponent />
        </div>
      );

      const TestComponent = () => (
        <div>
          <MiddleComponent />
        </div>
      );

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFeatureToggle must be used within FeatureToggleProvider');
    });

    it('should provide helpful error message for debugging', () => {
      const TestComponent = () => {
        useFeatureToggle();

        return <div>Test</div>;
      };

      try {
        render(<TestComponent />);
      } catch (error) {
        expect((error as Error).message).toBe(
          'useFeatureToggle must be used within FeatureToggleProvider'
        );
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty feature flags object', () => {
      const TestComponent = () => {
        const { toggles, isOn } = useFeatureToggle();

        return (
          <div>
            <div data-testid="empty-toggles">
              {Object.keys(toggles || {}).length}
            </div>
            <div data-testid="check-feature">
              {isOn('anyFeature') ? 'yes' : 'no'}
            </div>
          </div>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={{}}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('empty-toggles').textContent).toBe('0');
      expect(screen.getByTestId('check-feature').textContent).toBe('no');
    });

    it('should handle feature names with special characters', () => {
      const specialFlags: FeatureToggleServiceConfig = {
        'feature-with-dash': true,
        feature_with_underscore: false,
        'feature.with.dot': true,
      };

      const TestComponent = () => {
        const { isOn } = useFeatureToggle();

        return (
          <div>
            <div data-testid="dash">
              {isOn('feature-with-dash') ? 'yes' : 'no'}
            </div>
            <div data-testid="underscore">
              {isOn('feature_with_underscore') ? 'yes' : 'no'}
            </div>
            <div data-testid="dot">
              {isOn('feature.with.dot') ? 'yes' : 'no'}
            </div>
          </div>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={specialFlags}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('dash').textContent).toBe('yes');
      expect(screen.getByTestId('underscore').textContent).toBe('no');
      expect(screen.getByTestId('dot').textContent).toBe('yes');
    });

    it('should handle empty string feature name', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();

        return <div data-testid="empty-string">{isOn('') ? 'yes' : 'no'}</div>;
      };

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('empty-string').textContent).toBe('no');
    });

    it('should work with nested providers with different configs', () => {
      const outerFlags: FeatureToggleServiceConfig = {
        outerFeature: true,
        sharedFeature: false,
      };

      const innerFlags: FeatureToggleServiceConfig = {
        innerFeature: true,
        sharedFeature: true,
      };

      const OuterComponent = () => {
        const { isOn } = useFeatureToggle();

        return (
          <div>
            <div data-testid="outer-feature">
              {isOn('outerFeature') ? 'yes' : 'no'}
            </div>
            <div data-testid="outer-shared">
              {isOn('sharedFeature') ? 'yes' : 'no'}
            </div>
          </div>
        );
      };

      const InnerComponent = () => {
        const { isOn } = useFeatureToggle();

        return (
          <div>
            <div data-testid="inner-feature">
              {isOn('innerFeature') ? 'yes' : 'no'}
            </div>
            <div data-testid="inner-shared">
              {isOn('sharedFeature') ? 'yes' : 'no'}
            </div>
          </div>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={outerFlags}>
          <OuterComponent />
          <FeatureToggleProvider featureToggleService={innerFlags}>
            <InnerComponent />
          </FeatureToggleProvider>
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('outer-feature').textContent).toBe('yes');
      expect(screen.getByTestId('outer-shared').textContent).toBe('no');
      expect(screen.getByTestId('inner-feature').textContent).toBe('yes');
      expect(screen.getByTestId('inner-shared').textContent).toBe('yes');
    });
  });

  describe('integration with FeatureToggle component', () => {
    it('should work alongside FeatureToggle component', () => {
      const TestComponent = () => {
        const { isOn } = useFeatureToggle();
        const showExtraContent = isOn('anotherEnabledFeature');

        return (
          <div>
            {showExtraContent && (
              <p data-testid="hook-content">Hook-based content</p>
            )}
            <FeatureToggle featureName="thisOneIsEnabled">
              <p data-testid="component-content">Component-based content</p>
            </FeatureToggle>
          </div>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={featureToggleService}>
          <TestComponent />
        </FeatureToggleProvider>
      );

      expect(screen.getByTestId('hook-content')).toBeInTheDocument();
      expect(screen.getByTestId('component-content')).toBeInTheDocument();
    });
  });
});
