"use strict";
exports.__esModule = true;
var path_1 = require("path");
var vite_1 = require("vite");
var plugin_vue_1 = require("@vitejs/plugin-vue");
var vite_plugin_pages_1 = require("vite-plugin-pages");
var vite_plugin_vue_layouts_1 = require("vite-plugin-vue-layouts");
var vite_2 = require("unplugin-vue-components/vite");
function kebabCase(key) {
    var result = key.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('-').toLowerCase();
}
exports["default"] = (0, vite_1.defineConfig)({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: "@use \"".concat((0, path_1.resolve)('./src/styles/element-variables.scss'), "\" as *;")
            }
        }
    },
    plugins: [
        (0, plugin_vue_1["default"])(),
        (0, vite_plugin_pages_1["default"])({
            dirs: ['src/pages']
        }),
        (0, vite_plugin_vue_layouts_1["default"])({
            defaultLayout: 'index'
        }),
        (0, vite_2["default"])({
            dts: './components.d.ts',
            resolvers: [
                function (componentName) {
                    if (componentName.startsWith('En')) {
                        var name_1 = componentName.slice(2);
                        var esComponentsFolder = 'element-plus/es/components';
                        return {
                            name: componentName,
                            from: '@enoch/components',
                            sideEffects: ["".concat(esComponentsFolder, "/").concat(kebabCase(name_1), "/style/index")]
                        };
                    }
                }
            ]
        })
    ]
});
