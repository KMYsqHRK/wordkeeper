# wordkeeper - GitHub Pages で作る自分専用単語帳

[![Build Status](https://github.com/yourusername/vocabulary-app/workflows/Build%20Vocabulary%20Data/badge.svg)](https://github.com/yourusername/vocabulary-app/actions)

GitHub Pages を使って作る、シンプルで使いやすい英単語帳アプリです。知らなかった英単語を記録して、効率的に復習できます。なお、現在は個人用です。

## デモ

https://yourusername.github.io/vocabulary-app/

## 特徴

- 🚀 **シンプルな操作**: 新しい単語を覚えたら、マークダウンファイルを追加するだけ
- 📱 **レスポンシブデザイン**: スマホでもPCでも快適に使える
- 🔍 **検索機能**: 単語や意味で簡単に検索
- 🏷️ **カテゴリ分類**: ビジネス、文学、科学など、カテゴリで分類可能
- 📊 **進捗の可視化**: 追加した単語数のトレンドを確認
- 🔄 **自動更新**: GitHubへのプッシュで単語データが自動的に更新

## 使い方

### 1. リポジトリのフォーク

このリポジトリをフォークして、自分のGitHubアカウントにコピーします。

### 2. リポジトリ名の変更（オプション）

Settings > Repository name から、好きな名前に変更できます。

### 3. GitHub Pagesの有効化

1. Settings > Pages に移動
2. Source を「Deploy from a branch」に設定
3. Branch を「main」、フォルダを「/ (root)」に設定
4. Save をクリック

### 4. 新しい単語の追加

新しい英単語を覚えたら、以下の手順で追加します：

1. `_words` ディレクトリに新しいファイルを作成
2. ファイル名は `YYYY-MM-DD-単語.md` の形式で（例：`2023-03-29-ephemeral.md`）
3. 以下のテンプレートを使用：

```markdown
---
word: ephemeral
pronunciation: /ɪˈfɛm(ə)rəl/
part_of_speech: adjective
meaning: 儚い、一時的な
categories: [文学, 自然]
---

## 例文

- The beauty of cherry blossoms is ephemeral.
- 桜の美しさは儚い。

## メモ

春の桜を見て覚えた単語。「エフェメラル」と発音するとなんとなく「儚い」感じがする。
```

4. 変更をコミット＆プッシュ
5. GitHub Actions が自動的にデータを更新
6. 数分後、ウェブサイトに単語が追加されます

### 5. カスタマイズ

好みに合わせてカスタマイズできます：

- `css/style.css` でデザインを変更
- `index.html` でレイアウトを調整
- `js/app.js` で機能を追加・変更

## 開発者向け情報

### ローカルでの開発

1. リポジトリをクローン
2. 依存パッケージのインストール（データ生成用）

```bash
npm install gray-matter fs-extra
```

3. データ生成スクリプトの実行

```bash
node .github/scripts/build-data.js
```

4. ローカルサーバーの起動（VS CodeのLive Serverなど）

### ファイル構成

- `index.html` - メインページ
- `css/` - スタイルシート
- `js/` - JavaScriptファイル
- `data/` - 生成されたJSONデータ
- `_words/` - 単語のマークダウンファイル
- `.github/` - GitHub Actions設定

## ライセンス

MIT

## 貢献

Issueやプルリクエストは大歓迎です！機能追加や改善案があれば、ぜひ共有してください。