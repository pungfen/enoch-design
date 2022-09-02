"use strict";
exports.__esModule = true;
exports.EnButton = void 0;
var button_1 = require("./button");
exports.EnButton = button_1.EnButton;
var components = [button_1.EnButton];
var install = function (app) {
    components.forEach(function (component) {
        app.component(component.name, component);
    });
};
exports["default"] = { install: install };
