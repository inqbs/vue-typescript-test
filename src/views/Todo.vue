<template>
  <div>
    <div class="border-t border-b bg-gray-200 p-4">
      <div class="container mx-auto flex">
        <input
          type="text"
          class="flex-grow mr-3 px-5 py-2"
          v-model="input"
        >
        <button
          class="bg-primary px-5 py-2  bg-blue-400 text-white "
          @click.stop="add"
        >add</button>
      </div>
    </div>
    <div class="container mx-auto my-4">
      <ul>
        <li
          v-for="(todo, idx) in sortedTodoList"
          :key="`todo-${todo.idx}`"
          class="flex items-center p-3 border-b"
          :class="{'border-t': idx === 0}"
        >
          <div class="flex-grow">
            <input
              type="checkbox"
              :name="`item`"
              :id="`item-${todo.idx}`"
              :value="todo.isOver"
              class="form-checkbox border-gray-300 text-blue-600 focus:ring focus:ring:opacity-50 focus:ring-offset-0 focus:ring-blue-300 mr-3"
              @change="check(todo.idx)"
            >
            <label
              :for="`item-${todo.idx}`"
              class="text-black"
              :class="{
                'line-through text-opacity-50': todo.isOver,
              }"
            >{{todo.msg}}</label>
          </div>
          <div>
            <button
              v-if="todo.isOver"
              class="bg-red-400 text-white px-5 py-2 "
              @click="deleteItem(todo.idx)"
            >Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { ActionMethod } from 'vuex'
import { namespace } from 'vuex-class'

const TodoStore = namespace('todo')

@Component
export default class extends Vue {
  input = ''

  @TodoStore.Getter('sortedTodoList') sortedTodoList!: Array<unknown>
  @TodoStore.Action('addTodo') addTodo!: ActionMethod
  @TodoStore.Action('checkTodo') checkTodo!: ActionMethod
  @TodoStore.Action('deleteTodo') deleteTodo!: ActionMethod

  add () {
    this.addTodo(this.input)
    this.input = ''
  }

  check (idx: number) {
    this.checkTodo(idx)
  }

  deleteItem (idx: number) {
    this.deleteTodo(idx)
  }
}
</script>
