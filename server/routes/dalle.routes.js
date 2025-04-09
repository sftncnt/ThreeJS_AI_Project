import express, { response } from 'express'
import axios from 'axios'
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_KEY;

router.route('/').get((req, res) => {
    res.status(200).json({message: "Hello from AI routes"})
})


router.route('/').post(async (req, res) => {
    try {
        const {prompt} = req.body;

        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
            {
                prompt: prompt,
            },
            {
                headers: {
                    Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-type': 'application/json',
                },
                responseType: 'arraybuffer',
            }
        )

        const image = Buffer.from(response.data, 'binary').toString('base64');

        res.status(200).json({photo: image})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Something went wrong"})
    }
})

export default router;