import { createApp } from 'vue';

console.log("i work");

const app = createApp({
  data() {
    return {
      image: "hello"
    };
  }
});

app.mount('#app');
