import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { set, isOn, FeatureToggleServiceConfig } from 'feature-toggle-service';

export interface ReactorFeatureToggleProviderProps {
  children: ReactNode;
  featureToggleService: FeatureToggleServiceConfig;
}
interface FeatureToggleContextType {
  isOn: (featureName: string) => boolean;
  toggles: FeatureToggleServiceConfig | null;
}

const FeatureToggleContext = createContext<FeatureToggleContextType>({
  isOn,
  toggles: null,
});

export const FeatureToggleProvider = ({
  children,
  featureToggleService,
}: ReactorFeatureToggleProviderProps): JSX.Element => {
  useMemo(() => {
    set(featureToggleService);
  }, [featureToggleService]);
  const value = useMemo(
    () => ({
      isOn,
      toggles: featureToggleService,
    }),
    [featureToggleService]
  );

  return (
    <FeatureToggleContext.Provider value={value}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

export function useFeatureToggle(): FeatureToggleContextType {
  const context = useContext(FeatureToggleContext);
  if (!context) {
    throw new Error(
      'useFeatureToggle must be used within FeatureToggleClientProvider'
    );
  }

  return context;
}
