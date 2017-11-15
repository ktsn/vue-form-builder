# vue-form-builder

Provide terse form builder for Vue.js

## Example

Bind your data with a form via `v-model` attribute of `<form-for>` component.
The bound model properties will sync with input elements that belong with `<form-for>`.

You can bind a model property and an input element with `for` attribute which has the property name of the model.

For example, if you bind a property `user.name` with a text input, you use `<text-field>` component with `for="name"` attribute:

```vue
<template>
  <form-for v-model="user" name="user">
    <text-field for="name"></text-field>
    <p>{{ user.name }}</p>
  </form-for>
</template>

<script>
export default {
  data () {
    return {
      user: {
        name: ''
      }
    }
  }
}
</script>
```

## Reference

The following is all available components:

- `<form-for>`
- `<text-field>`
- `<number-field>`
- `<email-field>`
- `<url-field>`
- `<tel-field>`
- `<search-field>`
- `<password-field>`
- `<month-field>`
- `<week-field>`
- `<datetime-field>`
- `<datetime-local-field>`
- `<date-field>`
- `<time-field>`
- `<color-field>`
- `<range-field>`
- `<hidden-field>`
- `<radio-button>`
- `<check-box>`
- `<select-field>`
- `<text-area>`
- `<field-label>`

## License

MIT
