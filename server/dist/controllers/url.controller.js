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
exports.getAllUrls = exports.redirectToUrl = exports.createShortUrl = void 0;
const url_model_1 = require("../models/url.model");
const valid_url_1 = __importDefault(require("valid-url"));
const nanoid_cjs_1 = require("nanoid-cjs");
const createShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalUrl, customShortId } = req.body;
        if (!valid_url_1.default.isWebUri(originalUrl)) {
            res.status(400).json({ error: 'Invalid URL' });
            return;
        }
        const existingUrl = yield url_model_1.UrlModel.findOne({ originalUrl });
        if (existingUrl) {
            res.json({ existingUrl });
            return;
        }
        if (customShortId) {
            const existingCustomUrl = yield url_model_1.UrlModel.findOne({ shortId: customShortId });
            if (existingCustomUrl) {
                res.status(400).json({ error: 'Custom short ID already in use' });
                return;
            }
        }
        let shortId = customShortId;
        if (!shortId) {
            do {
                shortId = (0, nanoid_cjs_1.nanoid)(8);
                const existingShortId = yield url_model_1.UrlModel.findOne({ shortId });
                if (!existingShortId)
                    break;
            } while (true);
        }
        const urlDoc = new url_model_1.UrlModel({
            originalUrl,
            shortId
        });
        yield urlDoc.save();
        res.status(201).json(urlDoc);
    }
    catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createShortUrl = createShortUrl;
const redirectToUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortId } = req.params;
        const url = yield url_model_1.UrlModel.findOne({ shortId });
        if (!url) {
            res.status(404).json({ error: 'URL not found' });
            return;
        }
        // Increment the click counter
        url.clicks++;
        yield url.save();
        // Redirect to the original URL
        res.redirect(url.originalUrl);
    }
    catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.redirectToUrl = redirectToUrl;
const getAllUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urls = yield url_model_1.UrlModel.find().sort({ createdAt: -1 });
        res.json(urls);
    }
    catch (error) {
        console.error('Error getting URLs:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getAllUrls = getAllUrls;
