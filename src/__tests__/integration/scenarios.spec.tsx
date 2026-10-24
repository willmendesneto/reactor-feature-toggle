// Scenarios validated with feature-toggle-service 8: they leaked or didn't
// update the UI while the provider used the global `set()`/`isOn()`
import { act, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { isOn as globalIsOn } from 'feature-toggle-service';
import {
  FeatureToggle,
  FeatureToggleProvider,
  MULTIPLE_PROVIDERS_ERROR,
  useFeatureToggle,
} from '../../feature-toggle-provider';

const HookStatus = ({ name }: { name: string }) => {
  const { isOn } = useFeatureToggle();

  return <span data-testid={`hook-${name}`}>{isOn(name) ? 'on' : 'off'}</span>;
};

describe('scenarios', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('provider is required', () => {
    it('should throw when `FeatureToggle` is rendered outside the provider', () => {
      expect(() =>
        render(<FeatureToggle featureName="feature">content</FeatureToggle>)
      ).toThrow('useFeatureToggle must be used within FeatureToggleProvider');
    });

    it('should throw when `useFeatureToggle` is used outside the provider', () => {
      expect(() => render(<HookStatus name="feature" />)).toThrow(
        'useFeatureToggle must be used within FeatureToggleProvider'
      );
    });
  });

  describe('single provider', () => {
    it('should throw and log an error for nested providers', () => {
      expect(() =>
        render(
          <FeatureToggleProvider featureToggleService={{ feature: true }}>
            <FeatureToggleProvider featureToggleService={{ feature: false }}>
              <span>content</span>
            </FeatureToggleProvider>
          </FeatureToggleProvider>
        )
      ).toThrow(MULTIPLE_PROVIDERS_ERROR);
      expect(console.error).toHaveBeenCalledWith(MULTIPLE_PROVIDERS_ERROR);
    });

    it('should detect nested providers when hydrating server-rendered markup', () => {
      const App = () => (
        <FeatureToggleProvider featureToggleService={{}}>
          <FeatureToggleProvider featureToggleService={{}}>
            <span>content</span>
          </FeatureToggleProvider>
        </FeatureToggleProvider>
      );

      // Effects don't run on the server, so the check happens in the browser
      const html = renderToString(<App />);
      expect(html).toBe('<span>content</span>');

      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);

      expect(() => render(<App />, { container, hydrate: true })).toThrow(
        MULTIPLE_PROVIDERS_ERROR
      );
      expect(console.error).toHaveBeenCalledWith(MULTIPLE_PROVIDERS_ERROR);
    });

    it('should throw and log an error for sibling providers', () => {
      expect(() =>
        render(
          <>
            <FeatureToggleProvider featureToggleService={{ feature: true }}>
              <span>first</span>
            </FeatureToggleProvider>
            <FeatureToggleProvider featureToggleService={{ feature: false }}>
              <span>second</span>
            </FeatureToggleProvider>
          </>
        )
      ).toThrow(MULTIPLE_PROVIDERS_ERROR);
      expect(console.error).toHaveBeenCalledWith(MULTIPLE_PROVIDERS_ERROR);
    });

    it('should allow a new provider after the previous one is unmounted', () => {
      const { unmount } = render(
        <FeatureToggleProvider featureToggleService={{ feature: true }}>
          <span>first</span>
        </FeatureToggleProvider>
      );
      unmount();

      expect(() =>
        render(
          <FeatureToggleProvider featureToggleService={{ feature: true }}>
            <span>second</span>
          </FeatureToggleProvider>
        )
      ).not.toThrow();
    });

    it('should not report multiple providers in `StrictMode`', () => {
      render(
        <StrictMode>
          <FeatureToggleProvider featureToggleService={{ feature: true }}>
            <HookStatus name="feature" />
          </FeatureToggleProvider>
        </StrictMode>
      );

      expect(screen.getByTestId('hook-feature').textContent).toBe('on');
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('child component changes the toggles', () => {
    it('should update every consumer when a child calls `set()`', () => {
      const Child = () => {
        const { set } = useFeatureToggle();

        return (
          <button onClick={() => set({ childFeature: true })}>enable</button>
        );
      };

      render(
        <FeatureToggleProvider featureToggleService={{ childFeature: false }}>
          <Child />
          <FeatureToggle featureName="childFeature">
            <p>child content</p>
          </FeatureToggle>
          <HookStatus name="childFeature" />
        </FeatureToggleProvider>
      );
      expect(screen.queryByText('child content')).toBeNull();

      fireEvent.click(screen.getByText('enable'));

      expect(screen.queryByText('child content')).not.toBeNull();
      expect(screen.getByTestId('hook-childFeature').textContent).toBe('on');
    });

    it('should keep the child change when the parent re-renders with the same props', () => {
      const ChildSetter = () => {
        const { set } = useFeatureToggle();

        return (
          <button onClick={() => set({ childFeature: true })}>enable</button>
        );
      };

      const App = () => {
        const [, forceRender] = useState(0);
        const [parentValue, setParentValue] = useState(false);

        return (
          // A new (inline) object on every render
          <FeatureToggleProvider
            featureToggleService={{ childFeature: parentValue }}
          >
            <ChildSetter />
            <button onClick={() => forceRender(n => n + 1)}>re-render</button>
            <button onClick={() => setParentValue(true)}>parent on</button>
            <button onClick={() => setParentValue(false)}>parent off</button>
            <HookStatus name="childFeature" />
          </FeatureToggleProvider>
        );
      };

      render(<App />);
      const status = () => screen.getByTestId('hook-childFeature').textContent;

      fireEvent.click(screen.getByText('enable'));
      expect(status()).toBe('on');

      fireEvent.click(screen.getByText('re-render'));
      expect(status()).toBe('on');

      // The parent is still the source of truth when its props change
      fireEvent.click(screen.getByText('parent on'));
      fireEvent.click(screen.getByText('parent off'));
      expect(status()).toBe('off');
    });

    it('should update every consumer when the provider props change', () => {
      const App = () => {
        const [enabled, setEnabled] = useState(false);

        return (
          <FeatureToggleProvider
            featureToggleService={{ propFeature: enabled }}
          >
            <button onClick={() => setEnabled(true)}>enable</button>
            <FeatureToggle featureName="propFeature">
              <p>prop content</p>
            </FeatureToggle>
            <HookStatus name="propFeature" />
          </FeatureToggleProvider>
        );
      };

      render(<App />);
      expect(screen.queryByText('prop content')).toBeNull();

      fireEvent.click(screen.getByText('enable'));
      expect(screen.queryByText('prop content')).not.toBeNull();
      expect(screen.getByTestId('hook-propFeature').textContent).toBe('on');
    });
  });

  describe('server-side rendering', () => {
    it('should not leak toggles between requests', () => {
      const requestA = renderToString(
        <FeatureToggleProvider featureToggleService={{ beta: true }}>
          <FeatureToggle featureName="beta">beta for A</FeatureToggle>
        </FeatureToggleProvider>
      );
      const requestB = renderToString(
        <FeatureToggleProvider featureToggleService={{ other: true }}>
          <FeatureToggle featureName="beta">beta for B</FeatureToggle>
        </FeatureToggleProvider>
      );

      expect(requestA).toBe('beta for A');
      expect(requestB).toBe('');
    });

    it('should not change the global feature-toggle-service state', () => {
      act(() => {
        render(
          <FeatureToggleProvider featureToggleService={{ isolated: true }}>
            <span />
          </FeatureToggleProvider>
        );
      });

      expect(globalIsOn('isolated')).toBe(false);
    });
  });
});
