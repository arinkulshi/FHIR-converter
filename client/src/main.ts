/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./style.css";
import { FlexpaConfig} from "./flexpa_types";
import displayFlexpaLinkButton from "./flexpa_link_button";
import {displayExplanationOfBenefit, fetchEOBData } from './explain_benefits';

declare const FlexpaLink: {
  create: (config: FlexpaConfig) => Record<string, unknown>;
  open: () => Record<string, unknown>;
};


// Fetches the access token using the publicToken
async function fetchAccessToken(publicToken: string) {
  try {
    const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}/flexpa-access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicToken }),
    });
    if (!resp.ok) {
      console.error(`Failed to fetch access token: ${resp.status}`);
      return null;
    }
    const { accessToken } = await resp.json();
    return accessToken;
  } catch (err) {
    console.error('Access token error:', err);
    return null;
  }
}



// Hides the Flexpa Link button and the Test Mode Login button
function hideButtons() {
  const flexpaLinkBtn = document.getElementById("flexpa-link-btn");
  const testModeLoginBtn = document.getElementById("test-mode-login-btn");
  if (flexpaLinkBtn) {
    flexpaLinkBtn.style.display = 'none';
  }
  if (testModeLoginBtn) {
    testModeLoginBtn.style.display = 'none';
  }
}

// The onSuccess function for FlexpaLink.create
async function onSuccess(publicToken: string) {
  const accessToken = await fetchAccessToken(publicToken);
  if (!accessToken) {
    return;
  }
  const fhirEOBBody = await fetchEOBData(accessToken);
  if (!fhirEOBBody) {
    return;
  }
  displayExplanationOfBenefit(fhirEOBBody);
  hideButtons();
}

function initializePage() {
  if (!import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY) {
    console.error(
      "No publishable key found. Set VITE_FLEXPA_PUBLISHABLE_KEY in .env",
    );
  }

  FlexpaLink.create({
    publishableKey: import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY,
    onSuccess,
  });

  const flexpaLinkDiv = document.getElementById("flexpa-link");
  if (!flexpaLinkDiv) {
    console.error("Could not find the Flexpa Link div");
    return;
  }
  flexpaLinkDiv.innerHTML = displayFlexpaLinkButton();

  const linkButton = document.getElementById("flexpa-link-btn");
  if (!linkButton) {
    console.error("Could not find the Flexpa Link button");
    return;
  }
  linkButton.addEventListener("click", () => {
    FlexpaLink.open();
  });
}

initializePage();
