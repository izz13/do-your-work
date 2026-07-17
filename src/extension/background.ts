import { storage } from './storage';

const DEFAULT_BLOCKED_SITES = ['youtube.com', 'twitter.com', 'reddit.com', 'instagram.com', 'tiktok.com'];

async function syncBlockedSites() {
  const current = await storage.getBlockedSites();
  if (current.length === 0) {
    await storage.setBlockedSites(DEFAULT_BLOCKED_SITES);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await syncBlockedSites();
  await storage.setEnabled(true);
});

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (!changeInfo.url || !tab.url) return;

  const enabled = await storage.getEnabled();
  if (!enabled) return;

  const blockedSites = await storage.getBlockedSites();
  const hostname = new URL(tab.url).hostname.replace(/^www\./, '');
  const shouldBlock = blockedSites.some((site) => hostname.includes(site));

  if (shouldBlock) {
    await chrome.tabs.sendMessage(tab.id!, { type: 'BLOCK_PAGE' }).catch(() => undefined);
  }
});
