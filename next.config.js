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
    };
    config.resolve.fallback = {
      fs: false,
      http2: false,
      events: false,
      stream: false,
      util: false,
    };
    return config;
  },
};
