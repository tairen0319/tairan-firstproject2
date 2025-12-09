# Chrome拡張機能

Chrome拡張機能のプロジェクトです。

## GitHub連携のセットアップ

### 1. GitHubリポジトリの作成

1. https://github.com/new にアクセス
2. リポジトリ名を入力（例: `chrome-extension`）
3. Public/Privateを選択
4. 「Initialize this repository with a README」は**チェックしない**（既にローカルにリポジトリがあるため）
5. 「Create repository」をクリック

### 2. リモートリポジトリの追加

GitHubでリポジトリを作成した後、以下のコマンドを実行してください：

```bash
# HTTPSを使用する場合（YOUR_USERNAMEとREPO_NAMEを実際の値に置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# またはSSHを使用する場合
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

### 3. 初回プッシュ

```bash
git push -u origin main
```

### 4. 認証について

初回プッシュ時に認証が必要です：

- **HTTPSの場合**: Personal Access Token (PAT) を使用
  - GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
  - 新しいトークンを作成（`repo`権限が必要）
  - パスワードの代わりにトークンを使用

- **SSHの場合**: SSH鍵をGitHubに登録
  - `~/.ssh/id_rsa.pub` をGitHubのSettings > SSH and GPG keysに追加

## 開発

このプロジェクトはChrome拡張機能の開発用テンプレートです。
