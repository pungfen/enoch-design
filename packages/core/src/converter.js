"use strict";
exports.__esModule = true;
exports.block = exports.ajax = void 0;
var ajax = function (config) {
    var origin = {};
    if (config.ajax) {
        Object.entries(config.ajax).forEach(function (_a) {
            var methodName = _a[0], ajaxConfig = _a[1];
            var _b = ajaxConfig.action.split(' '), httpMethod = _b[0], path = _b[1];
        });
    }
    return origin;
};
exports.ajax = ajax;
var block = function (config) {
    var origin = {};
    Object.assign(config, (0, exports.ajax)(config));
    return origin;
};
exports.block = block;
