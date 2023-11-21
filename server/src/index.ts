import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import flexpaAccessToken from "./routes/flexpa_access_token";
import fhirRouter from "./routes/fhir";
import "dotenv/config";

const app = express();

app.use(cors());


app.use(bodyParser.json());
app.use("/flexpa-access-token", flexpaAccessToken);
app.use("/fhir", fhirRouter);

app.listen(9000, "0.0.0.0", () => {
  console.log("Server listening on http://localhost:9000");
});
