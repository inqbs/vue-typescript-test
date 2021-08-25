<template>
  <div id="app">
    <div class="header">
      <nav class="bg-white py-2 md:py-4">
        <div class="container px-4 mx-auto md:flex md:items-center">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link> |
          <router-link to="/todo">Todo</router-link>
        </div>
      </nav>
    </div>
    <main>
      <router-view />
    </main>
  </div>
</template>
