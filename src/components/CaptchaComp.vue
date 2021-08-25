<template>
  <div>
    <canvas
      id="canvas"
      ref="captcha"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import CryptoES from 'crypto-es'
import * as PIXI from 'pixi.js'

import Chance from 'chance'
const chance = new Chance(Math.random)

@Component
export default class CaptchaComp extends Vue {
  @Prop({ required: true }) readonly width!: number;
  @Prop({ required: true }) readonly height!: number;
  @Prop({ default: 0xfafafa }) readonly backgroundColor!: number;
  @Prop({ required: true }) readonly enckey!: string;

  key!: string;
  app!: PIXI.Application;

  async mounted () {
    PIXI.utils.skipHello()
    const app = await this.init()
    this.generate(app)
    this.app = app
  }

  //  캡차용 canvas 정의
  init () {
    const captcha = this.$refs.captcha as HTMLCanvasElement
    const app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
      backgroundAlpha: 1,
      view: captcha
    })
    return Promise.resolve(app)
  }

  //  canvas 초기화
  resetCanvas (app = this.app) {
    // eslint-disable-next-line no-unused-expressions
    app?.stage?.removeChildren()
  }

  //  캡차 생성
  generateKey (length: number) {
    const isOdd = length % 2 === 1
    const target = Math.floor(length / 2)

    const keyArray = []
    const keyOption = { min: 0, max: 9 }
    keyArray.push(chance.unique(chance.natural, target, keyOption).join(''))
    keyArray.push(chance.unique(chance.natural, target, keyOption).join(''))
    if (isOdd) {
      keyArray.push(chance.natural(keyOption))
    }

    return chance.shuffle(keyArray).join('')
  }

  generate (app = this.app) {
    this.resetCanvas(app)

    const key = this.generateKey(6)
    this.draw(app, key)
    this.key = this.encrypt(key)

    return key
  }

  //  랜덤 색상 생성
  generateRandomColor (options: Chance.Options | undefined) {
    return chance.color({
      min: 5,
      max: 220,
      ...options
    })
  }

  //  canvas에 수치 반영
  draw (app: PIXI.Application, val: string) {
    this.drawText(app, val)
    this.drawLine(app)
    this.drawPoint(app)
  }

  drawText (app: PIXI.Application, val: string) {
    const width = this.width
    const height = this.height

    val
      .split('')
      .map((text: string) => ({
        text,
        style: new PIXI.TextStyle({
          fontFamily: [
            'Lucida Sans Unicode',
            'Lucida Grande',
            'Arial',
            'sans-serif'
          ],
          fontSize: chance.integer({
            min: width / 6 - 12,
            max: width / 6 + 12
          }),
          fill: this.generateRandomColor({ format: '0x' })
        })
      }))
      .map(({ text, style }) => new PIXI.Text(text, style))
      .map((text: PIXI.Text) => {
        text.anchor.set(0.5, 0.5)
        const skewX =
          (chance.integer({ min: -30, max: -10 }) / 100) *
          (chance.bool() ? -1 : 1)
        const skewY = chance.integer({ min: -20, max: -7 }) / 100
        text.skew.set(skewX, skewY)
        return text
      })
      .map((text: PIXI.Text, idx: number, array: PIXI.Text[]) => {
        const prevItem = array[idx - 1]
        text.x = prevItem
          ? prevItem.x +
          chance.integer({
            min: width / 6 - 8,
            max: width / 6
          })
          : chance.integer({
            min: width / 12,
            max: width / 12 + 10
          })
        text.y = chance.integer({
          min: height / 2 - 15,
          max: height / 2 + 15
        })
        return text
      })
      .forEach((text: PIXI.Text) => app?.stage?.addChild(text))
  }

  drawLine (app: PIXI.Application) {
    const width = this.width
    const height = this.height

    const lineCnt = chance.integer({ min: 4, max: 6 })
    Array(lineCnt)
      .fill(null)
      .map(() => new PIXI.Graphics())
      .map((path) => {
        const color = this.generateRandomColor({ format: 'hex' })
        const hexValue = parseInt(`0x${color.substring(1)}`, 16)

        const lineSize = (height / 180) * chance.integer({ min: 1, max: 3 })
        path.lineStyle(lineSize, hexValue, 1)
        return path
      })
      .map((path, idx) => {
        const y1 = chance.integer({ min: 0, max: (height * 5) / 6 })
        const y2 = chance.integer({
          min: height / 6,
          max: height
        })
        const trigger = !!(idx % 2)
        if (trigger) {
          path.moveTo(0, y1)
          path.lineTo(width, y2)
        } else {
          path.moveTo(0, y2)
          path.lineTo(width, y1)
        }
        return path
      })
      .forEach((path) => app?.stage?.addChild(path))
  }

  drawPoint (app: PIXI.Application) {
    const width = this.width
    const height = this.height

    const pointCnt = chance.integer({ min: 15, max: 25 })
    Array(pointCnt)
      .fill(null)
      .map(() => new PIXI.Graphics())
      .map((path) => {
        const color = this.generateRandomColor({ format: 'hex' })
        const hexValue = parseInt(`0x${color.substring(1)}`, 16)
        path.beginFill(hexValue)
        return path
      })
      .map((path) => {
        const targetSize = Math.floor((width * height) / 14400)
        const lineSize = chance.integer({
          min: targetSize - 5,
          max: targetSize
        })

        const x = chance.integer({ min: 0, max: width })
        const y = chance.integer({ min: 0, max: height })
        path.drawCircle(x, y, lineSize)
        path.endFill()
        return path
      })
      .forEach((path) => app?.stage?.addChild(path))
  }

  //  사이즈 조정
  resize () {
    const app = this.app
    if (!app) return

    app.renderer.resize(this.width, this.height)

    this.generate()
  }

  //  암호화
  encrypt (key: string | CryptoES.lib.WordArray | undefined) {
    const hash = CryptoES.HmacSHA256(key, this.enckey)
    return CryptoES.enc.Base64.stringify(hash)
  }

  //  값검증
  //  컴포넌트를 참조(ref)로 불러 실행
  validate (val: string) {
    const hashInput = this.encrypt(val)
    return this.key === hashInput
  }

  @Watch('width')
  @Watch('height')
  onSizeChange () {
    this.$nextTick().then(() => this.resize())
  }
}
</script>

<style scoped></style>
