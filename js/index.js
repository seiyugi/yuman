class NewTab {
  constructor({
    backgroundContainer = document.querySelector('.background')
  } = {}) {
    this.element = {
      background: backgroundContainer
    };
    this.updateBackgroundImage();
  }

  getBackgroundImage({
    endpoint = 'https://source.unsplash.com/random',
    searchKeyword = 'nature,water,cat'
  } = {}) {
    let request = new Request(`${endpoint}/?${searchKeyword}`);
    return fetch(request, { mode: 'cors', cache: 'default' })
      .then((resp) => {
        return { imageUrl: resp.url };
      })
      .catch((err) => {
        console.error(err);
        return { imageUrl: 'https://source.unsplash.com/random'};
      });
  }

  async updateBackgroundImage() {
    let { searchKeyword } = await this.getPreference();
    let { imageUrl } = await this.getBackgroundImage({ searchKeyword });
    this.element.background.classList.add('loaded');
    this.element.background.style.backgroundImage = `url('${imageUrl}')`;
  }

  getPreference() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get((result) => {
        resolve(result);
      });
    });
  }
}

window.addEventListener('load', () => {
  let newTab = new NewTab();
});
