<template>
  <div class="message" :class="{ 'from-user': owner }">
    <span class="sender">{{ message.sender }}</span>
    <br />
    
    <p v-if="message.text">{{ message.text }}</p>
    <br />

    <audio v-if="message.audioURL" :src="message.audioURL" controls></audio>
    <br />

    <span>{{ message.createdAt | moment("from", "now") }}</span>
  </div>
</template>

<script>
export default {
  props: ["message", "owner"],
};
</script>
<style>
.message {
  background: #dddddd;
  color: black;
  margin-left: 10px;
  margin-right: auto;
  border-radius: 5px;
  padding: 12px;
  display: inline-block;
}
.from-user {
  margin-right: 10px;
  margin-left: auto;
  background: #91bbff;
}
.sender {
  font-size: 0.5rem;
}
</style>
