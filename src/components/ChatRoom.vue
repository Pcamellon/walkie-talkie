<template>
  <main class="section">
    <h3>Welcome to ChatRoom.vue {{ chatId }}</h3>

    <router-link to="/">Back</router-link>

    <p>
      Open this link in another browser window to chat
      <code>https://your-url.com/#/chats/{{ chatId }}</code>
    </p>

    <User #user="{ user }">
      <div v-if="user">
        <ul>
          <li v-for="message of messages" :key="message.id">
            <ChatMessage
              :message="message"
              :owner="user.uid === message.sender"
            />
          </li>
        </ul>

        <hr />
        <h5>Record Audio</h5>

        <button v-if="!recorder" @click="record()" class="button is-info">
          Record Voice
        </button>
        <button v-else @click="stop()" class="button is-danger">Stop</button>

        <br />

        <audio v-if="newAudio" :src="newAudioURL" controls></audio>

        <hr />

        <input v-model="newMessageText" class="input" />

        <button
          :disabled="(!newMessageText && !newAudio) || loading"
          class="button is-success"
          type="text"
          @click="addMessage(user.uid)"
        >
          Send
        </button>
      </div>

      <Login v-else />
    </User>
  </main>
</template>

<script>
import User from "./User.vue";
import ChatMessage from "./ChatMessage.vue";
import Login from "./Login.vue";
import { db, storage } from "../firebase";

export default {
  components: {
    User,
    Login,
    ChatMessage,
  },
  data() {
    return {
      newMessageText: "",
      loading: false,
      messages: [],
      newAudio: null,
      recorder: null,
    };
  },
  computed: {
    chatId() {
      return this.$route.params.id;
    },
    messagesCollection() {
      return db.doc(`chats/${this.chatId}`).collection("messages");
    },
    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
    },
  },
  firestore() {
    return {
      messages: this.messagesCollection.orderBy("createdAt").limitToLast(10),
    };
  },
  methods: {
    async addMessage(uid) {
      this.loading = true;

      const { id: messageId } = this.messagesCollection.doc();

      // Just Txt
      if (!this.newAudio) {
        await this.messagesCollection.doc(messageId).set({
          text: this.newMessageText,
          sender: uid,
          createdAt: Date.now(),
        });

        this.loading = false;
        this.newMessageText = "";
      }

      console.log(`this.newAudio ${this.newAudio}`);

      // Create the file metadata
      const metadata = {
        contentType: "audio/wav",
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const uploadTask = storage
        .ref("chats")
        .child(this.chatId)
        .child(`${messageId}.wav`)
        .put(this.newAudio, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);

          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              console.log(error.serverResponse);
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log("File available at", downloadURL);

            this.messagesCollection.doc(messageId).set({
              text: "",
              sender: uid,
              createdAt: Date.now(),
              audioURL: downloadURL,
            });

            this.loading = false;
            this.newMessageText = "";
            this.newAudio = null;
          });
        }
      );
    },
    async record() {
      this.newAudio = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const options = { mimeType: "audio/webm" };
      const recordedChunks = [];
      this.recorder = new MediaRecorder(stream, options);

      this.recorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      this.recorder.addEventListener("stop", () => {
        this.newAudio = new Blob(recordedChunks);
        console.log(this.newAudio);

        // TODO  Upload
      });

      this.recorder.start();

      // const newAudioURL = URL.createObjectURL(this.newAudio);
      // console.log(this.newAudio);
    },
    async stop() {
      this.recorder.stop();
      this.recorder = null;
    },
  },
};
</script>


<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 500px;
  background: #efefef;
  padding: 10px;
  border-radius: 0;
}

li {
  display: flex;
}
</style>