import axios from "axios";
import { ButtonMessage, Message, TextMessage } from "./types";

export const isTextMessage = (message: Message): message is TextMessage => message.type === 'text';
export const isButtonMessage = (message: Message): message is ButtonMessage => message.type === 'button';

const postMessage = async (data: { message: string, wafrom: string, message_id: string }) => {

    const res_test = await axios({
        method: "POST",
        url: process.env.BUBBLE_TEST_URL,
        data,
        headers: { "Content-Type": "application/json" },
    })

    const res_prod = await axios({
        method: "POST",
        url: process.env.BUBBLE_URL,
        data,
        headers: { "Content-Type": "application/json" },
    })

    console.log('Bubble response test: ', res_test.data)
    console.log('Bubble response prod: ', res_prod.data)

    return res_prod;
}

export const forwardButtonMessage = async (message: ButtonMessage) => {
    const { from, button, id } = message;
    const bubbleEmail = await postMessage({ message: button.text, wafrom: from, message_id: id })

    console.log('Bubble response: ', bubbleEmail.data)
}

export const forwardTextMessage = async (message: TextMessage) => {
    const { from, text, id } = message;
    const bubbleEmail = await postMessage({ message: text.body, wafrom: from, message_id: id })

    console.log('Bubble response: ', bubbleEmail.data)
}

export const forwardGenericMessage = async (message: Message) => {
    const { from, id } = message;
    const bubbleEmail = await postMessage({ message: JSON.stringify(message), wafrom: from, message_id: id })

    console.log('Bubble response: ', bubbleEmail.data)
}