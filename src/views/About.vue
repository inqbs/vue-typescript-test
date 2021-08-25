<template>
  <div class="about">
    <h1>This is an captcha page</h1>
    <CaptchaComp
      :width="480"
      :height="240"
      :enckey="enckey"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import CaptchaComp from '@/components/CaptchaComp.vue'

@Component({
  components: {
    CaptchaComp
  }
})
export default class AboutView extends Vue {
  enckey = 'test'
}
</script>
