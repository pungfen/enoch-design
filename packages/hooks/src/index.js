"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.FactoryConfigProvider = void 0;
var lodash_1 = require("lodash");
var config_provider_vue_1 = require("./config-provider.vue");
exports.FactoryConfigProvider = (0, lodash_1.assign)(config_provider_vue_1["default"], {
    install: function (app) { return app.component(config_provider_vue_1["default"].name, config_provider_vue_1["default"]); }
});
__exportStar(require("./config"), exports);
__exportStar(require("./use-factory"), exports);
