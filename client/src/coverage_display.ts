import { ExplanationOfBenefit, Patient } from "fhir/r4";

function displayExplanationOfBenefit(eob: ExplanationOfBenefit | undefined, patient: Patient) {
  if (!eob || eob.resourceType !== "ExplanationOfBenefit") {
    return /* html */ `
        <div>
        Error: Undefined ExplanationOfBenefit Resource
        <div/>
        `;
  }

  return /* html */ `
    <dl>
      <dt>Beneficiary</dt>
      <dd>${displayPatientName(patient)}</dd>
      <dt>Claim ID</dt>
      <dd>${eob.claim?.reference ?? ""}</dd>
      <dt>Period</dt>
      <dd>${eob.billablePeriod?.start ?? ""} ${`- ${eob.billablePeriod?.end}` ?? ""}</dd>
      <dt>Status</dt>
      <dd>${eob.status}</dd>
      <dt>Type</dt>
      <dd>${eob.type?.text ?? ""}</dd>
      <dt>Payor</dt>
      <dd>${eob.insurer?.display ?? ""}</dd>
    </dl>
  `;
}



export default displayExplanationOfBenefit;
