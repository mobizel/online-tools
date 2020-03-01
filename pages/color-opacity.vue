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
              <pre>#{{ hexColor }}</pre>
            </div>
          </div>
          <div class="row">
            <div class="techno">CSS</div>
            <div class="code">
              <pre>color: {{ cssColor }};</pre>
              <pre>background-color: {{ cssColor }};</pre>
            </div>
          </div>
          <div class="row">
            <div class="techno">Dart/Flutter</div>
            <div class="code">
              <pre>static const Color black = Color(0x{{ hexColor }});</pre>
            </div>
          </div>
        </div>
      </div>

      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
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
      opacityHex: 'BA'
    }
  },
  computed: {
    cssColor() {
      return this.colors.a < 1
        ? `rgba(${this.colors.rgba.r}, ${this.colors.rgba.g}, ${
            this.colors.rgba.b
          }, ${Math.round(this.colors.rgba.a * 100) / 100})`
        : this.colors.hex
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
