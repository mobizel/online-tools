<template>
  <div class="container">
    <div>
      <h1 class="title">
        Color with opacity
      </h1>
      <h2 class="subtitle">
        A tool to have various representations of a color/alpha pair
      </h2>

      <div class="controls">
        Color: #<input v-model="hexWithoutOpacity" placeholder="582982" />
        Opacity: <input v-model="opacityPercentage" placeholder="90" /> %
      </div>

      <div class="tool">
        <client-only>
          <color-picker
            ref="colorPicker"
            v-model="colors"
            @input="onUpdateColor"
          />
        </client-only>

        <div v-if="hexColor" class="code-generation">
          <div class="row">
            <div class="techno">Raw</div>
            <div class="code">
              <pre>{{ snippets.raw }}</pre>
            </div>
          </div>
          <div class="row">
            <div class="techno">CSS</div>
            <div class="code">
              <pre>{{ snippets.cssColor }}</pre>
              <pre>{{ snippets.cssBgColor }}</pre>
            </div>
          </div>
          <div class="row">
            <div class="techno">Dart/Flutter</div>
            <div class="code">
              <pre>{{ snippets.dart }}</pre>
              <button
                v-clipboard:copy="snippets.dart"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError"
                type="button"
              >
                Copy!
              </button>
            </div>
          </div>
          <div class="row">
            <div class="techno">Alpha blending</div>
            <div class="code">
              <div>
                <span>- on a white opaque background</span>
                <div
                  class="vc-sketch-presets-color"
                  :style="alphaBlendingColorOnOpaqueBackgroundStyle('FFFFFF')"
                ></div>
                <pre class="inline-color">{{
                  alphaBlendingColorOnOpaqueBackgroundHex('FFFFFF')
                }}</pre>
              </div>
              <div>
                <span>- on a black opaque background</span>
                <div
                  class="vc-sketch-presets-color"
                  :style="alphaBlendingColorOnOpaqueBackgroundStyle('000000')"
                ></div>
                <pre class="inline-color">{{
                  alphaBlendingColorOnOpaqueBackgroundHex('000000')
                }}</pre>
              </div>
              <div>
                <span>- on a custom background</span>
                <div
                  v-if="bgColorHex"
                  class="vc-sketch-presets-color"
                  :style="
                    alphaBlendingColorOnOpaqueBackgroundStyle(this.bgColor)
                  "
                ></div>
                <pre v-if="bgColorHex" class="inline-color">{{
                  alphaBlendingColorOnOpaqueBackgroundHex(this.bgColor)
                }}</pre>
                <div class="controls">
                  Color: #<input v-model="bgColorHex" placeholder="FFFFFF" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="links">
        <a
          href="https://github.com/mobizel/..."
          target="_blank"
          class="button--grey"
        >
          Fork on GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorPicker from '../components/ColorPicker'

export default {
  components: {
    ColorPicker
  },
  data() {
    return {
      colors: {
        hex: '#582982BA',
        rgba: { r: 88, g: 41, b: 130, a: 0.73 },
        a: 0.73
      },
      hexColor: 'BA582982',
      hexWithoutOpacity: '582982',
      opacityPercentage: '73',
      opacityHex: 'BA',
      bgColorHex: null,
      bgOpacityPercentage: 100
    }
  },
  computed: {
    cssColor() {
      return this.colors.a < 1
        ? `rgba(${this.colors.rgba.r}, ${this.colors.rgba.g}, ${
            this.colors.rgba.b
          }, ${Math.round(this.colors.rgba.a * 100) / 100})`
        : this.colors.hex
    },
    bgColor() {
      return tinycolor(this.bgColorHex).setAlpha(
        this.bgOpacityPercentage / 100.0
      )
    },
    snippets() {
      return {
        raw: `#${this.hexColor}`,
        cssColor: `color: ${this.cssColor};`,
        cssBgColor: `background-color: ${this.cssColor};`,
        dart: `static const Color black = Color(0x${this.hexColor});`
      }
    }
  },
  watch: {
    hexWithoutOpacity(hexColor) {
      const newColor = hexColor + this.opacityHex
      if (newColor.length === 8) {
        this.$refs.colorPicker.colorChange({
          hex: newColor,
          source: 'hex'
        })
      }
    },
    opacityPercentage(opacity) {
      this.colors.rgba.a = opacity / 100
      this.$refs.colorPicker.colorChange({
        ...this.colors.rgba,
        source: 'rgba'
      })
    }
  },
  methods: {
    onCopySuccess(e) {
      alert('You just copied: ' + e.text)
    },
    onCopyError(e) {
      alert('Failed to copy texts')
    },
    alphaBlendingColorOnOpaqueBackground(color) {
      const alphaBlendingColor = { a: 1 }
      const background = tinycolor(color).toRgb()
      const alpha = this.colors.a
      for (const comp of ['r', 'g', 'b']) {
        alphaBlendingColor[comp] = Math.round(
          this.colors.rgba[comp] * alpha + (1 - alpha) * background[comp]
        )
      }
      return alphaBlendingColor
    },
    alphaBlendingColorOnOpaqueBackgroundStyle(color) {
      color = this.alphaBlendingColorOnOpaqueBackground(color)
      return {
        background: `rgb(${color.r}, ${color.g}, ${color.b}) none repeat scroll 0% 0%`
      }
    },
    alphaBlendingColorOnOpaqueBackgroundHex(color) {
      return tinycolor(this.alphaBlendingColorOnOpaqueBackground(color))
        .toHexString()
        .toUpperCase()
    },
    onUpdateColor(colors) {
      const match = colors.hex8.match(/^#([0-9a-f]{6})([0-9a-f]{2})?/i)
      if (match) {
        this.hexWithoutOpacity = match[1]
        this.opacityPercentage = Math.round(colors.rgba.a * 100)
        this.opacityHex = match[2]
        this.hexColor = `${this.opacityHex}${this.hexWithoutOpacity}`.toUpperCase()
      }
    }
  }
}
</script>

<style lang="scss">
.tool {
  display: flex;
}

.controls {
  padding: 10px;
}

.code-generation {
  text-align: left;
  padding: 10px;

  .row {
    display: flex;
  }

  .code {
    padding: 5px;

    pre {
      margin-bottom: 5px;

      &.inline-color {
        display: inline-block;
      }
    }
  }

  .techno {
    padding: 8px;
  }

  pre {
    background-color: #272727;
    color: white;
    padding: 3px;
    border-radius: 3px;
  }
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.subtitle {
  font-weight: 300;
  font-size: 20px;
  color: #526488;
  word-spacing: 3px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
