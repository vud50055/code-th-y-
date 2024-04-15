<template>
  <div class="row pt-3 px-5">
    <div class="col-6">
      <h1>{{ $t('records.list_records') }}</h1>
    </div>
    <div class="text-right col-6 flex-center">
      <label
        class="record-button mr-2"
        @click="openRecordModal"
      >
        <img
          src="@/assets/images/icon/record_icon.svg"
          class="feather feather-home mr-2"
        >

        <span>{{ $t('records.record') }}</span>
      </label>
      <input
        id="file-2"
        ref="imageUploader"
        type="file"
        name="file-2"
        accept=".mp3,.wav"
        class="inputfile inputfile-2"
        :disabled="records.length > 9"
        @input="uploadFile"
        @click="resetFileUploader"
      >
      <label
        id="file-label"
        for="file-2"
      >
        <img
          src="@/assets/images/icon/upload_icon.svg"
          class="feather feather-home mr-2"
        >
        <span>{{ this.fileName }}</span>
      </label>
    </div>
    <div
      v-if="loading"
      class="progress col-12"
    >
      <div
        class="progress-bar bg-danger"
        :style="`width: ${progress}%`"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
    <div class="col-12">
      <div>
        <div
          v-for="(record, i) in records"
          :key="i"
          class="card mb-5"
        >
          <div class="card-header">
            <div class="row">
              <div class="col-7">
                <b>{{ record.path }}</b>
              </div>
              <div class="col-5 text-right">
                {{ convertDay(record.created_at) }}
                <span :class="`badge badge-${record.status === 'pending' ? 'warning': 'info'}`">
                  {{ record.status }}
                </span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <a
              v-if="record.status === 'done'"
              :href="`/admin/records/${record.id}`"
              class="btn btn-info mr-2 btn-lg"
            >
              <img
                src="@/assets/images/icon/play_icon.svg"
                class="feather feather-home mr-2"
              >
              {{ $t('records.detail_btn') }}
            </a>
            <button
              class="btn btn-danger btn-lg"
              @click="removeRecord(record.id)"
            >
              <img
                src="@/assets/images/icon/trash_icon.svg"
                class="feather feather-home mr-2"
              >
              {{ $t('records.delete_btn') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <pop-up
      v-if="showModal"
      @close="closeRecordModal"
    >
      <template v-slot:body>
        <audio-recorder
          id="recor-audio-player"
          ref="recordAudio"
          :show-download-button="false"
          :show-upload-button="false"
          :attempts="1"
          :after-recording="afterRecording"
        />
      </template>
    </pop-up>
  </div>
</template>

<script>
  import Vue from 'vue'
  import PopUp from '../../layouts/PopUp.vue'
  import { mapActions } from 'vuex'
  import AudioRecorder from 'vue-audio-recorder'
  import dayjs from 'dayjs'
  Vue.use(AudioRecorder)

  export default {
    name: 'RecordList',
    components: {
      PopUp
    },
    data() {
      return {
        fileName: this.$t('records.add_audio'),
        progress: 5,
        loading: false,
        records: [],
        showModal: false
      }
    },
    async created() {
      await this.getList()
      setInterval(this.getList, 10000)
    },
    methods: {
      ...mapActions({
        uploadRecord: 'records/uploadRecord',
        getRecords: 'records/getRecords',
        deleteRecord: 'records/deleteRecord'
      }),
      resetFileUploader() {
        this.$refs.imageUploader.value = ''
      },
      convertDay(day) {
        return dayjs(day).format('YYYY/MM/DD hh:mm')
      },
      async uploadFile(e) {
        const size = e.target.files[0].size
        if (size > 52428800) {
          alert('File to large, please upload under 50mb')
        } else {
          this.progress = 0
          this.loading = true
          const fileName = e.target.files[0].name
          this.fileName = fileName || this.$t('records.add_audio')
          const data = new FormData()
          data.append('file', e.target.files[0])
          try {
            const res = await this.uploadRecord(data)
            this.progress = 90
            setTimeout((e) => {
              this.progress = res.statusCode === 201 ? 100 : 0
            }, 2000)
            setTimeout((e) => {
              this.loading = false
              this.getList()
              this.fileName = this.$t('records.add_audio')
              if (this.records.length > 10) this.removeRecord(this.records[0].id)
            }, 4000)
          } catch (e) {
            this.loading = false
            this.fileName = this.$t('records.add_audio')
          }
        }
      },
      async getList() {
        const res = await this.getRecords()
        this.records = res.data
      },
      async removeRecord(id) {
        const res = await this.deleteRecord({ id: id })
        if (res.statusCode === 200) {
          await this.getList()
        }
      },
      openRecordModal() {
        this.showModal = true
      },
      closeRecordModal() {
        this.showModal = false
      },
      async afterRecording() {
        const blob = this.$refs.recordAudio.recorder.records[0].blob
        const file = new File([blob], 'record.mp3')
        const data = new FormData()
        data.append('file', file)
        try {
          await this.uploadRecord(data)
          await this.getList()
          setTimeout(this.getList, 10000)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
<style scoped>
@import '../../assets/css/demo.css';
.inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.inputfile + label, .record-button {
    max-width: 80%;
    font-size: 1.25rem;
    /* 20px */
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    padding: 0.625rem 1.25rem;
    /* 10px 20px */
}

.no-js .inputfile + label {
    display: none;
}

.inputfile:focus + label,
.inputfile.has-focus + label {
    outline: 1px dotted #000;
    outline: -webkit-focus-ring-color auto 5px;
}

.inputfile + label * {
    /* pointer-events: none; */
    /* in case of FastClick lib use */
}

.inputfile + label svg, .record-button svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    margin-top: -0.25em;
    /* 4px */
    margin-right: 0.25em;
    /* 4px */
}
.inputfile-2 + label, .record-button {
    color: #fff;
    border: 2px solid currentColor;
    border-radius: 1000px;
    background-image: linear-gradient(80deg,#66a6ff,#4cabb1);
}

.inputfile-2:focus + label,
.inputfile-2.has-focus + label,
.inputfile-2 + label:hover {
    color: #10207A;
}
h1 {
  font-size: 4.5rem;
}
.card {
  background-image: linear-gradient(80deg,#66a6ff,#4cabb1);
  border-radius: 10px;
}
.btn {
  border-radius: 1000px;
}
.flex-center {
  justify-content: end;
}
</style>
