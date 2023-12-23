"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tempUserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A temp user must have a name'],
    },
    score: {
        type: Number,
    },
    session_id: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Session',
        required: [true, 'A temp user must belong session'],
    },
    answers: [
        {
            question_id: {
                type: mongoose_1.default.Schema.ObjectId,
                ref: 'Question',
            },
            score: Number,
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const TempUser = mongoose_1.default.model('Session', tempUserSchema);
exports.default = TempUser;
