// External libraries
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import body_parser from 'body-parser';

// Internal modules
import { forwardButtonMessage, forwardGenericMessage, forwardTextMessage, isButtonMessage, isTextMessage } from './methods';
import { Message, WhatsappEntry } from './types';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 1337;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.use(body_parser.json());
app.listen(PORT, () => console.log("Webhook is listening on port", PORT));

app.post("/webhook", handleWebhookPost);
app.get("/webhook", handleWebhookGet);
app.get("/", (_, res) => res.send("Hello World!"));

function handleWebhookPost(req: Request<unknown, any, WhatsappEntry>, res: Response) {
    console.log(JSON.stringify(req.body, null, 2));

    if (req.body.object) {
        const message = req?.body?.entry?.[0]?.changes?.[0]?.value?.messages[0];
        if (message) forwardAppropriateMessage(message);
        return res.sendStatus(200);
    }

    return res.sendStatus(404);
}

function handleWebhookGet(req: Request, res: Response) {
    const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query as { [key: string]: string };

    if (isValidWebhookRequest(mode, token)) {
        console.log("WEBHOOK_VERIFIED");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
}

function isValidWebhookRequest(mode: string, token: string): boolean {
    return mode === "subscribe" && token === VERIFY_TOKEN;
}

async function forwardAppropriateMessage(message: Message) {
    if (isTextMessage(message)) await forwardTextMessage(message);
    else if (isButtonMessage(message)) await forwardButtonMessage(message);
    else await forwardGenericMessage(message);
}
