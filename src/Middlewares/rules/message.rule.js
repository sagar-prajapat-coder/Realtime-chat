import { body, param } from "express-validator";

export const conversationValidator = [
    param("userId")
    .isMongoId()
    .withMessage('Please provider valid mongo object user id')
];

export const sendMessageValidator = [

    body("receiverId")
    .trim()
    .notEmpty()
    .withMessage('Receiver id is required')
    .isMongoId()
    .withMessage('Please provider valid mongo object user id'),

    // body("message")
    // .trim()
    // .notEmpty()
    // .withMessage("Please write a message")

];