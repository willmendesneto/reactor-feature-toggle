import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  ReactElement,
  ReactNode,
} from 'react';
import {
  createFeatureToggleService,
  FeatureToggleService,
  FeatureToggleServiceConfig,
} from 'feature-toggle-service';
import { FeatureName, isOnCheck } from './is-on-check';

export interface ReactorFeatureToggleProviderProps {
  children: ReactNode;
  featureToggleService: FeatureToggleServiceConfig;
}

interface FeatureToggleContextType {
  isOn: (featureName: FeatureName) => boolean;
  set: (toggles: FeatureToggleServiceConfig) => void;
  toggles: FeatureToggleServiceConfig;
}

const FeatureToggleContext = createContext<FeatureToggleService | null>(null);

export const MULTIPLE_PROVIDERS_ERROR =
  'Only one FeatureToggleProvider is allowed per application';

// Providers mounted in the browser. Effects don't run on the server, so
// concurrent server requests never touch it.
let mountedProviders = 0;

/**
 * Provides the feature toggles to `FeatureToggle` and `useFeatureToggle()`.
 * Only one provider is allowed per application.
 */
export const FeatureToggleProvider = ({
  children,
  featureToggleService,
}: ReactorFeatureToggleProviderProps): ReactElement => {
  const [service] = useState(() =>
    createFeatureToggleService(featureToggleService)
  );

  // Nested or simultaneous providers are detected once they are mounted
  useEffect(() => {
    if (mountedProviders) {
      console.error(MULTIPLE_PROVIDERS_ERROR);
      throw new Error(MULTIPLE_PROVIDERS_ERROR);
    }
    mountedProviders++;

    return () => {
      mountedProviders--;
    };
  }, []);

  // Compared by value, so an inline props object with the same values doesn't
  // discard changes made via `set()`
  const props = JSON.stringify(featureToggleService);
  useEffect(() => {
    service.set(featureToggleService);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, props]);

  return (
    <FeatureToggleContext.Provider value={service}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

export function useFeatureToggle(): FeatureToggleContextType {
  const service = useContext(FeatureToggleContext);
  if (!service) {
    throw new Error(
      'useFeatureToggle must be used within FeatureToggleProvider'
    );
  }
  const toggles = useSyncExternalStore(
    service.subscribe,
    service.getAll,
    service.getAll
  );

  return useMemo(
    () => ({
      isOn: (featureName: FeatureName) => isOnCheck(service.isOn, featureName),
      set: service.set,
      toggles,
    }),
    [service, toggles]
  );
}

export interface FeatureToggleProps {
  children?: ReactNode;
  featureName: FeatureName;
  /** Rendered instead of `children` when the check fails */
  fallback?: ReactNode;
}

/**
 * Renders `children` when the feature toggle(s) are on, and `fallback` otherwise.
 * It must be rendered inside `FeatureToggleProvider`.
 */
export const FeatureToggle = ({
  children,
  featureName,
  fallback = null,
}: FeatureToggleProps): ReactElement => (
  <>{useFeatureToggle().isOn(featureName) ? children : fallback}</>
);
