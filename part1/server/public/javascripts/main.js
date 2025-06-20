import { createApp, ref } from 'vue';

const app = createApp({
  async setup() {
    let response = await fetch("https://dog.ceo/api/breeds/image/random");
    let object = await response.json();
    return {
      image: object.message
    };
  }
});

app.mount('#app');
