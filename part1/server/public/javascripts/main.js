import { createApp, ref } from 'vue';

createApp({
  setup() {
    fetch("https://dog.ceo/api/breeds/image/random").then((response) => {
      response.json().then(())
    })
  }
}).mount('#app');
