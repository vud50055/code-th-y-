<template>
  <div>
    <div class="row align-items-center">
      <div class="col-lg-12 col-sm-12 max-height-text">
        <div class="pt-3 px-5">
          <div
            v-show="showTrans"
            class="row justify-content-end"
          >
            <select
              v-model="locale"
              class="custom-select custom-select-lg mb-3 mt-4 col-6"
            >
              <option
                v-for="(lang, key) in getLangs"
                :key="key"
                :value="key"
              >
                {{ lang }}
              </option>
            </select>
          </div>
          <div class="div-text">
            <div
              v-for="(r, i) in resultData"
              :key="i"
            >
              <div class="row m-0">
                <div :class="`${showTrans ? `col-6 border-right` : 'col-12' } p-3`">
                  <span
                    v-for="(t, idx) in r.data"
                    :key="idx"
                    :class="`speech-text ${(t.timestamp-currentTime) < 0.1 && currentTime < t.timestamp ? 'active' : ''}`"
                  >
                    <input
                      v-if="selectedIdx[1] == idx && selectedIdx[0] == i"
                      :id="`input-${i}-${idx}`"
                      v-model="textData"
                      :style="`width: calc(${selectWidth}px + 15px)`"
                      class="form-control-plaintext"
                      @blur="updateText($event, i,idx)"
                    >
                    <span
                      v-else
                      :id="`text-${i}-${idx}`"
                      :class="`mr-1 ${t.confidence < 0.7 ? 'bg-danger text-white' : ''}`"
                      @click="setAudioTimeByText(i,idx)"
                      @dblclick="selectText(i,idx)"
                    >
                      {{ t.word }}
                    </span>
                  </span>
                </div>
                <div
                  v-if="showTrans"
                  class="col-6 p-3"
                >
                  <span
                    v-for="(t, idx) in transData[i].data"
                    :key="idx"
                    class="speech-text"
                  >
                    <span
                      :id="`text-${i}-${idx}`"
                      class="mr-1"
                    >
                      {{ t.word }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="audio-player-position bg-light">
          <audio-player
            ref="audioPlayer"
            :audio-list="audioList.map(elm => elm.url)"
            show-playback-rate
            :show-prev-button="false"
            :show-next-button="false"
            theme-color="#244886"
            :is-loop="false"
            :progress-interval="100"
            @playing="playing()"
          />
        </div>
      </div>
    </div>
    <div class="fab-wrapper">
      <input
        id="fabCheckbox"
        type="checkbox"
        class="fab-checkbox"
      >
      <label
        class="fab"
        for="fabCheckbox"
      >
        <span class="fab-dots fab-dots-1" />
        <span class="fab-dots fab-dots-2" />
        <span class="fab-dots fab-dots-3" />
      </label>
      <div class="fab-wheel">
        <button
          class="btn btn-lg btn-info btn-gardient fab-action fab-action-1"
          @click="showTrans = !showTrans"
        >
          <img
            src="@/assets/images/icon/trans_icon.svg"
            class="feather-lg feather-home"
          >
        </button>
        <button
          class="btn btn-lg btn-info btn-gardient fab-action fab-action-2"
        >
          <img
            src="@/assets/images/icon/intruction_icon.svg"
            class="feather-lg feather-home"
          >
        </button>
        <a
          class="btn btn-lg btn-info btn-gardient fab-action fab-action-3"
          :href="audioList[0].url"
          download
        >
          <img
            src="@/assets/images/icon/download_audio_icon.svg"
            class="feather-lg feather-home"
          >
        </a>
        <button
          class="btn btn-lg btn-info btn-gardient fab-action fab-action-4"
          @click="downloadTextFile"
        >
          <img
            src="@/assets/images/icon/text-1473.svg"
            class="feather-lg feather-home"
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'RecordDetail',
    data() {
      return {
        currentAudioName: '',
        audioList: [
          {
            name: 'audio1',
            url: ''
          }
        ],
        selectedIdx: [null, null],
        selectWidth: 0,
        currentTime: 0,
        resultData: [
          {
            data: []
          }
        ],
        transData: [
          {
            data: []
          }
        ],
        record: null,
        textData: '',
        locale: 'vi',
        showTrans: false
      }
    },
    async created() {
      const id = this.$route.params.id
      await this.getRecord(id)
      await this.getFullLang()
    },
    computed: {
      ...mapGetters({
        getLangs: 'records/getLangs'
      })
    },
    watch: {
      async locale() {
        const res = await this.detailRecord({ id: this.$route.params.id, lang: this.locale })
        this.transData[0].data = res.data.results
      }
    },
    methods: {
      ...mapActions({
        detailRecord: 'records/detailRecord',
        resultsRecord: 'records/resultsRecord',
        updateResultsRecord: 'records/updateResultsRecord',
        getFullLang: 'records/getFullLang'
      }),
      playing() {
        this.currentTime = this.$refs.audioPlayer.currentTime
      },
      async getRecord(id) {
        const res = await this.detailRecord({ id: id, lang: this.locale })
        this.record = res.data
        // const resText = await this.resultsRecord({ id: id, lang: this.locale })
        this.resultData[0].data = this.record.results
        const res1 = await fetch(`${process.env.VUE_APP_API}/files/read/${id}`)
        const fileBlob = await res1.blob()
        const objectUrl = URL.createObjectURL(fileBlob)
        this.audioList[0].url = objectUrl
      },
      setAudioTimeByText(paraIdx, textIdx) {
        this.currentTime = this.resultData[paraIdx].data[textIdx].timestamp - 0.05
        this.$refs.audioPlayer.currentTime = this.currentTime
        this.$refs.audioPlayer.$refs.audio.currentTime = this.currentTime
        const offsetLeft = (this.$refs.audioPlayer.$refs.audio.currentTime / this.$refs.audioPlayer.$refs.audio.duration) * this.$refs.audioPlayer.$refs.audioProgressWrap.offsetWidth
        this.setPointPosition(offsetLeft)
      },
      selectText(paraIdx, textIdx) {
        const textData = document.getElementById(`text-${paraIdx}-${textIdx}`)
        this.textData = this.resultData[paraIdx].data[textIdx].word
        this.selectWidth = textData.offsetWidth
        this.selectedIdx = [paraIdx, textIdx]
      },
      async updateText(e, paraIdx, textIdx) {
        this.resultData[paraIdx].data[textIdx].word = this.textData
        this.resultData[paraIdx].data[textIdx].confidence = 1
        await this.updateResultsRecord({ id: this.resultData[paraIdx].data[textIdx].id, data: this.resultData[paraIdx].data[textIdx] })
        await this.resultsRecord({ id: this.$route.params.id, data: this.resultData[paraIdx].data[textIdx] })
        this.textData = ''
        this.selectWidth = 0
        this.selectedIdx = [null, null]
      },
      setPointPosition(offsetLeft) {
        this.$refs.audioPlayer.$refs.audioProgressPoint.style.left =
          offsetLeft - this.$refs.audioPlayer.$refs.audioProgressPoint.offsetWidth / 2 + 'px'
        this.$refs.audioPlayer.$refs.audioProgress.style.width = offsetLeft + 'px'
      },
      downloadTextFile() {
        const textArr = this.resultData[0].data.map(e => e.word)
        const content = textArr.join(' ')
        const link = document.createElement('a')
        const file = new Blob([content], { type: 'text/plain' })
        link.href = URL.createObjectURL(file)
        link.download = `${this.$route.params.id}.txt`
        link.click()
        URL.revokeObjectURL(link.href)
      }
    }
  }
</script>

<style scoped>
.max-height-text {
  max-height: calc(100vh - 300px);
  overflow: scroll;
}
.speech-text.active {
  background: #ACB8FA;
}
.form-control-plaintext {
  display: inline;
}
::v-deep .custom-select-lg {
  height: calc(3.875rem + 2px);
  border-radius: 1000px;
  padding: 0 20px;
}
.div-text {
  padding: 0 !important;
  color: rgb(36, 72, 134);
  border: 1px solid;
  border-radius: 30px;
}
.border-right {
  border-right: 1px solid rgb(36, 72, 134) !important;
}
.btn-gardient, .bg-warning {
  border-radius: 30px;
  color: #fff;
  padding: 0.8rem 1rem;
  font-size: 1.7rem;
  line-height: 1.5;
}
.btn-gardient {
  background-image: linear-gradient(80deg,#66a6ff,#4cabb1);
}
.audio-player-position {
  position: fixed;
  width: 66.666667%;
  bottom: 0;
  max-width: calc(100% - 16.666667% - 20rem);
  background-image: linear-gradient(80deg,#66a6ff,#4cabb1);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
}
::v-deep .audio-player .audio__current-time {
  color: #fff;
}
::v-deep .audio-player .audio__duration {
  color: #fff;
}

* {
  box-sizing: border-box;
}

.fab-wrapper {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
}
.fab-checkbox {
  display: none;
}
.fab {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  width: 4rem;
  height: 4rem;
  background-image: linear-gradient(80deg,#66a6ff,#4cabb1);
  border-radius: 50%;
  box-shadow: 0px 5px 20px #81a4f1;
  transition: all 0.3s ease;
  z-index: 1;
  border-bottom-right-radius: 6px;
  border: 1px solid #0c50a7;
}

.fab:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}
.fab-checkbox:checked ~ .fab:before {
  width: 90%;
  height: 90%;
  left: 5%;
  top: 5%;
  background-color: rgba(255, 255, 255, 0.2);
}
.fab:hover {
  background: #ACB8FA;
  box-shadow: 0px 5px 20px 5px #81a4f1;
}

.fab-dots {
  position: absolute;
  height: 8px;
  width: 8px;
  background-color: white;
  border-radius: 50%;
  top: 50%;
  transform: translateX(0%) translateY(-50%) rotate(0deg);
  opacity: 1;
  animation: blink 3s ease infinite;
  transition: all 0.3s ease;
}

.fab-dots-1 {
  left: 15px;
  animation-delay: 0s;
}
.fab-dots-2 {
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  animation-delay: 0.4s;
}
.fab-dots-3 {
  right: 15px;
  animation-delay: 0.8s;
}

.fab-checkbox:checked ~ .fab .fab-dots {
  height: 6px;
}

.fab .fab-dots-2 {
  transform: translateX(-50%) translateY(-50%) rotate(0deg);
}

.fab-checkbox:checked ~ .fab .fab-dots-1 {
  width: 32px;
  border-radius: 10px;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
}
.fab-checkbox:checked ~ .fab .fab-dots-3 {
  width: 32px;
  border-radius: 10px;
  right: 50%;
  transform: translateX(50%) translateY(-50%) rotate(-45deg);
}

@keyframes blink {
  50% {
    opacity: 0.25;
  }
}

.fab-checkbox:checked ~ .fab .fab-dots {
  animation: none;
}

.fab-wheel {
  position: absolute;
  bottom: 0;
  right: 0;
  border: 1px solid unset;
  width: 10rem;
  height: 10rem;
  transition: all 0.3s ease;
  transform-origin: bottom right;
  transform: scale(0);
}

.fab-checkbox:checked ~ .fab-wheel {
  transform: scale(1);
}
.fab-action {
  position: absolute;
  background-image: linear-gradient(80deg,#66a6ff,#4cabb1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: White;
  box-shadow: 0 0.1rem 1rem rgba(24, 66, 154, 0.82);
  transition: all 1s ease;

  opacity: 0;
}

.fab-checkbox:checked ~ .fab-wheel .fab-action {
  opacity: 1;
}

.fab-action:hover {
  background-color: #f16100;
}

.fab-wheel .fab-action-1 {
  right: -2rem;
  top: -2rem;
}

.fab-wheel .fab-action-2 {
  right: 3.8rem;
  top: -2rem;
}
.fab-wheel .fab-action-3 {
  left: -2rem;
  bottom: 3.8rem;
}
.fab-wheel .fab-action-4 {
  left: -2rem;
  bottom: -2rem;
}

</style>
