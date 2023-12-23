"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    startTime: {
        type: Date,
        required: [true, 'A session must have a start time'],
    },
    endTime: {
        type: Date,
        required: [true, 'A session must have an end time'],
    },
    creatorId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A session needs a creator Id'],
    },
    active: Boolean,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Session = mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
