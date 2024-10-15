module.exports = {
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
    config.module.rules.push({
      test: /node:.+/,
      type: 'javascript/auto',
      loader: 'file-loader',
    });
    return config;
  },
};
