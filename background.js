// キーボードショートカットでURLをコピーするサービスワーカー

// ショートカット: Command+Shift+C (Mac) / Ctrl+Shift+C (Win/Linux)
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'copy-url') return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) {
      console.warn('アクティブなタブまたはURLが見つかりません');
      await setBadge('ERR', '#f44336', tab?.id);
      return;
    }

    // アクティブタブでクリップボードコピーを実行
    const [{ result } = {}] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (url) => {
        try {
          await navigator.clipboard.writeText(url);
          return { success: true };
        } catch (error) {
          // フォールバック: execCommand
          try {
            const ta = document.createElement('textarea');
            ta.value = url;
            ta.style.position = 'fixed';
            ta.style.left = '-999999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return { success: true, fallback: true };
          } catch (fallbackError) {
            return { success: false, error: fallbackError.message };
          }
        }
      },
      args: [tab.url],
      world: 'MAIN',
    });

    if (result?.success) {
      await setBadge('OK', '#4caf50', tab.id);
    } else {
      console.warn('コピーに失敗しました', result?.error);
      await setBadge('ERR', '#f44336', tab.id);
    }
  } catch (err) {
    console.error('copy-url command error:', err);
  }
});

async function setBadge(text, color, tabId) {
  try {
    await chrome.action.setBadgeText({ text, tabId });
    await chrome.action.setBadgeBackgroundColor({ color, tabId });
    setTimeout(() => chrome.action.setBadgeText({ text: '', tabId }), 1500);
  } catch (e) {
    console.warn('Badge update failed:', e);
  }
}

