import { Router } from "express";
import { createShortUrl, getAllUrls, redirectToUrl } from "../controllers/url.controller";


const router = Router();


router.post('/', createShortUrl);
router.get('/', getAllUrls);
router.get('/:shortId', redirectToUrl);

export default router;
