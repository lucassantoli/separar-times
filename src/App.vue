<template>
  <div id="app" class="container">
    <h1>Dividir times</h1>
    <div class="horizontal-rule bottom"></div>

    <div class="display-atletas-container" v-if="playersAdded > 0">
      <div
        class="display-atletas"
        v-for="pos in Object.keys(positions)"
        :key="pos"
        :hidden="players[pos].length == 0"
      >
        <h5>{{ positions[pos].name }}</h5>
        <div class="container-table">
          <table style="width: 100%">
            <thead>
              <tr>
                <th>Nome</th>
                <th>POS</th>
                <th>FRÇ</th>
                <th>SQ</th>
                <th>AT</th>
                <th>BL</th>
                <th>LV</th>
                <th>RC</th>
                <th>Pont.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(atleta, index) in players[pos]" :key="index">
                <td>{{ atleta.name }}</td>
                <td>{{ atleta.position }}</td>
                <td>{{ atleta.strength }}</td>
                <td>{{ atleta.SQ }}</td>
                <td>{{ atleta.AT }}</td>
                <td>{{ atleta.BL }}</td>
                <td>{{ atleta.LV }}</td>
                <td>{{ atleta.RC }}</td>
                <td>{{ atleta.score.toFixed(2) }}</td>
                <td>
                  <svg
                    @click="deletePlayer(pos, index)"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                    />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="atletas">
      <form v-on:submit.prevent="addUser">
        <h4>Jogador #{{ playersAdded + 1 }} :</h4>
        <div class="container-input-atleta">
          <div class="input-atleta">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="player.name" />
          </div>

          <div class="input-atleta">
            <label for="input-posicao">Posição:</label>
            <select
              type="text"
              id="input-posicao"
              class="input-atleta"
              v-model="player.position"
            >
              <option
                v-for="pos in Object.keys(positions)"
                :value="pos"
                :key="pos"
              >
                {{ positions[pos].name }}
              </option>
            </select>
          </div>

          <div class="input-atleta">
            <label for="forca">Força:</label>
            <input
              type="range"
              min="1"
              max="5"
              id="forca"
              list="input-attr"
              v-model="player.strength"
            />
          </div>

          <datalist id="input-attr">
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
          </datalist>
        </div>

        <h5>Atributos</h5>
        <div class="container-input-atleta">
          <div
            class="input-atleta"
            v-for="attr in Object.keys(attributes)"
            :key="attr.key"
          >
            <label :for="attr">{{ attributes[attr] }}:</label>
            <input
              type="range"
              min="1"
              max="5"
              list="input-attr"
              :id="attr"
              v-model="player[attr]"
            />
          </div>
        </div>

        <input type="submit" hidden />
        <button type="submit" :class="this.player.name == '' ? 'disabled' : ''">
          Adicionar
        </button>
      </form>

      <button
        @click="() => buildTeams(false)"
        :disabled="players.length == 0"
        :class="[players.length == 0 ? 'disabled' : '']"
      >
        Montar time
      </button>

      <button
        @click="() => buildTeams(true)"
        :disabled="players.length == 0"
        :class="[players.length == 0 ? 'disabled' : '']"
      >
        Montar time sem posições
      </button>

      <div class="horizontal-rule bottom"></div>

      <div class="teams-container">
        <div class="team" v-for="(team, index) in teams" :key="index">
          <div class="first-line">
            <h5>Time {{ index + 1 }}</h5>
            <h5>Força: {{team.reduce((sum,player) =>  player.sub ? sum : sum + player.score, 0).toFixed(2)}}</h5>
          </div>
          <div class="each" v-for="(player, index) in team" :key="index">
            <p :class="['player', player.sub ? 'sub' : '']">
              {{ player.name }}
            </p>
            <p :class="['player right', player.sub ? 'sub' : '']">
              {{ player.position }}
            </p>
            <p :class="['player right', player.sub ? 'sub' : '']">
              {{ player.score.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { equalTeams } from "@/utils/utils";

export default {
  name: "App",

  data: () => ({
    player: {
      name: "",
      position: "DF",
      strength: 1,
      SQ: 1,
      AT: 1,
      BL: 1,
      LV: 1,
      RC: 1,
    },
    playersAdded: 0,//20,
    totalStrength: 0,
    teams: [],
    players: {
      DF: [],
      PT: [],
      LV: [],
      LB: [],
    },
    // players: {"DF":[{"name":"Valério","position":"DF","strength":3,"SQ":"4","AT":"4","BL":"3","LV":"2","RC":"4","score":6.666666666666666,"sub":false},{"name":"Débora","position":"DF","strength":1,"SQ":1,"AT":1,"BL":1,"LV":1,"RC":"2","score":2.333333333333333,"sub":false},{"name":"Dhennifa","position":"DF","strength":1,"SQ":"4","AT":"4","BL":"2","LV":"2","RC":"4","score":4.666666666666666,"sub":false},{"name":"Gabi","position":"DF","strength":3,"SQ":"3","AT":"2","BL":"1","LV":1,"RC":"3","score":5.5,"sub":false},{"name":"Lucas","position":"DF","strength":2,"SQ":"3","AT":"1","BL":1,"LV":"2","RC":"3","score":4.5,"sub":false},{"name":"Geter","position":"DF","strength":2,"SQ":"3","AT":"2","BL":"2","LV":1,"RC":"3","score":4.5,"sub":false},{"name":"Leonel","position":"DF","strength":1,"SQ":"5","AT":"2","BL":1,"LV":"4","RC":"2","score":4.333333333333334,"sub":false}],"PT":[{"name":"Cadmo","position":"PT","strength":3,"SQ":"4","AT":"4","BL":"4","LV":"3","RC":"3","score":6.857142857142858,"sub":false},{"name":"Júlia","position":"PT","strength":2,"SQ":"2","AT":"3","BL":"2","LV":"1","RC":"3","score":4.285714285714286,"sub":false},{"name":"Rafael","position":"PT","strength":2,"SQ":"3","AT":"4","BL":"3","LV":"2","RC":"3","score":5.285714285714286,"sub":false},{"name":"Samuel Denny","position":"PT","strength":2,"SQ":"3","AT":"4","BL":"3","LV":"2","RC":"3","score":5.285714285714286,"sub":false},{"name":"Jader","position":"PT","strength":3,"SQ":"4","AT":"4","BL":"2","LV":"2","RC":"3","score":6.142857142857142,"sub":false},{"name":"Joel","position":"PT","strength":5,"SQ":"5","AT":"5","BL":"4","LV":"3","RC":"3","score":9.428571428571429,"sub":false}],"LV":[{"name":"Jojo","position":"LV","strength":5,"SQ":"5","AT":"5","BL":"4","LV":"5","RC":"3","score":9.714285714285715,"sub":false},{"name":"Nino","position":"LV","strength":5,"SQ":"3","AT":"3","BL":"2","LV":"5","RC":"3","score":8.571428571428571,"sub":false},{"name":"Samuel","position":"LV","strength":3,"SQ":"3","AT":"4","BL":"2","LV":"4","RC":"3","score":6.285714285714286,"sub":false}],"LB":[{"name":"Victoria","position":"LB","strength":3,"SQ":"4","AT":"1","BL":1,"LV":"3","RC":"4","score":6.8,"sub":false},{"name":"Calebe","position":"LB","strength":3,"SQ":"4","AT":"3","BL":"2","LV":"2","RC":"5","score":7.2,"sub":false},{"name":"Geyzon","position":"LB","strength":4,"SQ":"3","AT":"4","BL":"4","LV":"4","RC":"3","score":7.2,"sub":false}]},
    positions: {
      DF: {
        name: "Defesa",
        effect: { SQ: 2, AT: 1, BL: 0, LV: 1, RC: 2 },
        total: 6,
      },
      PT: {
        name: "Ponta",
        effect: { SQ: 1, AT: 3, BL: 2, LV: 1, RC: 0 },
        total: 7,
      },
      LV: {
        name: "Levantador",
        effect: { SQ: 1, AT: 1, BL: 2, LV: 3, RC: 0 },
        total: 7,
      },
      LB: {
        name: "Líbero",
        effect: { SQ: 1, AT: 0, BL: 0, LV: 1, RC: 3 },
        total: 5,
      },
    },
    attributes: {
      SQ: "Saque",
      AT: "Ataque",
      BL: "Bloqueio",
      LV: "Levantamento",
      RC: "Recepção",
    },
  }),

  methods: {
    shuffle: function (array) {
      let currentIndex = array.length,
        randomIndex;

      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    },

    addUser: function () {
      if (this.player.name == "") return;

      const { name, position, strength, SQ, AT, BL, LV, RC } = this.player;

      const score =
        (parseInt(SQ) * this.positions[position].effect.SQ +
          parseInt(AT) * this.positions[position].effect.AT +
          parseInt(BL) * this.positions[position].effect.BL +
          parseInt(LV) * this.positions[position].effect.LV +
          parseInt(RC) * this.positions[position].effect.RC) /
          this.positions[position].total +
        parseInt(strength);

      this.players[position].push({
        name,
        position,
        strength,
        SQ,
        AT,
        BL,
        LV,
        RC,
        score,
        sub: false,
      });

      this.playersAdded++;
      this.totalStrength += score;

      this.player = {
        name: "",
        position: "DF",
        strength: 1,
        SQ: 1,
        AT: 1,
        BL: 1,
        LV: 1,
        RC: 1,
      };
      return false;
    },

    deletePlayer: function (position, index) {
      this.players[position].splice(index, 1);
      this.playersAdded--;
    },

    combinations: function* (combo, list, k) {
      if (k == 0) {
        yield combo;
      } else {
        for (let i = 0; i < list.length; i++) {
          yield* this.combinations(
            [...combo, list[i]],
            list.slice(i + 1),
            k - 1
          );
        }
      }
    },

    buildTeams: function (simple) {
      const nTeams = Math.floor(this.playersAdded / 6);


      let playersDF = this.shuffle([...this.players.DF]);
      let playersPT = this.shuffle([...this.players.PT]);
      let playersLV = this.shuffle([...this.players.LV]);
      let playersLB = this.shuffle([...this.players.LB]);

      let contTeam = 0;

      let teams = [];

      for (let i = 0; i < nTeams; i++) {
        teams.push([]);
      }

      for (let i = 0; i < nTeams; i++) {
        if (playersLV.length) {
          teams[contTeam++].push(playersLV[0]);
          playersLV.shift();
        } else if (playersPT.length) {
          teams[contTeam++].push(playersPT[0]);
          playersPT.shift();
        } else if (playersDF.length) {
          teams[contTeam++].push(playersDF[0]);
          playersDF.shift();
        } else if (playersLB.length) {
          teams[contTeam++].push(playersLB[0]);
          playersLB.shift();
        }

        contTeam = contTeam % nTeams;
      }

      let remain = [...playersLV, ...playersPT, ...playersDF, ...playersLB];
      if (simple) {
        while (remain.length) {
          if (teams[contTeam].length >= 6) {
            remain[0].sub = true;
          }
          teams[contTeam++].push(remain[0]);
          remain.shift();

          contTeam = contTeam % nTeams;
        }
      } else {
        //var result = equalTeams(remain);

        // for (var t in result.teams) {
        //   for (var i in result.teams[t]) {
        //     console.log(
        //       result.teams[t][i].name + " (" + result.teams[t][i].strength + ") "
        //     );
        //   }
        //   console.log(
        //     "<br>&rarr; team strength = " + result.strengths[t] + "<br><br>"
        //   );
        // }
        remain.sort((A,B)=> parseInt(A.score) - parseInt(B.score))
        
        while (remain.length) {
          if (teams[contTeam].length >= 6) {
            remain[0].sub = true;
          }
          teams[contTeam++].push(remain[0]);
          remain.shift();

          contTeam = contTeam % nTeams;
        }
      }
      this.teams = teams;
    },
  },
};
</script>

<style>
@import "./Style.css";
</style>
