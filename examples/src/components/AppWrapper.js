import React from 'react';
import { FeatureToggleProvider, FeatureToggle } from 'reactor-feature-toggle';

const AppWrapper = () => {
  const featureToggleData = {
    enableMainContent: true,
    enableSecondContent: false,
  };

  return (
    <main>
      <section>
        <h3>Why Feature toggle?</h3>
        <p cite="">
          This is a common concept, but why use this directive instead solve it via server-side rendering?
        </p>
        <p>The idea of this directive is make this process transparent and easier. So the main point is integrate this directive with other tooling process, such as:</p>
        <ul>
          <li>Server-side rendering;</li>
          <li>Progressive rendering;</li>
          <li>Any other that yoy like :)</li>
        </ul>
        <p>You can integrate with WebSockets or handling this in a EventSourcing architecture. It's totally transparent for you and you can integrate easier in your application</p>
      </section>
      <section>
        <h3>Instalation and usage</h3>
        <p>You can get it on NPM installing ngx-feature-toggle module as a project dependency.</p>
          <pre>
            <code>
              $ npm install --save ngx-feature-toggle
            </code>
          </pre>
      </section>
      <section>
        <h3>Code example</h3>
        <FeatureToggleProvider featureToggleService={featureToggleData} >
          <FeatureToggle featureName={'enableMainContent'} >
            <div className="content">
              <p>This content is enabled</p>
              <FeatureToggle featureName={'enableSecondContent'} >
                <p>This content is disabled</p>
              </FeatureToggle>
              <FeatureToggle featureName={'enableSecondContent'} showWhenDisabled>
                <p>This content is disabled, but should be displayed since it has `showWhenDisabled` property</p>
              </FeatureToggle>
            </div>
          </FeatureToggle>
        </FeatureToggleProvider>
      </section>
    </main>
  );
};

export default AppWrapper;
