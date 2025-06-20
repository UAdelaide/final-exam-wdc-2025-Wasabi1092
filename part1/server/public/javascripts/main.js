import { createApp, ref } from 'vue';


let url = (async() => {
  let response = await fetch("https://dog.ceo/api/breeds/image/random");
  let object = await response.json();
})()


const app = createApp({
  setup() {
    return {
      image: object.message
    };
  }
});

app.mount('#app');
