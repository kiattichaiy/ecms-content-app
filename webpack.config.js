const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer"),
      "events": require.resolve("events"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util")
    },
    alias: {
      'event-emitter': path.resolve(__dirname, 'node_modules/event-emitter')
    }
  },
  plugins: [
    new (require('webpack').ProvidePlugin)({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  ]
};
