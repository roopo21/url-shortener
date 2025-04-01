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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const url_model_1 = require("./models/url.model");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortner';
// middleware
app.use((0, cors_1.default)()); // Allow all origins  
app.use(express_1.default.json());
app.use('/api/urls', url_routes_1.default);
app.get('/:shortId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortId } = req.params;
        const url = yield url_model_1.UrlModel.findOneAndUpdate({ shortId }, // Query to find the document
        { $inc: { clicks: 1 } }, // Increment the clicks field by 1
        { new: true } // Return the updated document after the increment
        );
        if (!url) {
            res.status(404).json({ error: 'URL not found' });
            return;
        }
        else {
            res.redirect(301, url.originalUrl);
        }
    }
    catch (error) {
        console.error('Error in redirect:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
