class NewTab {
  constructor({
    backgroundContainer = document.querySelector('.background'),
    backgroundInfoContainer = document.querySelector('.background-info-link'),
  } = {}) {
    this.element = {
      background: backgroundContainer,
      backgroundInfo: backgroundInfoContainer,
    };
    this.prefetchPostfix = 'yuman-prefetch-v1';
    this.prefetchListing = this.prefetchListing.bind(this);
    this.updateBackgroundImage();
  }

  async updateBackgroundImage() {
    let dailyImages = await this.getDailyListing();
    let image = dailyImages[Math.floor(Math.random() * dailyImages.length)];

    this.element.background.classList.add('loaded');
    this.element.background.style.backgroundImage = `url('${image.urls.regular}')`;
    this.element.backgroundInfo.href = `${image.user.links.html}?utm_source=yuman_chrome_extension&utm_medium=referral`;
    this.element.backgroundInfo.textContent = `${image.user.name} / Unsplash`;
    window.requestIdleCallback(this.prefetchListing, { timeout: 1000 });
  }

  getDailyUniqueId() {
    // Get timestamp for today and yesterday's 00:00:00
    let today = Date.parse(new Date().toDateString());
    let yesterday = (today - 86400000);
    let postfix = this.prefetchPostfix;
    return {
      uidToday: `${today.toString(36)}-${postfix}`,
      uidYesterday: `${yesterday.toString(36)}-${postfix}`
    };
  }

  getDailyListing() {
    let { uidToday, uidYesterday } = this.getDailyUniqueId();
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([uidToday, uidYesterday], async (result) => {
        if (result[uidToday]) {
          resolve(result[uidToday].list);
        } else {
          let useNewListing = true;
          if (result[uidYesterday]) {
            useNewListing = false;
            resolve(result[uidYesterday].list);
          }
          let list = await this.fetchNewListing({ uid: uidToday });
          chrome.storage.local.set({ [uidToday]: { prefetched: [], list } });
          useNewListing && resolve(list);
        }
        result[uidYesterday] && this.removeExpiredListing();
      });
    });
  }

  async fetchNewListing({
    fallbackData = [
      { "id": "cWOzOnSoh6Q", "color": "#FADFC9", "urls": { "raw": "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6", "full": "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=e12a6a9d085f220f14e134d1353b77a2", "regular": "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=59286c03c919f402f4c5119fdbae385b", "small": "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&s=96212622ffb7186d14f65748393cd2f9", "thumb": "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=27403b3f88e194bf108787a2a3d23164" }, "links": { "html": "https://unsplash.com/photos/cWOzOnSoh6Q", "download": "https://unsplash.com/photos/cWOzOnSoh6Q/download", "download_location": "api.unsplash.com/photos/cWOzOnSoh6Q/download" }, "user": { "links": { "html": "https://unsplash.com/@pactovisual" }, "name": "Pacto Visual" } }
    ],
    cid = '797b6d75b81b6d17621bb0fad6c03db647182457de78e063e33806a5b273ce35',
  } = {}) {
    let searchKeyword = await this.getSearchKeyword();
    let queryParameters = [
      'count=15',
      `query=${searchKeyword}`
    ].join('&');
    let apiEndpoint = 'https://api.unsplash.com/photos/random';
    let request = new Request(`${apiEndpoint}/?${queryParameters}`);
    request.headers.append('Authorization', `Client-ID ${cid}`);

    return fetch(request)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error(`${resp.status} ${resp.statusText}`);
        }
      })
      .catch((err) => {
        console.error(err);
        return fallbackData;
      });
  }

  async prefetchListing() {
    let { uidToday } = this.getDailyUniqueId();
    chrome.storage.local.get(uidToday, (result) => {
      let prefetched = [];
      let daily = result[uidToday];
      if (!daily || !daily.list || daily.prefetched.length >= daily.list.length) return;
      Promise.all(daily.list.map((item, index) => {
        if (daily.prefetched.includes(index)) return Promise.resolve();
        return fetch(item.urls.regular)
          .then(prefetched.push(index))
          .catch((err) => {
            console.error(`Error prefetching ${item.urls.regular}:`, err);
          });
      })).then(() => {
        chrome.storage.local.set({
          [uidToday]: { prefetched, list: daily.list }
        });
      });
    });
  }

  removeExpiredListing({ removeAll = false } = {}) {
    let { uidToday } = this.getDailyUniqueId();
    chrome.storage.local.get((result) => {
      Object.keys(result).filter((key) => {
        return removeAll ?
          key.endsWith(this.prefetchPostfix) :
          key.endsWith(this.prefetchPostfix) && key !== uidToday;
      }).forEach((key) => {
        chrome.storage.local.remove(key);
      });
    });
  }

  getSearchKeyword() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('searchKeyword', (result) => {
        if (result.searchKeyword) {
          resolve(result.searchKeyword)
        } else {
          let defaultSearchKeyword = 'nature,water,cat';
          chrome.storage.local.set({ searchKeyword: defaultSearchKeyword });
          resolve(defaultSearchKeyword);
        }
      });
    });
  }
}

window.addEventListener('load', () => {
  let newTab = new NewTab();
});
