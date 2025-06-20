import { createApp, ref } from 'vue';


(async())
let response = await fetch("https://dog.ceo/api/breeds/image/random");
let object = await response.json();
console.log(object.message);

const app = createApp({
  setup() {
    return {
      image: object.message
    };
  }
});

app.mount('#app');
