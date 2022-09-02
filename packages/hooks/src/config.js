"use strict";
exports.__esModule = true;
exports.getDefaultConfig = exports.FactoryConfigInjectionKey = void 0;
exports.FactoryConfigInjectionKey = Symbol('FactoryConfigProvider');
var getDefaultConfig = function () {
    return {
        hooks: ['onMounted', 'onUnmounted'],
        store: {
            state: function () {
                return {};
            }
        }
    };
};
exports.getDefaultConfig = getDefaultConfig;
