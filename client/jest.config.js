module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Transform JS and JSX files using babel-jest
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)", // Allow axios to be transformed, which helps with ES modules
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Mock CSS imports
    "\\.(gif|ttf|eot|svg|jpg|jpeg|png)$": "jest-transform-stub", // Mock image imports
  },
  testEnvironment: "jsdom", // Use jsdom for testing React components
};
