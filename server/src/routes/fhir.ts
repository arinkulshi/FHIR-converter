import { Bundle } from "fhir/r4";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();


async function handleFetchRequest(
  endpoint: string,
  authHeader: string,
  maxAttempts = 10,
) {
  let attempts = 0;
  let waitTime = 1;
  while (attempts < maxAttempts) {
    try {
      console.log(`Attempt ${attempts + 1}: Fetching data from ${endpoint}`);
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: authHeader,
          "x-flexpa-raw": "0",
        },
      });
      if (response.status !== 429) {
        console.log(`Response ${response.status} received from ${endpoint}`);
        return response;
      }
      const retryAfter = response.headers.get("Retry-After") || waitTime;
      await new Promise((resolve) =>
        setTimeout(resolve, Number(retryAfter) * 1000),
      );
      attempts++;
      waitTime *= 2;
    } catch (err) {
      console.log(`Error fetching data from ${endpoint}: ${err}`);
      throw err;
    }
  }

  throw new Error("Maximum attempts reached.");
}

// Router to handle FHIR requests
router.get("*", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("All requests must be authenticated.");
  }

  const endpoint = new URL(
    `fhir${req.path}`,
    process.env.FLEXPA_PUBLIC_API_BASE_URL,
  ).href;

  try {
    const fhirResponse = await handleFetchRequest(endpoint, authHeader);
    const fhirData: Bundle = await fhirResponse.json();
    res.send(fhirData);
  } catch (err) {
    console.log(`Error retrieving FHIR data: ${err}`);
    return res.status(500).send(`Error retrieving FHIR data: ${err}`);
  }
});

export default router;
