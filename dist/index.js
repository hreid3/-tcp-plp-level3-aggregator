'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib_1 = require('tslib');
var axios = _interopDefault(require('axios'));
var get = _interopDefault(require('lodash.get'));

function __async(g){return new Promise(function(s,j){function c(a,x){try{var r=g[x?"throw":"next"](a);}catch(e){j(e);return}r.done?s(r.value):Promise.resolve(r.value).then(c,d);}function d(e){c(e,1);}c();})}

var getCategoryCount = function (options, categoryL3) { return __async(function () {
    var count, params, response, ex_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                count = 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                params = tslib_1.__assign({}, options.parameters, { start: 0, rows: 1, fields: 'alt_img', 'p-id': "categoryPathId:\"" + options.categoryPathL2 + ">" + categoryL3 + "\"" });
                return [4 /*yield*/, axios.get(options.unbxdBase + "/category", { headers: options.headers, params: params })];
            case 2:
                response = _a.sent();
                count = get(response, 'data.response.numberOfProducts', 0);
                return [3 /*break*/, 4];
            case 3:
                ex_1 = _a.sent();
                return [2 /*return*/, Promise.reject(ex_1)];
            case 4: return [2 /*return*/, Promise.resolve(count)];
        }
    });
}()); };
var fetchL3Categories = function (options) {
    return new Promise(function (res, rej) { return __async(function () {
        var _a, _b, start, rows, end, rowsCntr, firstResponse, load, calcStart, calcRows, remaining, _i, _c, catId, l3Rows, unbxdResponse, e_1;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 7, , 8]);
                    _b = get(options, "parameters"), start = _b.start, rows = _b.rows;
                    end = start + rows;
                    rowsCntr = 0;
                    firstResponse = null;
                    load = false;
                    calcStart = 0;
                    calcRows = 0;
                    remaining = rows;
                    _i = 0, _c = options.categoryIdsL3;
                    _d.label = 1;
                case 1:
                    if (!(_i < _c.length)) return [3 /*break*/, 6];
                    catId = _c[_i];
                    return [4 /*yield*/, getCategoryCount(options, catId)];
                case 2:
                    l3Rows = _d.sent();
                    if (!(l3Rows + rowsCntr > start)) return [3 /*break*/, 4];
                    calcStart = 0;
                    if (!load) {
                        calcStart = l3Rows - ((l3Rows + rowsCntr) - start);
                        calcRows = l3Rows - calcStart < remaining ? l3Rows - calcStart : remaining;
                        rowsCntr = (l3Rows - calcRows) - calcStart;
                        load = true;
                    }
                    else {
                        calcRows = l3Rows < remaining ? l3Rows : remaining;
                    }
                    return [4 /*yield*/, axios.get(options.unbxdBase + "/category", { headers: options.headers, params: tslib_1.__assign({}, options.parameters, { start: calcStart, rows: calcRows }) })];
                case 3:
                    unbxdResponse = _d.sent();
                    if (!firstResponse) {
                        firstResponse = unbxdResponse;
                    }
                    else {
                        (_a = firstResponse.data.response.products).push.apply(_a, unbxdResponse.data.response.products);
                    }
                    remaining -= calcRows;
                    _d.label = 4;
                case 4:
                    rowsCntr += l3Rows;
                    if (rowsCntr >= end) {
                        return [3 /*break*/, 6];
                    }
                    _d.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    res(firstResponse);
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _d.sent();
                    rej(e_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }()); });
};

exports.default = fetchL3Categories;
exports.fetchL3Categories = fetchL3Categories;
