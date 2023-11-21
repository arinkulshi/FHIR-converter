import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

interface TokenExchangeResponse {
  access_token: string;
  expires_in: number;
}

interface AccessTokenRequestBody {
  publicToken: string;
}

// POST /flexpa-access-token
// Exchanges the [publicToken](file:///Users/arindamkulshi/quickstart/client/src/main.ts#22%2C23-22%2C23) for an [access_token](file:///Users/arindamkulshi/quickstart/server/src/routes/flexpa_access_token.ts#6%2C3-6%2C3)
router.post("/", async (req: Request, res: Response) => {
  const { publicToken } = req.body as AccessTokenRequestBody;

  if (!publicToken) {
    return res.status(400).send("Invalid Flexpa public token");
  }

  if (!process.env.FLEXPA_PUBLIC_API_BASE_URL) {
    return res.status(500).send("Invalid public API base URL");
  }

  const exchangeEndpoint = new URL(
    "link/exchange",
    process.env.FLEXPA_PUBLIC_API_BASE_URL,
  ).href;

  // Call Flexpa API's exchange endpoint to exchange the [publicToken](file:///Users/arindamkulshi/quickstart/client/src/main.ts#22%2C23-22%2C23) for an [access_token](file:///Users/arindamkulshi/quickstart/server/src/routes/flexpa_access_token.ts#6%2C3-6%2C3)
  try {
    const response = await fetch(exchangeEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        public_token: publicToken,
        secret_key: process.env.FLEXPA_API_SECRET_KEY,
      }),
    });
    const { access_token: accessToken, expires_in: expiresIn } =
      (await response.json()) as TokenExchangeResponse;

    res.send({ accessToken, expiresIn });
  } catch (err) {
    return res.status(500).send(`Error during token exchange: ${err}`);
  }
});

export default router;
