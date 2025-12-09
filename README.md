# URLコピー拡張機能

現在のページのURLをワンクリックでコピーできるChrome拡張機能です。

## 機能

- 現在開いているタブのURLを自動取得
- ワンクリックでURLをクリップボードにコピー
- コピー成功の視覚的フィードバック
- モダンで使いやすいUI

## 使い方

1. 拡張機能をインストール後、ツールバーのアイコンをクリック
2. ポップアップに現在のURLが表示されます
3. 「URLをコピー」ボタンをクリック
4. URLがクリップボードにコピーされます

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

## 仮想環境のセットアップ

このプロジェクトにはPython仮想環境が含まれています。

### 仮想環境の有効化

```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 仮想環境の無効化

```bash
deactivate
```

### パッケージのインストール

仮想環境を有効化した後、必要なパッケージをインストールできます：

```bash
pip install パッケージ名
```

### requirements.txtの作成（推奨）

インストールしたパッケージを記録する場合：

```bash
pip freeze > requirements.txt
```

### requirements.txtからインストール

```bash
pip install -r requirements.txt
```
