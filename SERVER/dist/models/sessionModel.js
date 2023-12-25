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
const mongoose_1 = __importDefault(require("mongoose"));
const generateSessionCode_1 = __importDefault(require("../utils/generateSessionCode"));
const sessionSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true },
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
sessionSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // generate new session code
        const sessionCode = (0, generateSessionCode_1.default)();
        console.log(sessionCode);
        // check if code already exist
        const existingSession = yield Session.findOne({
            code: sessionCode,
        });
        // carrys out the entire process if code already exist
        if (existingSession) {
            return next();
        }
        this.code = sessionCode;
        next();
    });
});
const Session = mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
