const STORAGE_KEYS = {
  enabled: 'do-your-work-enabled',
  blockedSites: 'do-your-work-blocked-sites',
};

export const storage = {
  async getEnabled() {
    const result = await chrome.storage.local.get(STORAGE_KEYS.enabled);
    return result[STORAGE_KEYS.enabled] ?? true;
  },
  async setEnabled(enabled: boolean) {
    await chrome.storage.local.set({ [STORAGE_KEYS.enabled]: enabled });
  },
  async getBlockedSites() {
    const result = await chrome.storage.local.get(STORAGE_KEYS.blockedSites);
    return (result[STORAGE_KEYS.blockedSites] as string[] | undefined) ?? [];
  },
  async setBlockedSites(blockedSites: string[]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.blockedSites]: blockedSites });
  },
  async clearBlockedSites() {
    await chrome.storage.local.remove(STORAGE_KEYS.blockedSites);
  },
};
