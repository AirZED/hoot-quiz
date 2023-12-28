"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    creatorId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Question require an owner'],
    },
    sessionId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Session',
        required: [true, 'Questions must have a session'],
    },
    question: {
        type: String,
        required: [true, 'Question must have a question'],
    },
    options: {
        type: [{ type: String || Number || Boolean, trim: true }],
        validate: {
            validator: function (options) {
                return options.length <= 4 && options.length > 1;
            },
            message: 'Options must not be more than 4',
        },
        required: [true, 'Question must have options'],
    },
    answer: {
        type: String || Number,
        validate: {
            validator: function (val) {
                return this.options.includes(val);
            },
            message: 'Answer must be included in options',
        },
    },
    answered: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Question = mongoose_1.default.model('Question', questionSchema);
exports.default = Question;
