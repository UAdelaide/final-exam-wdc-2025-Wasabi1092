import { createApp } from 'vue';


let url = (async() => {
  let response = await fetch("https://dog.ceo/api/breeds/image/random");
  let object = await response.json();
  return object.message;
})();

console.log(url);
const app = createApp({
  setup() {
    return {
      image: url
    };
  }
});

app.mount('#app');
