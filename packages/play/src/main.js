"use strict";
exports.__esModule = true;
exports.router = void 0;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var virtual_generated_layouts_1 = require("virtual:generated-layouts");
var app_vue_1 = require("./app.vue");
var _pages_1 = require("~pages");
exports.router = (0, vue_router_1.createRouter)({
    routes: (0, virtual_generated_layouts_1.setupLayouts)(_pages_1["default"]),
    history: (0, vue_router_1.createWebHashHistory)()
});
(0, vue_1.createApp)(app_vue_1["default"]).use(exports.router).mount('#app');
