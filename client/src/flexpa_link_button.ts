function displayFlexpaLinkButton() {
    return /* html */ `
      <div class="link-section">
        <button id="flexpa-link-btn" class="launch-btn">
          <span class="icon-container">
            <svg aria-hidden="true" class="lock-icon" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </span>
          <span>Connect your health plan with Flexpa Link</span>
        </button>
      </div>
    `;
  }export default displayFlexpaLinkButton;
