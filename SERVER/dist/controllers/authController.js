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
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = __importDefault(require("../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
class AuthController {
    constructor() {
        this.signToken = (id) => {
            return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || '', {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        };
        this.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, passwordConfirm, role } = req.body;
            const user = yield userModel_1.default.create({
                name,
                email,
                password,
                passwordConfirm,
                role,
            });
            if (!user) {
                return next(new appError_1.default('Sign-up not successfull, an error occured', 400));
            }
            res.status(201).json({
                message: 'success',
            });
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            //check if email and password is valid
            if (!email || !password) {
                return next(new appError_1.default('Please provide a password and an email', 400));
            }
            const user = yield userModel_1.default.findOne({ email }).select('+password');
            if (!user || !(yield user.comparePassword(password))) {
                return next(new appError_1.default('User email or password is invalid', 404));
            }
            const token = this.signToken(user.id);
            res.status(201).json({
                message: 'success',
                token,
                user,
            });
        }));
        this.forgetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // forget password
            const { email } = req.body;
            // find account to confirm availability
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return next(new appError_1.default('Please, input valid email', 400));
            }
            const resetToken = user.sendPasswordResetToken();
            yield user.save({ validateBeforeSave: false });
            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
            const message = `Forget your password, Visit this link to reset your password : ${resetUrl} \nIf you didnt forget your password, ignore this email`;
            try {
                yield (0, email_1.default)({
                    email: user.email,
                    subject: 'Reset Password',
                    message,
                });
                res.status(201).json({
                    status: 'success',
                    message: 'Password reset token sent successfully',
                });
            }
            catch (err) {
                res
                    .status(400)
                    .json({ message: 'There was an error, try again', status: 'error' });
            }
        }));
        this.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // confirm the reset Token
            const { password, passwordConfirm } = req.body;
            const { resetToken } = req.params;
            const passwordResetToken = crypto_1.default
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            const user = yield userModel_1.default.findOne({ passwordResetToken });
            if (!user || !user.checkResetTokenExpiration()) {
                return next(new appError_1.default('Invalid or expired reset Token', 400));
            }
            user.password = password;
            user.passwordConfirm = passwordConfirm;
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpireTime = undefined;
            yield user.save();
            res.status(201).json({
                message: 'success',
            });
        }));
        this.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // check the headers bearer token
            let token;
            if (req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }
            if (!token) {
                return next(new appError_1.default('auth token not available in header', 404));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
            const user = yield userModel_1.default.findOne({ _id: decoded.id });
            if (!user) {
                return next(new appError_1.default('The user does not exist', 400));
            }
            const isChangePassword = user.checkPasswordChange(decoded.iat);
            if (isChangePassword) {
                return next(new appError_1.default('This user is a fraud, password was changed amidst request', 400));
            }
            req.user = user;
            next();
        }));
        // send refresh token
        this.refreshToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('This endpoint recieved a hit');
        }));
        this.restrictTo = (...roles) => (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
                res.status(402).json({
                    message: 'Does not have permission to access resource',
                    status: 'failed',
                });
            }
            next();
        }));
    }
}
exports.default = new AuthController();
