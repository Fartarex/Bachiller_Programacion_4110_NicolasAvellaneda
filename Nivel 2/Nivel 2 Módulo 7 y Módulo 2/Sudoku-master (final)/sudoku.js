///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function() {
  const comenzar = document.getElementById("comenzar");

  if (comenzar) {
    comenzar.addEventListener("click", () => {

    var dificultad = parseInt(document.querySelector('input[name="dificultad"]:checked').value, 10);

    console.log(dificultad);

    var numSelected = null;

    var errors = 0;

    var solution = generarSudoku();

    console.log(solution);

    var tablaIncompleta = JSON.parse(JSON.stringify(solution));

    var board = quitarNumeros(tablaIncompleta, dificultad);
    
    setGame();
    
    function setGame() {

      // Digitos del 1 al 9.
      for (let i = 1; i <= 9; i++) {
          //<div id="1" class="number">1</div>
          let number = document.createElement("div");
          number.id = i
          number.innerText = i;
          number.addEventListener("click", selectNumber);
          number.classList.add("number");
          document.getElementById("digits").appendChild(number);
      }
  
      // Board 9x9
      for (let f = 0; f < 9; f++) {
          for (let c = 0; c < 9; c++) {
              let tile = document.createElement("div");
              tile.id = f.toString() + "-" + c.toString();
              if (board[f][c] != 0) {
                  tile.innerText = board[f][c];
                  tile.classList.add("tile-start");
              }
              tile.addEventListener("click", selectTile);
              tile.classList.add("tile");
              document.getElementById("board").append(tile);
          }
      }
  }
  
  function selectNumber(){
      if (numSelected != null) {
          numSelected.classList.remove("number-selected");
      }
      numSelected = this;
      numSelected.classList.add("number-selected");
  }
  
  function selectTile(){
      if (numSelected) {
          if (this.innerText != "") {
              return;
          }
  
          // "0-0" "0-1" .. "3-1"
          let coords = this.id.split("-"); //["0", "0"]
          let r = parseInt(coords[0]);
          let c = parseInt(coords[1]);
  
          if (solution[r][c] == numSelected.id) {
              this.innerText = numSelected.id;
          }
          else {
              errors += 1;
              document.getElementById("errors").innerText = errors;
          }
      }
  }
  
  
  
  function quitarNumeros(tablaIncompleta, dificultad) {

    for (let num = 1; num <= 9; num++) {
      for (let i = 0; i < dificultad; i++) {
        let indiceUno, indiceDos;
  
        do {
          indiceUno = Math.floor(Math.random() * 9);
          indiceDos = Math.floor(Math.random() * 9);
        } while (tablaIncompleta[indiceUno][indiceDos] !== num);
  
        tablaIncompleta[indiceUno][indiceDos] = 0;
      }
    }
  
    console.log(tablaIncompleta);
    return tablaIncompleta;
  }
    });
  } else {
    console.error("Hubo un error en la ejecución del código.");
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function generarSudoku() {
    const matriz = new Array(9).fill().map(() => Array(9).fill(0)); // Genera una matriz cuadrada de 9x9 llena de 0.
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //
  
    function llenarCeldas(fila, columna) {
      if (fila === 9) {
        return true; // Todas las celdas llenas.
      }
  
      if (matriz[fila][columna] !== 0) {
        // Avanzar a la siguiente celda
        const siguienteCelda = obtenerSiguienteCelda(fila, columna);
        return llenarCeldas(siguienteCelda.fila, siguienteCelda.columna);
      }
  
      const candidatos = [...numeros]; //Crea una copia de lo
      mezclarArray(candidatos);
  
      for (const candidato of candidatos) {
        if (esCandidatoValido(matriz, fila, columna, candidato)) {
          matriz[fila][columna] = candidato;
  
          // Avanzar a la siguiente celda
          const siguienteCelda = obtenerSiguienteCelda(fila, columna);
          if (llenarCeldas(siguienteCelda.fila, siguienteCelda.columna)) {
            return true; // Se llenaron todas las celdas con éxito
          }
  
          // Si no se puede llenar, retroceder
          matriz[fila][columna] = 0;
        }
      }
  
      return false; // No se encontró una solución válida
    }
  
    llenarCeldas(0, 0);
    return matriz;
  }
  
  //Salta a la diguiente celda en caso de que la haya sinó 
  //pasa a la fila siguiente y empieza por la columna 0.
  function obtenerSiguienteCelda(fila, columna) {
    if (columna === 8) {
      return { fila: fila + 1, columna: 0 };
    } else {
      return { fila, columna: columna + 1 };
    }
  }
  
  //Algoritmo de Fisher-Yates para un ordenamiento aleatorio
  function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function esCandidatoValido(matriz, fila, columna, candidato) {
    // Comprueba si el candidato no se repite en la misma fila, columna o bloque.
    return (
      !matriz[fila].includes(candidato) &&
      matriz.every(row => row[columna] !== candidato) &&
      !existeEnBloque(matriz, fila, columna, candidato)
    );
  }
  
  function existeEnBloque(matriz, fila, columna, candidato) {
    // Comprueba si el candidato existe en el bloque 3x3 actual
    const inicioFila = Math.floor(fila / 3) * 3;
    const inicioColumna = Math.floor(columna / 3) * 3;
    for (let i = inicioFila; i < inicioFila + 3; i++) {
      for (let j = inicioColumna; j < inicioColumna + 3; j++) {
        if (matriz[i][j] === candidato) {
          return true;
        }
      }
    }
    return false;
  }