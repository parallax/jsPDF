<template>
  <div id="app">
    <h1>jsPDF + Vue example</h1>
    <div>
      <label for="filename">Filename: </label>
      <input 
        type="text"
        id="filename"
        v-model="filename"
      />
    </div>
    <div style="margin-top:1rem">
      <label for="content">Content: </label>
      <input 
        type="text"
        id="content"
        v-model="content"
      />
    </div>
    <div style="margin-top:1rem">
      <button @click="downloadPdf">Download</button>
    </div>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
export default {
  name: 'app',
  data(){
    return {
      doc: null,
      filename: '',
      content: '',
    }
  },
  created(){
    this.doc = new jsPDF();
  },
  methods: {
    downloadPdf(){
      this.doc.text(this.content, 10, 10);
      this.doc.save(`${this.filename.replace(".pdf","")}.pdf`);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
