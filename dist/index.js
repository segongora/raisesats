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
// External libraries
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
// Internal modules
const methods_1 = require("./methods");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 1337;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
app.use(body_parser_1.default.json());
app.listen(PORT, () => console.log("Webhook is listening on port", PORT));
app.post("/webhook", handleWebhookPost);
app.get("/webhook", handleWebhookGet);
app.get("/", (_, res) => res.send("Hello World!"));
function handleWebhookPost(req, res) {
    var _a, _b, _c, _d, _e, _f;
    console.log(JSON.stringify(req.body, null, 2));
    if (req.body.object) {
        const message = (_f = (_e = (_d = (_c = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.entry) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.changes) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.messages[0];
        if (message)
            forwardAppropriateMessage(message);
        return res.sendStatus(200);
    }
    return res.sendStatus(404);
}
function handleWebhookGet(req, res) {
    const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
    if (isValidWebhookRequest(mode, token)) {
        console.log("WEBHOOK_VERIFIED");
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
}
function isValidWebhookRequest(mode, token) {
    return mode === "subscribe" && token === VERIFY_TOKEN;
}
function forwardAppropriateMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, methods_1.isTextMessage)(message))
            yield (0, methods_1.forwardTextMessage)(message);
        else if ((0, methods_1.isButtonMessage)(message))
            yield (0, methods_1.forwardButtonMessage)(message);
        else
            yield (0, methods_1.forwardGenericMessage)(message);
    });
}
//# sourceMappingURL=index.js.map