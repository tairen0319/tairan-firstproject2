// キーボードショートカットでURLをコピーするサービスワーカー

// ショートカット: Command+Shift+C (Mac) / Ctrl+Shift+C (Win/Linux)
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'copy-url') return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) {
      console.warn('アクティブなタブまたはURLが見つかりません');
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
      await chrome.action.setBadgeText({ text: 'OK', tabId: tab.id });
      await chrome.action.setBadgeBackgroundColor({ color: '#4caf50', tabId: tab.id });
      setTimeout(() => chrome.action.setBadgeText({ text: '', tabId: tab.id }), 1200);
    } else {
      console.warn('コピーに失敗しました', result?.error);
      await chrome.action.setBadgeText({ text: 'ERR', tabId: tab.id });
      await chrome.action.setBadgeBackgroundColor({ color: '#f44336', tabId: tab.id });
      setTimeout(() => chrome.action.setBadgeText({ text: '', tabId: tab.id }), 1500);
    }
  } catch (err) {
    console.error('copy-url command error:', err);
  }
});

