import body_parser from 'body-parser';
import dotenv from 'dotenv';
import express, { Express, Request } from 'express';
import { forwardButtonMessage, forwardGenericMessage, forwardTextMessage, isButtonMessage, isTextMessage } from './methods';
import { WhatsappEntry } from './types';

dotenv.config();

const app: Express = express();


app.use(body_parser.json());

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

app.post("/webhook", async (req: Request<unknown, any, WhatsappEntry>, res) => {

    console.log(JSON.stringify(req.body, null, 2));

    if (req.body.object) {

        const message = req?.body?.entry?.[0]?.changes?.[0]?.value?.messages[0]

        if (message) {
            if (isTextMessage(message)) await forwardTextMessage(message);
            else if (isButtonMessage(message)) await forwardButtonMessage(message);
            else await forwardGenericMessage(message);
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
            res.sendStatus(403);
        }
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");

});
