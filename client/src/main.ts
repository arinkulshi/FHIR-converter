/* eslint-disable @typescript-eslint/no-explicit-any */
import "./style.css";
import { FlexpaConfig} from "./flexpa_types";
import displayFlexpaLinkButton from "./flexpa_link_button";


declare const FlexpaLink: {
  create: (config: FlexpaConfig) => Record<string, unknown>;
  open: () => Record<string, unknown>;
};

function initializePage() {
  if (!import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY) {
    console.error(
      "No publishable key found. Set VITE_FLEXPA_PUBLISHABLE_KEY in .env",
    );
  }

  FlexpaLink.create({
    publishableKey: import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY,
    onSuccess: async (publicToken: string) => {
      // Fetch the access token using the publicToken
      let resp;
      try {
        resp = await fetch(`${import.meta.env.VITE_SERVER_URL}/flexpa-access-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicToken }),
        });
        if (!resp.ok) {
          console.error(`Failed to fetch access token: ${resp.status}`);
          return;
        }
      } catch (err) {
        console.error('Access token error:', err);
        return;
      }

      const { accessToken } = await resp.json();

      let fhirEOBResp;
      try {
        fhirEOBResp = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/fhir/ExplanationOfBenefit?patient=$PATIENT_ID`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!fhirEOBResp.ok) {
          console.error(`Fetch failed with status: ${fhirEOBResp.status}`);
          return;
        }
        const fhirEOBBody = await fhirEOBResp.json();
        displayExplanationOfBenefit(fhirEOBBody);
      } catch (err) {
        console.error("ExplanationOfBenefit error: ", err);
      }

      const flexpaLinkBtn = document.getElementById("flexpa-link-btn");
      const testModeLoginBtn = document.getElementById("test-mode-login-btn");
      if (flexpaLinkBtn) {
        flexpaLinkBtn.style.display = 'none';
      }
      if (testModeLoginBtn) {
        testModeLoginBtn.style.display = 'none';
      }



    },
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




/*

This will display the patient,provider and insurance information for that EOB. It will display the EOB for as many entries as exist
*/
function EOBComponent(eobData: any) {
  let html = '';
  eobData.entry.forEach((entry: any) => {
    const provider = entry.resource.provider;
    const patient = entry.resource.patient;
    const insurance = entry.resource.insurance;

    let insuranceHTML = '';
    insurance.forEach((ins: any) => {
      insuranceHTML += `
        <div>
          <p>Coverage Reference: ${ins.coverage.reference}</p>
        </div>
      `;
    });

    html += `
      <div>
        <h3>Patient Information</h3>
        <p>Reference: ${patient.reference}</p>

        <h3>Provider Information</h3>
        <p>Reference: ${provider.reference}</p>
        <p>Name: ${provider.display}</p>

        <h3>Insurance Information</h3>
        ${insuranceHTML}
        
      </div>
    `;
  });

  return html;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function displayExplanationOfBenefit(eobData: any) {
  console.log('ExplanationOfBenefit Data:', eobData);

  const eobDiv = document.getElementById('eob-data');
  if (eobDiv) {
    eobDiv.innerHTML = EOBComponent(eobData);
  } else {
    console.error('Could not find the ExplanationOfBenefit data div');
  }
}


initializePage();
