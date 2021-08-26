import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

interface Todo {
  idx: number
  isOver: boolean
  msg: string,
  date: Date,
}

@Module({
  namespaced: true
})
export default class TodoStore extends VuexModule {
  todoList: Array<Todo> = []

  //  get todo list sorted by checked item first
  get sortedTodoList () {
    return [...this.todoList].sort((a, b) => a.isOver !== b.isOver ? (+!!b.isOver) - (+!!a.isOver) : a.date.getTime() - b.date.getTime())
  }

  /* vuex-store action */

  //  add todo item
  @Action({ commit: 'ADD_TODO' })
  addTodo (msg: string) {
    return msg
  }

  //  mark as checked to todo item
  @Action({ commit: 'CHECK_TODO' })
  checkTodo (idx: number) {
    return idx
  }

  //  delete todo item
  @Action({ commit: 'DELETE_TODO' })
  deleteTodo (idx: number) {
    return idx
  }

  /* vuex-store mutation */
  @Mutation
  ADD_TODO (msg: string) {
    const todoList: Array<Todo> = this.todoList
    todoList.push({
      idx: todoList.map(it => it.idx).reduce((a, b) => Math.max(a, b), 0) + 1,
      isOver: false,
      msg,
      date: new Date()
    })
  }

  @Mutation
  CHECK_TODO (idx: number) {
    const target = this.todoList.find((it: Todo) => it.idx === idx)
    if (!target) return

    target.isOver = !target.isOver
  }

  @Mutation
  DELETE_TODO (idx: number) {
    const todoList:Array<Todo> = this.todoList
    this.todoList = todoList.filter(it => it.idx !== idx)
  }
}
