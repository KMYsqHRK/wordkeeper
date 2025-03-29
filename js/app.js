// 単語データとアプリの状態管理
const app = {
    words: [],
    categories: [],
    currentPage: 1,
    itemsPerPage: 10,
    currentView: 'list',
    currentFilter: {
      category: '',
      search: ''
    },
    currentSort: 'date-desc',
  
    // 初期化
    async init() {
      try {
        // データのロード
        const [words, categories] = await Promise.all([
          this.fetchData('data/words.json'),
          this.fetchData('data/categories.json')
        ]);
  
        this.words = words;
        this.categories = categories;
  
        // カテゴリフィルターの設定
        this.setupCategoryFilter();
        
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // 統計情報の表示
        this.updateStats();
        
        // 初期表示
        this.renderWords();
      } catch (error) {
        console.error('初期化エラー:', error);
        alert('データの読み込みに失敗しました。ページを再読み込みしてください。');
      }
    },
  
    // JSONデータの取得
    async fetchData(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
  
    // カテゴリフィルターの設定
    setupCategoryFilter() {
      const categoryFilter = document.getElementById('category-filter');
      
      // 既存のオプションをクリア（デフォルトのすべてのカテゴリは残す）
      while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
      }
      
      // カテゴリのオプションを追加
      this.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
      });
    },
  
    // イベントリスナーの設定
    setupEventListeners() {
      // カテゴリフィルター
      document.getElementById('category-filter').addEventListener('change', e => {
        this.currentFilter.category = e.target.value;
        this.currentPage = 1;
        this.renderWords();
      });
  
      // ソート
      document.getElementById('sort-by').addEventListener('change', e => {
        this.currentSort = e.target.value;
        this.renderWords();
      });
  
      // ビュー切り替え
      document.getElementById('list-view').addEventListener('click', () => this.changeView('list'));
      document.getElementById('card-view').addEventListener('click', () => this.changeView('card'));
  
      // ページネーション
      document.getElementById('prev-page').addEventListener('click', () => this.changePage(-1));
      document.getElementById('next-page').addEventListener('click', () => this.changePage(1));
  
      // モーダルを閉じる
      document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('word-modal').style.display = 'none';
      });
  
      // モーダルの外をクリックしたら閉じる
      window.addEventListener('click', e => {
        const modal = document.getElementById('word-modal');
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    },
  
    // ビュー切り替え
    changeView(view) {
      this.currentView = view;
      
      // アクティブクラスの切り替え
      document.getElementById('list-view').classList.toggle('active', view === 'list');
      document.getElementById('card-view').classList.toggle('active', view === 'card');
      
      // コンテナのクラス切り替え
      const container = document.getElementById('words-container');
      container.className = view + '-view';
      
      this.renderWords();
    },
  
    // ページの切り替え
    changePage(direction) {
      this.currentPage += direction;
      this.renderWords();
      
      // ページトップにスクロール
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
  
    // 単語データのフィルタリング
    filterWords() {
      let filtered = [...this.words];
      
      // カテゴリでフィルタリング
      if (this.currentFilter.category) {
        filtered = filtered.filter(word => 
          word.categories.includes(this.currentFilter.category)
        );
      }
      
      // 検索語でフィルタリング
      if (this.currentFilter.search) {
        const searchLower = this.currentFilter.search.toLowerCase();
        filtered = filtered.filter(word => 
          word.word.toLowerCase().includes(searchLower) ||
          word.meaning.toLowerCase().includes(searchLower) ||
          (word.example && word.example.toLowerCase().includes(searchLower))
        );
      }
      
      return filtered;
    },
  
    // 単語データのソート
    sortWords(words) {
      return [...words].sort((a, b) => {
        switch (this.currentSort) {
          case 'date-desc':
            return new Date(b.date) - new Date(a.date);
          case 'date-asc':
            return new Date(a.date) - new Date(b.date);
          case 'alpha-asc':
            return a.word.localeCompare(b.word);
          default:
            return 0;
        }
      });
    },
  
    // 統計情報の更新
    updateStats() {
      const totalCount = this.words.length;
      document.getElementById('total-count').textContent = totalCount;
      
      // 今月の単語数をカウント
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const monthCount = this.words.filter(word => {
        const wordDate = new Date(word.date);
        return wordDate.getFullYear() === now.getFullYear() && 
               wordDate.getMonth() === now.getMonth();
      }).length;
      
      document.getElementById('month-count').textContent = monthCount;
      
      // トレンドチャートの描画
      this.renderTrendChart();
    },
  
    // トレンドチャートの描画
    renderTrendChart() {
      const chartContainer = document.getElementById('trend-chart');
      chartContainer.innerHTML = '';
      
      // 過去6ヶ月のデータを取得
      const months = [];
      const counts = [];
      
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.unshift(yearMonth);
        
        const count = this.words.filter(word => {
          const wordDate = new Date(word.date);
          return wordDate.getFullYear() === date.getFullYear() && 
                 wordDate.getMonth() === date.getMonth();
        }).length;
        
        counts.unshift(count);
      }
      
      // 最大値を計算
      const maxCount = Math.max(...counts, 1);
      
      // チャートバーを描画
      counts.forEach(count => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        
        // 高さを設定（最大を100%として比率で計算）
        const heightPercent = (count / maxCount) * 100;
        bar.style.height = `${heightPercent}%`;
        
        chartContainer.appendChild(bar);
      });
    },
  
    // 単語リストの表示
    renderWords() {
      const container = document.getElementById('words-container');
      container.innerHTML = '';
      
      // フィルタリングとソート
      const filtered = this.filterWords();
      const sorted = this.sortWords(filtered);
      
      // ページネーション
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const paginatedWords = sorted.slice(startIndex, endIndex);
      
      // 表示する単語がない場合
      if (paginatedWords.length === 0) {
        document.getElementById('no-results').style.display = 'block';
        document.getElementById('prev-page').disabled = true;
        document.getElementById('next-page').disabled = true;
        document.getElementById('page-info').textContent = '0 / 0';
        return;
      }
      
      document.getElementById('no-results').style.display = 'none';
      
      // テンプレートを使って単語カードを作成
      const template = document.getElementById('word-card-template');
      
      paginatedWords.forEach(word => {
        const clone = document.importNode(template.content, true);
        
        // 単語データをカードに設定
        clone.querySelector('.word-title').textContent = word.word;
        clone.querySelector('.pronunciation').textContent = word.pronunciation || '';
        clone.querySelector('.part-of-speech').textContent = word.part_of_speech || '';
        clone.querySelector('.word-meaning').textContent = word.meaning;
        
        // カテゴリタグの設定
        const categoriesContainer = clone.querySelector('.word-categories');
        if (word.categories && word.categories.length > 0) {
          word.categories.forEach(catId => {
            const category = this.categories.find(c => c.id === catId);
            if (category) {
              const tag = document.createElement('span');
              tag.className = 'category-tag';
              tag.textContent = category.name;
              tag.style.backgroundColor = category.color || 'rgba(58, 134, 255, 0.1)';
              categoriesContainer.appendChild(tag);
            }
          });
        }
        
        // 日付の設定
        const date = new Date(word.date);
        clone.querySelector('.word-date').textContent = date.toLocaleDateString('ja-JP');
        
        // 詳細ボタンのイベント設定
        const detailsBtn = clone.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => this.showWordDetails(word));
        
        container.appendChild(clone);
      });
      
      // ページネーション情報を更新
      this.updatePagination(filtered.length);
    },
  
    // ページネーション情報の更新
    updatePagination(totalItems) {
      const totalPages = Math.ceil(totalItems / this.itemsPerPage);
      
      document.getElementById('page-info').textContent = `${this.currentPage} / ${totalPages}`;
      document.getElementById('prev-page').disabled = this.currentPage <= 1;
      document.getElementById('next-page').disabled = this.currentPage >= totalPages;
    },
  
    // 単語詳細の表示
    showWordDetails(word) {
      const modalContent = document.getElementById('modal-word-content');
      
      // モーダルの内容を設定
      let html = `
        <h2>${word.word}</h2>
        <div class="word-detail-header">
          <span class="pronunciation">${word.pronunciation || ''}</span>
          <span class="part-of-speech">${word.part_of_speech || ''}</span>
        </div>
        <div class="word-meaning-large">${word.meaning}</div>
      `;
      
      // カテゴリの表示
      if (word.categories && word.categories.length > 0) {
        html += '<div class="word-categories">';
        word.categories.forEach(catId => {
          const category = this.categories.find(c => c.id === catId);
          if (category) {
            html += `<span class="category-tag" style="background-color: ${category.color || 'rgba(58, 134, 255, 0.1)'}">${category.name}</span>`;
          }
        });
        html += '</div>';
      }
      
      // 例文の表示
      if (word.examples && word.examples.length > 0) {
        html += '<div class="examples-section"><h3>例文</h3><ul>';
        word.examples.forEach(example => {
          html += `<li>
            <p class="example-text">${example.text}</p>
            <p class="example-translation">${example.translation || ''}</p>
          </li>`;
        });
        html += '</ul></div>';
      }
      
      // メモの表示
      if (word.note) {
        html += `<div class="note-section">
          <h3>メモ</h3>
          <p>${word.note}</p>
        </div>`;
      }
      
      // 追加日の表示
      const date = new Date(word.date);
      html += `<div class="word-date-detail">追加日: ${date.toLocaleDateString('ja-JP')}</div>`;
      
      modalContent.innerHTML = html;
      
      // モーダルを表示
      document.getElementById('word-modal').style.display = 'block';
    }
  };