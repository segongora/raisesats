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
const BUBBLE_URL = 'https://raisesats.bubbleapps.io/version-test/api/1.1/wf/whatsapp_message';
dotenv_1.default.config();
const app = (0, express_1.default)();
const token = process.env.WHATSAPP_TOKEN;
app.use(body_parser_1.default.json());
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));
// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse the request body from the POST
    let body = req.body;
    // Check the Incoming webhook message
    console.log(JSON.stringify(req.body, null, 2));
    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
        if (req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]) {
            let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
            const responseACK = yield (0, axios_1.default)({
                method: "POST",
                url: "https://graph.facebook.com/v12.0/" +
                    phone_number_id +
                    "/messages?access_token=" +
                    token,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: { body: "Ack: " + msg_body },
                },
                headers: { "Content-Type": "application/json" },
            });
            const responseBubble = yield (0, axios_1.default)({
                method: "POST",
                url: BUBBLE_URL,
                data: {
                    message: msg_body,
                },
                headers: { "Content-Type": "application/json" },
            });
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