<template>
  <div>
    <div class="border-t border-b bg-gray-200 p-4">
      <div class="container mx-auto flex">
        <input
          type="text"
          class="border flex-grow mr-3 px-5 py-2 appearance-none"
        >
        <button class="bg-primary px-5 py-2  bg-blue-400 text-white ">add</button>
      </div>
    </div>
    <div class="container mx-auto my-4">
      <ul>
        <li class="flex items-center p-3 border-t border-b">
          <div class="flex-grow">
            <input
              type="checkbox"
              name="item"
              id="item"
              class="mr-3"
            >
            <label for="item">test</label>
          </div>
          <div>
            <button class="bg-red-400 text-white px-5 py-2 ">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {}
</script>

<style scoped lang="scss"></style>
