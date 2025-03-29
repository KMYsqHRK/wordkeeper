const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

// ディレクトリパス
const wordsDir = path.join(process.cwd(), '_words');
const dataDir = path.join(process.cwd(), 'data');

// カテゴリデータ（存在しない場合は作成）
const categoriesPath = path.join(dataDir, 'categories.json');
let categories = [];

// カテゴリファイルがすでに存在すれば読み込む
if (fs.existsSync(categoriesPath)) {
  categories = fs.readJsonSync(categoriesPath);
}

// 単語一覧を格納する配列
const words = [];

// _wordsディレクトリからマークダウンファイルを読み込む
fs.ensureDirSync(wordsDir);
const files = fs.readdirSync(wordsDir);

files.forEach(file => {
  if (!file.endsWith('.md')) return;

  const filePath = path.join(wordsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // front-matterを解析
  const { data, content: wordContent } = matter(content);
  
  // ファイル名から日付を抽出（YYYY-MM-DD-word.md 形式）
  const fileName = path.basename(file, '.md');
  const dateParts = fileName.split('-');
  let date = null;
  
  if (dateParts.length >= 3) {
    // ファイル名から日付を抽出
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // 月は0から始まる
    const day = parseInt(dateParts[2]);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      date = new Date(year, month, day).toISOString().split('T')[0];
    }
  }
  
  // 日付がない場合はフロントマターを確認、それもなければファイルのタイムスタンプを使用
  if (!date && data.date) {
    date = new Date(data.date).toISOString().split('T')[0];
  } else if (!date) {
    const stats = fs.statSync(filePath);
    date = new Date(stats.birthtime).toISOString().split('T')[0];
  }
  
  // カテゴリの処理
  if (data.categories && Array.isArray(data.categories)) {
    data.categories.forEach(category => {
      // カテゴリIDを生成（スペースをハイフンに、小文字に）
      const categoryId = category.toLowerCase().replace(/\s+/g, '-');
      
      // カテゴリが存在しなければ追加
      if (!categories.find(c => c.id === categoryId)) {
        // カテゴリごとに異なる色を生成
        const hue = Math.floor(Math.random() * 360);
        const color = `hsla(${hue}, 70%, 60%, 0.2)`;
        
        categories.push({
          id: categoryId,
          name: category,
          color: color
        });
      }
    });
    
    // カテゴリをIDに変換
    data.categories = data.categories.map(category => 
      category.toLowerCase().replace(/\s+/g, '-')
    );
  }
  
  // 例文の処理
  const examples = [];
  const exampleRegex = /- (.*?)(?:\n\s+- (.*))?/g;
  let match;
  
  if (wordContent) {
    // 例文セクションを探す
    const exampleSection = wordContent.match(/## 例文\n\n([\s\S]*?)(?:\n\n|$)/);
    
    if (exampleSection) {
      const exampleContent = exampleSection[1];
      while ((match = exampleRegex.exec(exampleContent)) !== null) {
        examples.push({
          text: match[1].trim(),
          translation: match[2] ? match[2].trim() : ''
        });
      }
    }
    
    // メモセクションを探す
    const noteSection = wordContent.match(/## メモ\n\n([\s\S]*?)(?:\n\n|$)/);
    if (noteSection) {
      data.note = noteSection[1].trim();
    }
  }
  
  // 単語データを作成
  const wordData = {
    word: data.word,
    pronunciation: data.pronunciation || '',
    part_of_speech: data.part_of_speech || '',
    meaning: data.meaning || '',
    categories: data.categories || [],
    examples: examples,
    note: data.note || '',
    date: date
  };
  
  words.push(wordData);
});

// カテゴリと単語データをJSON形式で保存
fs.outputJsonSync(path.join(dataDir, 'categories.json'), categories, { spaces: 2 });
fs.outputJsonSync(path.join(dataDir, 'words.json'), words, { spaces: 2 });

console.log(`${words.length} words processed and saved to data/words.json`);
console.log(`${categories.length} categories saved to data/categories.json`);