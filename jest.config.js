module.exports = {
  globalSetup: "<rootDir>/test/jest.setup.global.ts",
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.each.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "test/tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/test/**/*.test.(ts|js)"
  ],
  testEnvironment: "node",
  moduleNameMapper: {
    "^@models/(.+)": "<rootDir>/src/models/$1",
    "^@src/(.+)": "<rootDir>/src/$1",
    "^@util/(.+)": "<rootDir>/src/util/$1",
    "^@config/(.+)": "<rootDir>/src/config/$1",
    "^@test/(.+)": "<rootDir>/test/$1"
  },
};
