<template>
  <div id="app" class="container">
    <h1>Dividir times</h1>
    <div class="horizontal-rule"></div>
    <div class="atletas">
      <h5>Insira o nome dos jogadores</h5>
      <!-- <div :class="['checkbox-forca', forca ? 'active' : '']" v-if="atletas.length == 0">
        <input type="checkbox" name="forca" id="forca" v-model="forca" />
        <label for="forca" id="label-forca">Informar também a força dos jogadores</label>
      </div> -->
      <!-- <div class="placeholder-checkbox" v-else></div> -->

      <div class="container-atleta">
        <div
          :class="['atleta', forca ? 'three-columns' : 'two-columns']"
          v-for="(atleta, index) in atletas"
          :key="index"
        >
          <span>{{ atleta.nome }}</span>
          <span class="right" v-if="forca">{{ atleta.forcaJogador }}</span>
          <button class="delete" @click="atletas.splice(index, 1)" :disabled="montando">
            excluir
          </button>
        </div>
      </div>

      <div :class="['container-input-atleta', forca ? 'three-columns' : 'two-columns']">
        <span></span>
        <span>Nome do jogador</span>
        <span class="right" v-if="forca">Força</span>
      </div>

      <div :class="['container-input-atleta', forca ? 'three-columns' : 'two-columns']">
        <label for="input-atleta">Jogador #{{ atletas.length + 1 }} :</label>
        <div class="container-input-atleta">
          <input type="text" id="input-atleta" class="input-atleta" v-model="nome" />
        </div>
        <select
          v-if="forca"
          type="text"
          id="input-atleta"
          class="input-atleta"
          v-model="forcaJogador"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <button @click="addUser" :disabled="montando" :class="[montando ? 'disabled' : '']">
        Adicionar
      </button>

      <div class="horizontal-rule bottom"></div>

      <div class="container-input-atleta">
        <label for="input-tamanho">Tamanho do time</label>
        <input type="number" id="input-tamanho" class="input-atleta" v-model="tamtime" />
      </div>

      <button
        @click="montarTime"
        :disabled="atletas.length == 0 || tamtime < 1 || tamtime > atletas.length"
        :class="[atletas.length == 0 || tamtime < 1 || tamtime > atletas.length ? 'disabled' : '']"
      >
        Montar time
      </button>

      <div class="horizontal-rule bottom"></div>

      <div class="resultado-container">
        <div class="time" v-for="(time, index) in resultado" :key="index">
          <h5>Time {{ index + 1 }}</h5>
          <div class="cada-um" v-for="(pessoa, index) in time" :key="index">
            <p>{{ pessoa.nome }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    forca: false,
    forcaJogador: 1,
    nome: "",
    atletas: [],
    hideForca: false,
    tamtime: 1,
    montando: false,
    resultado: [],
    newAtletas: [],
  }),

  methods: {
    shuffle: function (array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }

      return array;
    },
    addUser: function () {
      const { forcaJogador, nome, montando } = this;
      if (!forcaJogador || !nome || montando) return;
      this.hideForca = true;
      this.atletas.push({ nome, forcaJogador });
      this.forcaJogador = 1;
      this.nome = "";
    },
    montarTime: function () {
      this.montando = true;
      this.newAtletas = [...this.atletas];
      this.newAtletas = this.shuffle(this.newAtletas);
      const nTimes = Math.floor(this.newAtletas.length / this.tamtime);
      this.resultado = Array(nTimes);
      if (this.forca) {
        const fortes = this.newAtletas.filter((atleta) => atleta.forcaJogador == 3);
        const medios = this.newAtletas.filter((atleta) => atleta.forcaJogador == 2);
        const fracos = this.newAtletas.filter((atleta) => atleta.forcaJogador == 1);

        let contFortes = 0;
        let contMedios = 0;
        let contFracos = 0;

        let cont = 0;
        while (contFortes < fortes.length) {
          this.resultado[cont % nTimes].push(fortes[contFortes]);
          contFortes++;
          cont++;
        }

        while (contMedios < medios.length) {
          this.resultado[cont % nTimes].push(medios[contMedios]);
          contMedios++;
          cont++;
        }

        while (contFracos < fracos.length) {
          this.resultado[cont % nTimes].push(fracos[contFracos]);
          contFracos++;
          cont++;
        }
      } else {
        var chunks = [],
          i = 0,
          n = this.newAtletas.length;
        while (i < n) {
          chunks.push(this.newAtletas.slice(i, (i += this.tamtime)));
        }
        this.resultado = chunks;
        console.log(chunks);
      }
    },
  },
};
</script>

<style>
* {
  font-family: "Sora", sans-serif;
  margin: 0;
}

body {
  background: rgb(30, 41, 59);
}

h1 {
  font-weight: 800;
  font-size: 32px;
  text-align: center;
}

html,
body,
#app {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 500px;
  color: white;
  margin: auto;
  margin-top: 5rem;
}
.horizontal-rule {
  height: 2px;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
}

.horizontal-rule.bottom {
  margin: 2rem 0;
}

.atletas {
  margin-top: 2rem;
}

.checkbox-forca {
  opacity: 0.5;
  margin-bottom: 1rem;
}
.checkbox-forca.active {
  opacity: 1;
}

.checkbox-forca label {
  margin-left: 0.5rem;
}

.input-atleta {
  width: 100%;
}

.container-input-atleta {
  height: 100%;
}

.container-input-atleta.three-columns .container-input-atleta {
  height: 100%;
  padding-right: 10px;
}

select,
input.input-atleta {
  border: none;
  height: 100%;
  background-color: white;
  padding: 8px;
  border-radius: 4px;
}

.container-input-atleta {
  display: grid;
  align-items: center;
}

.container-input-atleta.two-columns {
  grid-template-columns: 1fr 3fr;
}
.container-input-atleta.three-columns {
  grid-template-columns: 2fr 5fr 1fr;
}

button {
  margin-top: 1rem;
  width: 100%;
  border: none;
  background: white;
  color: black;
  border-radius: 8px;
  padding: 8px;
}

button.delete {
  padding: 0;
  margin-top: 0;
}

button.disabled {
  color: #777;
  background: #aaa;
}

.container-atleta {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.atleta {
  padding: 1rem;
  background-color: rgb(255, 255, 255);
  color: black;
  border-radius: 0.5rem;
  display: grid;
  gap: 8px;
}
.atleta .delete {
  color: #888;
}
.atleta span {
  display: flex;
  align-items: center;
}
.atleta.two-columns {
  grid-template-columns: 6fr 1fr;
}
.atleta.three-columns {
  grid-template-columns: 5fr 1fr 1fr;
}
.resultado-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.time {
  background: white;
  padding: 1rem;
  color: black;
  border-radius: 8px;
}
</style>
