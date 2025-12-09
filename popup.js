// DOM要素の取得
const urlInput = document.getElementById('url-input');
const copyBtn = document.getElementById('copy-btn');
const statusDiv = document.getElementById('status');
const debugInfo = document.getElementById('debug-info');
const debugText = document.getElementById('debug-text');

// デバッグ情報を表示する関数
function showDebug(message) {
  if (debugInfo && debugText) {
    debugText.textContent = message;
    debugInfo.style.display = 'block';
  }
  console.log('[DEBUG]', message);
}

// ページ読み込み時に現在のタブのURLを取得
document.addEventListener('DOMContentLoaded', async () => {
  try {
    showDebug('タブ情報を取得中...');
    
    // 現在のタブを取得
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    showDebug(`タブ数: ${tabs ? tabs.length : 0}`);
    console.log('Tabs found:', tabs);
    
    if (!tabs || tabs.length === 0) {
      urlInput.value = 'タブが見つかりませんでした';
      copyBtn.disabled = true;
      showStatus('タブ情報を取得できませんでした', 'error');
      showDebug('タブが見つかりませんでした');
      return;
    }
    
    const tab = tabs[0];
    showDebug(`タブID: ${tab.id}, URL: ${tab.url || 'undefined'}`);
    console.log('Current tab:', tab);
    
    if (!tab) {
      urlInput.value = 'タブ情報が取得できませんでした';
      copyBtn.disabled = true;
      showStatus('タブ情報が空です', 'error');
      showDebug('タブオブジェクトが空です');
      return;
    }
    
    // URLが取得できない場合（chrome://やchrome-extension://など）
    if (!tab.url) {
      if (tab.url === undefined) {
        urlInput.value = 'このページではURLを取得できません（chrome://ページなど）';
        copyBtn.disabled = true;
        showStatus('特殊なページのためURLを取得できません', 'error');
        showDebug('URLがundefinedです（特殊なページの可能性）');
      } else {
        urlInput.value = 'URLが空です';
        copyBtn.disabled = true;
        showDebug('URLが空文字列です');
      }
      return;
    }
    
    // URLが正常に取得できた場合
    urlInput.value = tab.url;
    copyBtn.disabled = false;
    showDebug('URL取得成功');
    console.log('URL set successfully:', tab.url);
    
  } catch (error) {
    console.error('Error getting tab URL:', error);
    const errorMsg = error.message || '不明なエラー';
    urlInput.value = `エラー: ${errorMsg}`;
    copyBtn.disabled = true;
    showStatus(`エラーが発生しました: ${errorMsg}`, 'error');
    showDebug(`エラー: ${errorMsg}`);
  }
});

// コピーボタンのクリックイベント
copyBtn.addEventListener('click', async () => {
  const url = urlInput.value;
  
  // 無効なURLのチェック
  const invalidUrls = [
    'URLを取得できませんでした',
    'エラーが発生しました',
    'タブが見つかりませんでした',
    'タブ情報が取得できませんでした',
    'タブ情報が空です',
    'URLが空です',
    'このページではURLを取得できません（chrome://ページなど）'
  ];
  
  if (!url || invalidUrls.some(invalid => url.includes(invalid)) || url.startsWith('エラー:')) {
    showStatus('コピーするURLがありません', 'error');
    return;
  }
  
  try {
    // クリップボードにコピー
    await navigator.clipboard.writeText(url);
    showStatus('✅ URLをコピーしました！', 'success');
    
    // ボタンのテキストを一時的に変更
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span class="button-icon">✓</span> コピー完了';
    copyBtn.classList.add('copied');
    
    // 1秒後に元に戻す
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('copied');
    }, 1000);
    
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    
    // フォールバック: テキストエリアを使用
    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      showStatus('✅ URLをコピーしました！', 'success');
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      showStatus('❌ コピーに失敗しました', 'error');
    }
  }
});

// URL入力欄をクリックしたときの処理（全選択）
urlInput.addEventListener('click', () => {
  urlInput.select();
});

// ステータスメッセージを表示する関数
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  // 3秒後に非表示にする
  setTimeout(() => {
    statusDiv.style.display = 'none';
    statusDiv.textContent = '';
  }, 3000);
}
