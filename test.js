"use strict";
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
var pg_1 = require("pg");
function connectAndSetupDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var pool, client, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pool = new pg_1.Pool({
                        user: 'postgres',
                        host: '192.168.1.245',
                        database: 'civic-voice-db',
                        password: 'postgres',
                        port: 5432
                    });
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 6, 7]);
                    return [4 /*yield*/, client.query("DROP TABLE IF EXISTS users")];
                case 3:
                    _a.sent();
                    // Create a new user table
                    // await client.query(`
                    //   CREATE ROLE automations WITH LOGIN PASSWORD 'automate';
                    // `);
                    return [4 /*yield*/, client.query("\n      GRANT SELECT, INSERT, UPDATE, DELETE ON users2 TO automations;\n    ")];
                case 4:
                    // Create a new user table
                    // await client.query(`
                    //   CREATE ROLE automations WITH LOGIN PASSWORD 'automate';
                    // `);
                    _a.sent();
                    console.log('Database setup successful!');
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error setting up the database:', error_1);
                    return [3 /*break*/, 7];
                case 6:
                    // Release the client back to the pool
                    client.release();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
connectAndSetupDatabase();
// Setup Login/Group Role for automated actions
// Change to this user
// Setup Tables for info 
// Query online source, download file
// If file is indentical to one already stored, exit
// If file is new/different, loop over and insert/update rows
// CREATE ROLE automations WITH LOGIN PASSWORD 'automate';
// GRANT SELECT, INSERT, UPDATE, DELETE ON postgres TO automations;
