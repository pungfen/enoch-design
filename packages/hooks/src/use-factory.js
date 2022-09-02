"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.useFactory = void 0;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var lodash_1 = require("lodash");
var config_1 = require("./config");
var configIndexs = ['ajax', 'initializer', 'ruiles'];
var hookIndexs = ['watch', 'computed', 'onMounted', 'onBeforeRouteUpdate', 'onBeforeRouteLeave', 'onBeforeRouteLeave'];
var indexs = lodash_1["default"].concat(configIndexs, hookIndexs);
var nullFunction = function () { };
var convertAjaxMethodParamsConfig = function (expression) {
    var _this = this;
    var params = {};
    if (lodash_1["default"].isString(expression))
        params = lodash_1["default"].get(this, expression);
    else if (lodash_1["default"].isFunction(expression))
        params = expression.call(this);
    else if (lodash_1["default"].isArray(expression))
        params = lodash_1["default"].reduce(params, function (result, value) { return lodash_1["default"].assign(result, convertAjaxMethodParamsConfig.call(_this, value)); }, {});
    if (lodash_1["default"].isPlainObject(params))
        params = lodash_1["default"].assign(params);
    return params;
};
var convertAjaxConfigProcessor = function (expression, config, data) {
    var _this = this;
    var convert = function (_a) {
        var actionType = _a[0], actionConfig = _a[1];
        if (!lodash_1["default"].isArray(actionConfig))
            actionConfig = [actionConfig];
        var discriminant = actionConfig[0].discriminant;
        if (discriminant)
            data.discriminant = discriminant;
        var method = function (
        //@ts-ignore
        _a) {
            var 
            //@ts-ignore
            _b = _a === void 0 ? {} : _a, addition = _b.addition, _c = _b.delay, delay = _c === void 0 ? true : _c, _d = _b.silent, silent = _d === void 0 ? false : _d, _e = _b.invokedByPagination, invokedByPagination = _e === void 0 ? false : _e, _f = _b.invokedByScroll, invokedByScroll = _f === void 0 ? false : _f, _g = _b.resetParams, resetParams = _g === void 0 ? false : _g;
            return __awaiter(this, void 0, void 0, function () {
                var model, modelRef, valid, config, params, action, convert, _h, httpVerb, path, rawParamsisFunction, lastParam, lastParam, method, _j, target, url, arc, cbs;
                var _this = this;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            if (delay) {
                                setTimeout(function () {
                                    return Promise.resolve(null);
                                }, 0);
                            }
                            model = lodash_1["default"].get(this, lodash_1["default"].trimStart(expression, '.'));
                            modelRef = model.ref;
                            if (!lodash_1["default"].eq(actionType, 'submit')) return [3 /*break*/, 2];
                            return [4 /*yield*/, (modelRef === null || modelRef === void 0 ? void 0 : modelRef.validate())];
                        case 1:
                            valid = (_k.sent()) || true;
                            if (!valid)
                                return [2 /*return*/, Promise.reject(valid)];
                            _k.label = 2;
                        case 2:
                            config = lodash_1["default"].isArray(actionConfig)
                                ? (lodash_1["default"].eq(actionType, 'submit')
                                    ? model.data.id
                                        ? lodash_1["default"].find(actionConfig, function (config) { return lodash_1["default"].startsWith(config.action, 'PUT'); })
                                        : lodash_1["default"].find(actionConfig, function (config) { return lodash_1["default"].startsWith(config.action, 'POST'); })
                                    : lodash_1["default"].find(actionConfig, function (config) { return lodash_1["default"].eq(config.discriminant, model.discriminant); })) || actionConfig[0]
                                : actionConfig;
                            params = config.params, action = config.action, convert = config.convert;
                            _h = lodash_1["default"].split(action, ' '), httpVerb = _h[0], path = _h[1];
                            rawParamsisFunction = lodash_1["default"].isFunction(params);
                            if (!lodash_1["default"].isArray(params))
                                params = [params];
                            params = lodash_1["default"].map(params, function (param) { return convertAjaxMethodParamsConfig.call(_this, param); });
                            if (lodash_1["default"].isArray(params[0]) && rawParamsisFunction)
                                params = params[0];
                            if (lodash_1["default"].isPlainObject(addition)) {
                                lastParam = params.pop();
                                if (lodash_1["default"].isPlainObject(lastParam)) {
                                    params.push(invokedByPagination ? lodash_1["default"].assign({}, lastParam, addition) : lodash_1["default"].assign(lastParam, addition));
                                }
                                else {
                                    if (lastParam)
                                        params.push(lastParam);
                                    params.push(addition);
                                }
                            }
                            model.$_params = params;
                            if (resetParams)
                                return [2 /*return*/];
                            if (convert && lodash_1["default"].isFunction(convert.server)) {
                                lastParam = params.pop();
                                params.push(convert.server.call(this, lastParam) || lastParam);
                            }
                            method = httpVerb.toLowerCase();
                            _j = path.split('/'), target = _j[1];
                            url = ['enospray', 'enoquote'].includes(target) ? '' : '/enocloud';
                            path.split('/').forEach(function (str) { return str && (url += "/".concat(lodash_1["default"].startsWith(str, ':') ? lodash_1["default"].head(params) && lodash_1["default"].pullAt(params, 0) : str)); });
                            params = params[0];
                            arc = { method: method, url: url };
                            switch (method) {
                                case 'put':
                                case 'post':
                                    arc.data = { data: lodash_1["default"].concat(params) };
                                    break;
                                case 'get':
                                case 'delete':
                                    arc.params = params;
                                    break;
                            }
                            !silent && (model.loading = true);
                            cbs = [
                                function (res) {
                                    !silent && (model.loading = false);
                                    return Promise.resolve(res);
                                },
                                function (err) {
                                    !silent && (model.loading = false);
                                    return Promise.reject(err);
                                }
                            ];
                            if (lodash_1["default"].eq(actionType, 'get')) {
                                cbs[0] = function (res) {
                                    var _a, _b;
                                    model.loading = false;
                                    var paging = res.meta.paging;
                                    var data = lodash_1["default"].isArray(model.data) ? (invokedByScroll ? lodash_1["default"].concat(res.data, model.data) : res.data) : res.data[0];
                                    model.data = ((_a = convert === null || convert === void 0 ? void 0 : convert.client) === null || _a === void 0 ? void 0 : _a.call(_this, data, res)) || data;
                                    if (paging)
                                        model.paging = paging;
                                    (_b = modelRef === null || modelRef === void 0 ? void 0 : modelRef.clearValidate) === null || _b === void 0 ? void 0 : _b.call(modelRef);
                                    return Promise.resolve(res);
                                };
                            }
                            return [2 /*return*/, function () { }];
                    }
                });
            });
        };
        data[actionType] = method.bind(_this);
    };
    lodash_1["default"].forEach(lodash_1["default"].entries(config), convert);
};
var convertInitializerConfigProcessor = function (expression, config, data) {
    var _this = this;
    data.data = config();
    data.initializer = config;
    data.init = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data.data = config();
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 1:
                    _b.sent();
                    lodash_1["default"].eq(lodash_1["default"].get(data, 'type'), 'form') && ((_a = lodash_1["default"].get(data, 'ref')) === null || _a === void 0 ? void 0 : _a.clearValidate);
                    return [2 /*return*/];
            }
        });
    }); };
};
var convertHookConfigProcessor = function (expression, config, hookName) {
    var _this = this;
    if (hookName === 'onMounted' ||
        hookName === 'onUnmounted' ||
        hookName === 'onBeforeUpdate' ||
        hookName === 'onBeforeRouteUpdate' ||
        hookName === 'onBeforeRouteLeave') {
        if (lodash_1["default"].isFunction(config)) {
            this.$hooks[hookName][lodash_1["default"].trimStart(expression, '.')] = lodash_1["default"].bind(config, this);
        }
    }
    else {
        lodash_1["default"].forEach(lodash_1["default"].entries(config), function (_a) {
            var subKey = _a[0], subConfig = _a[1];
            var source = expression;
            var key = lodash_1["default"].trimStart("".concat(expression, ".").concat(subKey), '.');
            var cb;
            switch (hookName) {
                case 'watch':
                    cb = lodash_1["default"].bind(lodash_1["default"].isPlainObject(subConfig) ? lodash_1["default"].get(subConfig, 'handler', nullFunction) : lodash_1["default"].isFunction(subConfig) ? subConfig : nullFunction, _this);
                    break;
                case 'computed':
                    cb = lodash_1["default"].isPlainObject(subConfig)
                        ? {
                            get: lodash_1["default"].bind(lodash_1["default"].get(subConfig, 'get', nullFunction), _this),
                            set: lodash_1["default"].bind(lodash_1["default"].get(subConfig, 'set', nullFunction), _this)
                        }
                        : lodash_1["default"].isFunction(subConfig)
                            ? lodash_1["default"].bind(subConfig, _this)
                            : nullFunction;
                    break;
            }
            var options = lodash_1["default"].isPlainObject(subConfig) ? lodash_1["default"].pick(subConfig, ['immediate', 'deep']) : {};
            _this.$hooks[hookName][key] = lodash_1["default"].get(_this.$hooks[hookName], key)
                ? lodash_1["default"].concat((0, vue_1.toRaw)(lodash_1["default"].get(_this.$hooks[hookName], key)), [{ source: source, cb: cb, options: options }])
                : { source: source, cb: cb, options: options };
        });
    }
};
var convertConfig = function (expression, config, data) {
    var _this = this;
    var convert = function (_a) {
        var subKey = _a[0], subConfig = _a[1];
        if (lodash_1["default"].includes(indexs, subKey)) {
            switch (subKey) {
                case 'ajax':
                    convertAjaxConfigProcessor.call(_this, expression, subConfig, data);
                    break;
                case 'initializer':
                    convertInitializerConfigProcessor.call(_this, expression, subConfig, data);
                    break;
                case 'rules':
                    data.rules = subConfig;
                    break;
                case 'watch':
                case 'computed':
                case 'onMounted':
                case 'onBeforeRouteUpdate':
                case 'onBeforeRouteLeave':
                    convertHookConfigProcessor.call(_this, expression, subConfig, subKey);
                    break;
            }
        }
        else {
            var key = lodash_1["default"].trimStart("".concat(expression, ".").concat(subKey), '.');
            if (subConfig) {
                if ((0, vue_1.isRef)(subConfig)) {
                    if (lodash_1["default"].get(subConfig, '__v_isRef') && lodash_1["default"].has(subConfig, '__v_isReadonly')) {
                        if (!lodash_1["default"].has(subConfig.effect.fn, 'prototype')) {
                            console.error("you can't define arrow function in factory config when value is ComputedRef");
                        }
                        var cb = {
                            get: lodash_1["default"].bind(subConfig.effect.fn, _this),
                            set: lodash_1["default"].bind(subConfig._setter, _this)
                        };
                        return lodash_1["default"].set(_this.$hooks.computed, key, lodash_1["default"].get(_this.$hooks.computed, key)
                            ? lodash_1["default"].concat((0, vue_1.toRaw)(lodash_1["default"].get(_this.$hooks.computed, key)), [{ source: expression, cb: cb, options: {} }])
                            : { source: expression, cb: cb, options: {} });
                    }
                    return lodash_1["default"].set(data, subKey, subConfig);
                }
                if ((0, vue_1.isReadonly)(subConfig)) {
                    var recursion_1 = function (config, expression, target) {
                        var _this = this;
                        lodash_1["default"].forEach(lodash_1["default"].entries(config), function (_a) {
                            var subKey = _a[0], subConfig = _a[1];
                            lodash_1["default"].set(target, lodash_1["default"].trimStart("".concat(expression, ".").concat(subKey), '.'), {});
                            if (!lodash_1["default"].isPlainObject(subConfig)) {
                                if (lodash_1["default"].isFunction(subConfig)) {
                                    return lodash_1["default"].set(target, lodash_1["default"].trimStart("".concat(expression, ".").concat(subKey), '.'), lodash_1["default"].bind(subConfig, _this));
                                }
                                return lodash_1["default"].set(target, lodash_1["default"].trimStart("".concat(expression, ".").concat(subKey), '.'), subConfig);
                            }
                            recursion_1.call(_this, subConfig, lodash_1["default"].trimStart("".concat(expression, ".").concat(subKey), '.'), target);
                        });
                        return target;
                    };
                    return (data[subKey] = lodash_1["default"].isPlainObject(subConfig) ? recursion_1.call(_this, subConfig, '', {}) : subConfig);
                }
                var subData_1 = (data[subKey] = data[subKey] || (0, vue_1.reactive)({}));
                switch (subConfig.type) {
                    case 'table':
                        subData_1.data = [];
                        subData_1.paging = {
                            itemCount: 0,
                            pageCount: 0,
                            pageIndex: 1,
                            pageSize: 20
                        };
                        subData_1.loading = false;
                        subData_1.currentRow = null;
                        subData_1.currentChange = function (currentRow) { return (subData_1.currentRow = currentRow); };
                        subData_1.ref = null;
                        subData_1.setRef = function (el) { return (subData_1.ref = el); };
                        break;
                    case 'tree':
                        subData_1.data = [];
                        subData_1.loading = false;
                        subData_1.currentRow = null;
                        subData_1.currentChange = function (currentRow) { return (subData_1.currentRow = currentRow); };
                        subData_1.ref = null;
                        subData_1.setRef = function (el) { return (subData_1.ref = el); };
                        break;
                    case 'form':
                        subData_1.data = {};
                        subData_1.ref = null;
                        subData_1.setRef = function (el) { return (subData_1.ref = el); };
                        break;
                    case 'drawer':
                    case 'dialog':
                        subData_1.visible = false;
                        subData_1.open = function () { return (subData_1.visible = true); };
                        subData_1.close = function () { return (subData_1.visible = false); };
                        break;
                    default:
                        if (!lodash_1["default"].isPlainObject(subConfig)) {
                            if (lodash_1["default"].isFunction(subConfig)) {
                                return lodash_1["default"].set(data, subKey, lodash_1["default"].bind(subConfig, _this));
                            }
                            return lodash_1["default"].set(data, subKey, subConfig);
                        }
                }
                convertConfig.call(_this, "".concat(expression, ".").concat(subKey), subConfig, subData_1);
            }
            else {
                return (data[subKey] = null);
            }
        }
    };
    lodash_1["default"].forEach(lodash_1["default"].entries(config), convert);
};
var makeHookEffective = function (config) {
    var _this = this;
    lodash_1["default"].forEach(lodash_1["default"].entries(config), function (_a) {
        var hookName = _a[0], hookConfig = _a[1];
        lodash_1["default"].entries(hookConfig).forEach(function (_a) {
            var subKey = _a[0], subConfig = _a[1];
            if (!lodash_1["default"].isArray(subConfig))
                subConfig = [subConfig];
            lodash_1["default"].forEach(subConfig, function (hookSubConfig) {
                if (hookName === 'watch') {
                    (0, vue_1.watch)(function () { return lodash_1["default"].get(_this, subKey); }, lodash_1["default"].isFunction(hookSubConfig.cb) ? hookSubConfig.cb : nullFunction, hookSubConfig.options);
                }
                else if (hookName === 'computed') {
                    lodash_1["default"].set(_this, subKey, (0, vue_1.computed)(hookSubConfig.cb));
                }
                else if (hookName === 'onMounted')
                    (0, vue_1.onMounted)(hookSubConfig);
                else if (hookName === 'onBeforeUpdate')
                    (0, vue_1.onBeforeUpdate)(hookSubConfig);
                else if (hookName === 'onUnmounted')
                    (0, vue_1.onUnmounted)(hookSubConfig);
                else if (hookName === 'onBeforeRouteUpdate')
                    (0, vue_router_1.onBeforeRouteUpdate)(hookSubConfig);
                else if (hookName === 'onBeforeRouteLeave')
                    (0, vue_router_1.onBeforeRouteLeave)(hookSubConfig);
            });
        });
    });
};
var useFactory = function (config) {
    var factoryConfig = (0, vue_1.inject)(config_1.FactoryConfigInjectionKey);
    var vm = (0, vue_1.getCurrentInstance)();
    var slots = (0, vue_1.useSlots)();
    var route = (0, vue_router_1.useRoute)();
    var router = (0, vue_router_1.useRouter)();
    var state = (0, vue_1.reactive)(config);
    convertConfig.call(state, '', config, state);
    lodash_1["default"].assign(state, {
        route: route,
        router: router,
        store: factoryConfig === null || factoryConfig === void 0 ? void 0 : factoryConfig.store,
        $emit: vm === null || vm === void 0 ? void 0 : vm.emit,
        $slots: slots,
        setRef: function (expression) { return function (el) {
            el && lodash_1["default"].set(state, expression, el);
        }; },
        $hooks: hookIndexs.reduce(function (acc, key) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[key] = {}, _a)));
        }, {})
    });
    makeHookEffective.call(state, state.$hooks);
    return state;
};
exports.useFactory = useFactory;
