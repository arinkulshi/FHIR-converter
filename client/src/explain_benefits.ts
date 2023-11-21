/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*

This will display the patient,provider and insurance information for that EOB. It will display the EOB for as many entries as exist in the API call
*/


export async function fetchEOBData(accessToken: string) {
  try {
    const fhirEOBResp = await fetch(
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
      return null;
    }
    const fhirEOBBody = await fhirEOBResp.json();
    return fhirEOBBody;
  } catch (err) {
    console.error("ExplanationOfBenefit error: ", err);
    return null;
  }
}


export function EOBComponent(eobData: any) {
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
export function displayExplanationOfBenefit(eobData: any) {
    console.log('ExplanationOfBenefit Data:', eobData);
    const eobDiv = document.getElementById('eob-data');
    if (eobDiv) {
      eobDiv.innerHTML = EOBComponent(eobData);
    } else {
      console.error('Could not find the ExplanationOfBenefit data div');
    }
  }

