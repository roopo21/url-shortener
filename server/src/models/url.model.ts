import mongoose, {Document, mongo} from "mongoose";


export interface IUrl extends Document {
    originalUrl : string;
    shortId : string;
    clicks: number;
    createdAt: Date;
}


const urlSchema = new mongoose.Schema<IUrl>({
    originalUrl: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
      },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000, // 30 days in seconds
      },
});


export const UrlModel = mongoose.model<IUrl>('Url', urlSchema);