import { render, screen } from '@testing-library/react';
import {
  FeatureToggle,
  FeatureToggleProvider,
} from '../../feature-toggle-provider';
import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

describe('<FeatureToggle />', () => {
  const aChildComponent = <div>Yay I am a child</div>;

  const featureNames = {
    thisOneIsEnabled: 'thisOneIsEnabled',
    thisOneIsDisabled: 'thisOneIsDisabled',
    thisIsAnotherOneEnabled: 'thisIsAnotherOneEnabled',
    thisIsAnotherOneDisabled: 'thisIsAnotherOneDisabled',
  };

  const toggles = {
    [featureNames.thisOneIsEnabled]: true,
    [featureNames.thisOneIsDisabled]: false,
    [featureNames.thisIsAnotherOneEnabled]: true,
    [featureNames.thisIsAnotherOneDisabled]: false,
  };

  const withProvider = (ui: ReactElement) => (
    <FeatureToggleProvider featureToggleService={toggles}>
      {ui}
    </FeatureToggleProvider>
  );

  describe('When the given toggle is enabled', () => {
    describe('When receives a string as `featureName` props', () => {
      it('should render children', () => {
        render(
          withProvider(
            <FeatureToggle featureName={featureNames.thisOneIsEnabled}>
              {aChildComponent}
            </FeatureToggle>
          )
        );
        expect(screen.getByText('Yay I am a child')).toBeInTheDocument();
      });
    });

    describe('When receives an array as `featureName` props', () => {
      it('should render children', () => {
        render(
          withProvider(
            <FeatureToggle
              featureName={[
                featureNames.thisOneIsEnabled,
                featureNames.thisIsAnotherOneEnabled,
              ]}
            >
              {aChildComponent}
            </FeatureToggle>
          )
        );
        expect(screen.getByText('Yay I am a child')).toBeInTheDocument();
      });
    });
  });

  describe('When the given toggle is disabled', () => {
    describe('When receives a string as `featureName` props', () => {
      it('should not render children is toggle with name is not enabled', () => {
        render(
          withProvider(
            <FeatureToggle featureName={featureNames.thisOneIsDisabled}>
              {aChildComponent}
            </FeatureToggle>
          )
        );
        expect(screen.queryByText('Yay I am a child')).not.toBeInTheDocument();
      });
    });

    describe('When receives an array as `featureName` props', () => {
      it('should not render children is toggle with name is not enabled', () => {
        render(
          withProvider(
            <FeatureToggle
              featureName={[
                featureNames.thisOneIsDisabled,
                featureNames.thisIsAnotherOneDisabled,
              ]}
            >
              {aChildComponent}
            </FeatureToggle>
          )
        );
        expect(screen.queryByText('Yay I am a child')).not.toBeInTheDocument();
      });
    });
  });

  describe('When receives an array as `featureName` props and one feature is off', () => {
    it('should not render children', () => {
      render(
        withProvider(
          <FeatureToggle
            featureName={[
              featureNames.thisOneIsEnabled,
              featureNames.thisIsAnotherOneDisabled,
            ]}
          >
            {aChildComponent}
          </FeatureToggle>
        )
      );
      expect(screen.queryByText('Yay I am a child')).not.toBeInTheDocument();
    });
  });

  describe('When the given toggle is negated and on', () => {
    it('should not render children', () => {
      render(
        withProvider(
          <FeatureToggle featureName={`!${featureNames.thisOneIsEnabled}`}>
            {aChildComponent}
          </FeatureToggle>
        )
      );
      expect(screen.queryByText('Yay I am a child')).not.toBeInTheDocument();
    });
  });

  describe('When the given toggle is negated and off', () => {
    it('should render children', () => {
      render(
        withProvider(
          <FeatureToggle featureName={`!${featureNames.thisOneIsDisabled}`}>
            {aChildComponent}
          </FeatureToggle>
        )
      );
      expect(screen.getByText('Yay I am a child')).toBeInTheDocument();
    });
  });

  describe('When `fallback` is set', () => {
    it('should render the fallback if the toggle is off', () => {
      render(
        withProvider(
          <FeatureToggle
            featureName={featureNames.thisOneIsDisabled}
            fallback={<p>Fallback content</p>}
          >
            {aChildComponent}
          </FeatureToggle>
        )
      );
      expect(screen.getByText('Fallback content')).toBeInTheDocument();
      expect(screen.queryByText('Yay I am a child')).not.toBeInTheDocument();
    });

    it('should not render the fallback if the toggle is on', () => {
      render(
        withProvider(
          <FeatureToggle
            featureName={featureNames.thisOneIsEnabled}
            fallback={<p>Fallback content</p>}
          >
            {aChildComponent}
          </FeatureToggle>
        )
      );
      expect(screen.queryByText('Fallback content')).not.toBeInTheDocument();
      expect(screen.getByText('Yay I am a child')).toBeInTheDocument();
    });
  });

  describe('When `fallback` is set without children', () => {
    it('should render the fallback if any toggle is off', () => {
      render(
        withProvider(
          <FeatureToggle
            featureName={[
              featureNames.thisOneIsEnabled,
              featureNames.thisOneIsDisabled,
            ]}
            fallback={<p>Fallback content</p>}
          />
        )
      );
      expect(screen.getByText('Fallback content')).toBeInTheDocument();
    });

    it('should render nothing if all toggles are on', () => {
      const { container } = render(
        withProvider(
          <FeatureToggle
            featureName={[
              featureNames.thisOneIsEnabled,
              featureNames.thisIsAnotherOneEnabled,
            ]}
            fallback={<p>Fallback content</p>}
          />
        )
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('When rendered on the server', () => {
    it('should render children inside the provider', () => {
      const html = renderToString(
        withProvider(
          <FeatureToggle featureName={featureNames.thisOneIsEnabled}>
            {aChildComponent}
          </FeatureToggle>
        )
      );
      expect(html).toBe('<div>Yay I am a child</div>');
    });
  });
});
