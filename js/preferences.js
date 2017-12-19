class Preferences {
  static savePreferences(event) {
    document.querySelector('.saveStatus').classList.add('show');
    chrome.storage.local.get((result) => {
      Object.keys(result).filter((key) => {
        return key.endsWith('yuman-prefetch-v1');
      }).forEach((key) => {
        chrome.storage.local.remove(key);
      });
    });
    chrome.storage.local.set({
      searchKeyword: document.querySelector('#search-keyword').value,
      searchOrientation: document.querySelector('input[name="radio-orientation"]:checked').value,
      imageMotion: document.querySelector('input[name="radio-motion"]:checked').value,
    }, () => {
      window.setTimeout(() => {
        document.querySelector('.saveStatus').classList.remove('show');
      }, 1000);
    });
  }

  static loadPreferences() {
    chrome.storage.local.get(['searchKeyword', 'searchOrientation', 'imageMotion'], (result) => {
      if (result.searchKeyword) {
        document.querySelector('#search-keyword').value = result.searchKeyword;
      } else {
        let defaultSearchKeyword = 'nature,water,cat';
        chrome.storage.local.set({ searchKeyword: defaultSearchKeyword });
        document.querySelector('#search-keyword').value = defaultSearchKeyword;
      }

      if (result.searchOrientation) {
        document.querySelector(`#radio-orientation-${result.searchOrientation}`).checked = true;
      } else {
        let defaultSearchOrientation = 'landscape';
        chrome.storage.local.set({ searchOrientation: defaultSearchOrientation });
        document.querySelector(`#radio-orientation-${defaultSearchOrientation}`).checked = true;
      }

      if (result.imageMotion) {
        document.querySelector(`#radio-motion-${result.imageMotion}`).checked = true;
      } else {
        let defaultImageMotion = 'enable';
        chrome.storage.local.set({ imageMotion: defaultImageMotion });
        document.querySelector(`#radio-motion-${defaultImageMotion}`).checked = true;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', Preferences.loadPreferences);
document.querySelector('#savePreferences').addEventListener('click', Preferences.savePreferences);
