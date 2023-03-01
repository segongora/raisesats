import axios from 'axios';
import body_parser from 'body-parser';
import dotenv from 'dotenv';
import express, { Express, Request } from 'express';
import { WhatsappEntry } from './types';

dotenv.config();
const BUBBLE_URL = 'https://raisesats.bubbleapps.io/version-test/api/1.1/wf/whatsapp_message'

const app: Express = express();
const token = process.env.WHATSAPP_TOKEN;

app.use(body_parser.json());

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req: Request<unknown, any, WhatsappEntry>, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the Incoming webhook message
    console.log(JSON.stringify(req.body, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
        if (
            req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]
        ) {
            let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from;
            let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
            console.log('Publicando email')
            const bubbleEmail = await axios({
                method: "POST",
                url: BUBBLE_URL,
                data: {
                    message: msg_body,
                },
                headers: { "Content-Type": "application/json" },
            })

            console.log('Bubble response: ', bubbleEmail.data)
        }

        res.sendStatus(200)
    } else {
        res.sendStatus(404);
    }
});

app.get("/webhook", (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");

});