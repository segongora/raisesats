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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardGenericMessage = exports.forwardTextMessage = exports.forwardButtonMessage = exports.isButtonMessage = exports.isTextMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const isTextMessage = (message) => message.type === 'text';
exports.isTextMessage = isTextMessage;
const isButtonMessage = (message) => message.type === 'button';
exports.isButtonMessage = isButtonMessage;
const postMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res_test = yield (0, axios_1.default)({
            method: "POST",
            url: process.env.BUBBLE_TEST_URL,
            data,
            headers: { "Content-Type": "application/json" },
        });
        const res_prod = yield (0, axios_1.default)({
            method: "POST",
            url: process.env.BUBBLE_URL,
            data,
            headers: { "Content-Type": "application/json" },
        });
        console.log('Bubble response test: ', res_test.data);
        console.log('Bubble response prod: ', res_prod.data);
        return res_prod;
    }
    catch (e) {
        console.log(e);
    }
});
const forwardButtonMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, button, id } = message;
    const bubbleEmail = yield postMessage({ message: button.text, wafrom: from, message_id: id });
    console.log('Bubble response: ', bubbleEmail.data);
});
exports.forwardButtonMessage = forwardButtonMessage;
const forwardTextMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, text, id } = message;
    const bubbleEmail = yield postMessage({ message: text.body, wafrom: from, message_id: id });
    console.log('Bubble response: ', bubbleEmail.data);
});
exports.forwardTextMessage = forwardTextMessage;
const forwardGenericMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, id } = message;
    const bubbleEmail = yield postMessage({ message: JSON.stringify(message), wafrom: from, message_id: id });
    console.log('Bubble response: ', bubbleEmail.data);
});
exports.forwardGenericMessage = forwardGenericMessage;
//# sourceMappingURL=methods.js.map