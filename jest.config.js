const config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["node_modules"],
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Mock CSS imports
    },
};
export default config;
