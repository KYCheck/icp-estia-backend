import { Server, serialize } from 'azle';
import express from 'express';
import { createHash } from 'crypto';

export default Server(() => {
    const app = express();

    app.use(express.json());

    app.post('/hash', async (req, res) => {
        const { name, bic } = req.body;

        const hash = createHash('sha256');

        hash.update(name + bic);

        const hashedValue = hash.digest('hex');

        return res.json(hashedValue);
    });

    async function getData(access_token: string) {
        const authorization = 'Bearer ' + access_token;

        const response = await fetch(`icp://aaaaa-aa/http_request`, {
            body: serialize({
                args: [
                    {
                        url: `https://pbw-sandbox.biapi.pro/2.0//users/me/accounts`,
                        max_response_bytes: [],
                        method: {
                            get: null
                        },
                        headers: [
                            { name: 'Authorization', value: authorization },
                            { name: 'Content-Type', value: 'application/json' }
                        ],
                        body: [],
                        transform: []
                    }
                ],
                cycles: 30000000000
            })
        });

        return await response.json();
    }

    app.post('/verify', async (req, res) => {
        const { access_token, name, bic } = req.body;

        try {
            const transactions = await getData(access_token);
            const data = JSON.parse(Buffer.from(transactions.body).toString('utf-8'));

            return (data.accounts[0].name == name) && (data.accounts[0].bic == bic);

        } catch (error: any) {
            const errorTxt = 'Error fetching transactions: ' + error.message;
            return res.status(500).json({ error: errorTxt });
        }
    });

    app.use(express.static('/dist'));

    return app.listen();
});