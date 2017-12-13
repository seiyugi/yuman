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
    query = 'nature,water'
  } = {}) {
    let request = new Request(`${endpoint}/?${query}`);
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
    let { imageUrl } = await this.getBackgroundImage();
    this.element.background.classList.add('loaded');
    this.element.background.style.backgroundImage = `url('${imageUrl}')`;
  }
}

window.addEventListener('load', () => {
  let newTab = new NewTab();
});
