"use strict";
exports.__esModule = true;
var vite_1 = require("vite");
var plugin_vue_1 = require("@vitejs/plugin-vue");
exports["default"] = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_vue_1["default"])()],
    test: {
        globals: true,
        environment: 'jsdom'
    }
});
