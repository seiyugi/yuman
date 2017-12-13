class Preferences {
  static saveOptions(event) {
    chrome.storage.local.set({
      searchKeyword: document.querySelector('#search-keyword').value
    });
  }

  static loadOptions() {
    chrome.storage.local.get((result) => {
      document.querySelector('#search-keyword').value = result.queryKeywords || 'nature,water,cat';
    });
  }
}

document.addEventListener('DOMContentLoaded', Preferences.loadOptions);
document.querySelector('#saveOptions').addEventListener('click', Preferences.saveOptions);
