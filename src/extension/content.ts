const overlayId = 'do-your-work-overlay';

function showOverlay() {
  if (document.getElementById(overlayId)) return;

  const overlay = document.createElement('div');
  overlay.id = overlayId;
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'linear-gradient(135deg, #0f172a 0%, #111827 100%)';
  overlay.style.color = '#f8fafc';
  overlay.style.zIndex = '2147483647';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.flexDirection = 'column';
  overlay.style.padding = '24px';
  overlay.innerHTML = `
    <h1 style="font-size: 2rem; margin-bottom: 12px;">Do Your Work</h1>
    <p style="font-size: 1rem; margin-bottom: 16px; max-width: 480px; text-align: center;">This site is blocked while focus mode is on. Pick one real task and get started.</p>
    <button id="focus-reset" style="padding: 10px 14px; border-radius: 999px; border: none; background: #2563eb; color: white; cursor: pointer; font-weight: 600;">Back to work</button>
  `;

  overlay.querySelector('#focus-reset')?.addEventListener('click', () => {
    overlay.remove();
  });

  document.documentElement.appendChild(overlay);
}

function hideOverlay() {
  document.getElementById(overlayId)?.remove();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'BLOCK_PAGE') {
    showOverlay();
  }
});

window.addEventListener('beforeunload', hideOverlay);
