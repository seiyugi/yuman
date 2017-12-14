class Preferences {
  static saveOptions(event) {
    document.querySelector('.saveStatus').classList.add('show');
    chrome.storage.local.get((result) => {
      Object.keys(result).filter((key) => {
        return key.endsWith('yuman-prefetch-v1');
      }).forEach((key) => {
        chrome.storage.local.remove(key);
      });
    });
    chrome.storage.local.set({
      searchKeyword: document.querySelector('#search-keyword').value
    }, () => {
      window.setTimeout(() => {
        document.querySelector('.saveStatus').classList.remove('show');
      }, 1000);
    });
  }

  static loadOptions() {
    chrome.storage.local.get('searchKeyword', (result) => {
      if (result.searchKeyword) {
        document.querySelector('#search-keyword').value = result.searchKeyword;
      } else {
        let defaultSearchKeyword = 'nature,water,cat';
        chrome.storage.local.set({ searchKeyword: defaultSearchKeyword });
        document.querySelector('#search-keyword').value = defaultSearchKeyword;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', Preferences.loadOptions);
document.querySelector('#saveOptions').addEventListener('click', Preferences.saveOptions);
