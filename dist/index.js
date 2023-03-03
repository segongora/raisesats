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
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const token = process.env.WHATSAPP_TOKEN;
app.use(body_parser_1.default.json());
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    console.log(JSON.stringify(req.body, null, 2));
    if (req.body.object) {
        if (req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]) {
            let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from;
            let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
            console.log('Publicando email');
            const bubbleEmail = yield (0, axios_1.default)({
                method: "POST",
                url: process.env.BUBBLE_URL,
                data: {
                    message: msg_body,
                    wafrom: from,
                },
                headers: { "Content-Type": "application/json" },
            });
            console.log('Bubble response: ', bubbleEmail.data);
        }
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
}));
app.get("/webhook", (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        }
        else {
            res.sendStatus(403);
        }
    }
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
//# sourceMappingURL=index.js.map
