import { composePlugins, withNx, withReact } from '@nx/rspack';
import { withModuleFederation } from '@nx/rspack/module-federation';
import { DefinePlugin } from '@rspack/core';

import baseConfig from './module-federation.config';

const config = {
  ...baseConfig,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['postcss-loader'],
        type: 'css',
      },
    ],
  },
};

export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config, { dts: false }),
  (config: any) => {
    config.plugins = config.plugins ?? [];
    config.plugins.push(
      new DefinePlugin({
        'process.env.REACT_APP_GOOGLE_MAP_API_KEY': JSON.stringify(
          process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        ),
      }),
    );
    return config;
  },
);

