/* global api */

import Vue from 'vue';
import './css/api.css';
import './style.css';

const App = new Vue({
  el: '#app',
  data: {
    msg: 'Hello Vue!',
  },
  methods: {
    toFoo() {
      api.openWin({
        name: 'Foo',
        url: '/pages/foo/',
      });
    },
  },
});

export default App;
