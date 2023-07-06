"use strict";
/* istanbul ignore file */
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptFile = exports.createEncryptedCid = exports.combineKeytoEncryptedCid = exports.removeKeyFromEncryptedCid = exports.calculateB3hashFromFileEncrypt = exports.getEncryptedStreamReader = exports.chunkSizeAsPowerOf2 = exports.generate_key = exports.encrypt_file_xchacha20 = exports.__wbg_init = void 0;
// Main exports.
const encrypt_file_1 = __importStar(require("../../encrypt_file/pkg/encrypt_file"));
exports.__wbg_init = encrypt_file_1.default;
Object.defineProperty(exports, "encrypt_file_xchacha20", { enumerable: true, get: function () { return encrypt_file_1.encrypt_file_xchacha20; } });
Object.defineProperty(exports, "generate_key", { enumerable: true, get: function () { return encrypt_file_1.generate_key; } });
var encryptWasm_1 = require("./encryptWasm");
Object.defineProperty(exports, "chunkSizeAsPowerOf2", { enumerable: true, get: function () { return encryptWasm_1.chunkSizeAsPowerOf2; } });
Object.defineProperty(exports, "getEncryptedStreamReader", { enumerable: true, get: function () { return encryptWasm_1.getEncryptedStreamReader; } });
Object.defineProperty(exports, "calculateB3hashFromFileEncrypt", { enumerable: true, get: function () { return encryptWasm_1.calculateB3hashFromFileEncrypt; } });
Object.defineProperty(exports, "removeKeyFromEncryptedCid", { enumerable: true, get: function () { return encryptWasm_1.removeKeyFromEncryptedCid; } });
Object.defineProperty(exports, "combineKeytoEncryptedCid", { enumerable: true, get: function () { return encryptWasm_1.combineKeytoEncryptedCid; } });
Object.defineProperty(exports, "createEncryptedCid", { enumerable: true, get: function () { return encryptWasm_1.createEncryptedCid; } });
Object.defineProperty(exports, "encryptFile", { enumerable: true, get: function () { return encryptWasm_1.encryptFile; } });
