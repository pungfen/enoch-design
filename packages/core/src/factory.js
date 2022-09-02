"use strict";
exports.__esModule = true;
exports.defineFactory = void 0;
var vue_1 = require("vue");
var converter_1 = require("./converter");
var defineFactory = function (config) {
    var origin = (0, converter_1.block)(config);
    var state = (0, vue_1.reactive)(origin);
    return state;
};
exports.defineFactory = defineFactory;
