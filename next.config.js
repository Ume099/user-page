// next.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  extends: 'next/core-web-vitals',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        port: '',
      },
    ],
  },
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      outputModule: true,
      layers: true,
    };

    config.resolve.fallback = {
      fs: false,
      http2: false,
      events: false,
      stream: false,
      net: false,
      tls: false,
      child_process: false,
      util: false,
    };

    // Terserの設定を追加
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [
        `...`, // 既存のminimizerを残す
        new TerserPlugin({
          terserOptions: {
            ecma: 2020,
            module: true,
          },
        }),
      ],
    };

    config.module.rules.push({
      test: /node:.*$/,
      type: 'javascript/auto',
      loader: 'raw-loader',
    });

    return config;
  },
};
