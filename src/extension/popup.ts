import { storage } from './storage';

const button = document.getElementById('toggle') as HTMLButtonElement | null;
const clearButton = document.getElementById('clear') as HTMLButtonElement | null;
const openAppButton = document.getElementById('open-app') as HTMLButtonElement | null;
const status = document.getElementById('status');

async function openLocalApp() {
  const urls = ['http://localhost:8080/', 'http://127.0.0.1:8080/'];
  for (const url of urls) {
    try {
      await chrome.tabs.create({ url });
      return true;
    } catch {
      // Try the next fallback URL.
    }
  }
  return false;
}

async function render() {
  const enabled = await storage.getEnabled();
  if (button) {
    button.textContent = enabled ? 'Disable focus mode' : 'Enable focus mode';
  }
  if (status) {
    status.textContent = enabled ? 'Focus mode is on.' : 'Focus mode is off.';
  }
}

button?.addEventListener('click', async () => {
  const enabled = await storage.getEnabled();
  await storage.setEnabled(!enabled);
  await render();
});

clearButton?.addEventListener('click', async () => {
  await storage.clearBlockedSites();
  await render();
  if (status) {
    status.textContent = 'Blocked list cleared.';
  }
});

openAppButton?.addEventListener('click', async () => {
  await openLocalApp();
});

void (async () => {
  await render();
  await openLocalApp();
})();
