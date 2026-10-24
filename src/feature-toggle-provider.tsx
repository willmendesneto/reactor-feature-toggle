import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
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
  'reactor-feature-toggle: only one `FeatureToggleProvider` is allowed per application. ' +
  'Render a single provider at the root of your application. ' +
  'See https://github.com/willmendesneto/reactor-feature-toggle#single-provider';

const throwMultipleProvidersError = (): never => {
  console.error(MULTIPLE_PROVIDERS_ERROR);
  throw new Error(MULTIPLE_PROVIDERS_ERROR);
};

// Layout effects don't run on the server, and React warns about them there
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Providers mounted in the browser. Effects don't run on the server, so
// concurrent server requests never touch this counter.
let mountedProviders = 0;

/**
 * Provides the feature toggles to `FeatureToggle` and `useFeatureToggle()`.
 * Only one provider is allowed per application.
 */
export const FeatureToggleProvider = ({
  children,
  featureToggleService,
}: ReactorFeatureToggleProviderProps): ReactElement => {
  // Nested providers are detected during render, so it also works on the server
  if (useContext(FeatureToggleContext)) {
    throwMultipleProvidersError();
  }

  const [service] = useState(() =>
    createFeatureToggleService(featureToggleService)
  );

  // Sibling providers can only be detected once they are mounted
  useEffect(() => {
    if (mountedProviders > 0) {
      throwMultipleProvidersError();
    }
    mountedProviders += 1;

    return () => {
      mountedProviders -= 1;
    };
  }, []);

  // Applies only the props that changed, so a new props object with the same
  // values (e.g. an inline object) doesn't discard changes made via `set()`
  const appliedProps = useRef(featureToggleService);
  useIsomorphicLayoutEffect(() => {
    const previousProps = appliedProps.current;
    appliedProps.current = featureToggleService;

    const changedProps = Object.fromEntries(
      Object.entries(featureToggleService).filter(
        ([key, value]) => previousProps[key] !== value
      )
    );
    service.set(changedProps);
  }, [service, featureToggleService]);

  return (
    <FeatureToggleContext.Provider value={service}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

const useFeatureToggleService = (caller: string): FeatureToggleService => {
  const service = useContext(FeatureToggleContext);
  if (!service) {
    throw new Error(`${caller} must be used within FeatureToggleProvider`);
  }

  return service;
};

const useToggles = (
  service: FeatureToggleService
): FeatureToggleServiceConfig =>
  useSyncExternalStore(service.subscribe, service.getAll, service.getAll);

export function useFeatureToggle(): FeatureToggleContextType {
  const service = useFeatureToggleService('useFeatureToggle');
  const toggles = useToggles(service);

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
 * Renders `children` when the feature toggle(s) are on in the closest
 * `FeatureToggleProvider`, and `fallback` otherwise.
 */
export const FeatureToggle = ({
  children,
  featureName,
  fallback = null,
}: FeatureToggleProps): ReactElement => {
  const service = useFeatureToggleService('FeatureToggle');
  // Re-renders when the toggles change
  useToggles(service);

  return <>{isOnCheck(service.isOn, featureName) ? children : fallback}</>;
};
