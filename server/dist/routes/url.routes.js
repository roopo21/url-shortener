"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_controller_1 = require("../controllers/url.controller");
const router = (0, express_1.Router)();
router.post('/', url_controller_1.createShortUrl);
router.get('/', url_controller_1.getAllUrls);
router.get('/:shortId', url_controller_1.redirectToUrl);
exports.default = router;
