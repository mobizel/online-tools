<script>
import { Sketch } from 'vue-color'

export default {
  extends: Sketch,
  computed: {
    hex() {
      let hex
      if (this.colors.a < 1) {
        hex = this.colors.hex8
      } else {
        hex = this.colors.hex
      }
      return hex
    }
  }
}
</script>

<style>
.vc-sketch {
  width: 250px !important;
}

.vc-sketch-field .vc-input__input {
  padding: 4px 0 3px 3px !important;
}
</style>
