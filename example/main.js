import Vue from 'vue'
import FormBuilder from '../'

Vue.use(FormBuilder)

new Vue({
  el: '#app',

  data: {
    formData: {
      name: 'vue-form-builder'
    }
  }
})