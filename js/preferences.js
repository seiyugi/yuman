class Preferences {
  static saveOptions(event) {
    chrome.storage.local.get((result) => {
      Object.keys(result).filter((key) => {
        return key.endsWith('yuman-prefetch-v1');
      }).forEach((key) => {
        chrome.storage.local.remove(key);
      });
    });
    chrome.storage.local.set({
      searchKeyword: document.querySelector('#search-keyword').value
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
