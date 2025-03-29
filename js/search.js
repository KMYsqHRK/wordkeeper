// 検索機能の実装
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
  
    // 検索ボタンのクリックイベント
    searchButton.addEventListener('click', () => {
      performSearch();
    });
  
    // Enterキーでも検索可能に
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  
    // 検索処理
    function performSearch() {
      const searchTerm = searchInput.value.trim();
      app.currentFilter.search = searchTerm;
      app.currentPage = 1;
      app.renderWords();
    }
  
    // 検索ボックスの入力が変わったら検索候補を表示（オプション機能）
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // 3文字以上入力されたら自動検索
        if (searchInput.value.trim().length >= 3) {
          performSearch();
        }
        // 空になったら検索条件をクリア
        else if (searchInput.value.trim() === '' && app.currentFilter.search !== '') {
          app.currentFilter.search = '';
          app.renderWords();
        }
      }, 300);
    });
  });
  
  // 単語の追加方法案内
  document.addEventListener('DOMContentLoaded', () => {
    // GitHubの情報を設定（リポジトリURLを設定）
    const repoLink = document.querySelector('a[href*="github.com"]');
    repoLink.href = 'https://github.com/KMYsqHRK/wordkeeper';
    
    // モバイルでのUX改善
    if (window.innerWidth <= 768) {
      app.itemsPerPage = 5; // モバイルではページあたりの単語数を減らす
    }
  });