class JuegoCartas21 {
  constructor() {
    this.apiCarta = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    this.deckId = null
    this.playerHand = []
    this.dealerHand = []
    this.playerScore = 0
    this.dealerScore = 0
    this.gameOver = false
  }

  async getNewDeck() {
    const response = await fetch(this.apiCarta)
    const data = await response.json()
    this.deckId = data.deck_id
  }

  async shuffleDeck() {
    const shuffleUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`;
    await fetch(shuffleUrl, { method: "POST" })
  }

  async hit() {
    if (this.gameOver) return;
  
    const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${this.playerHand.length === 0 ? 2 : 1}`;
    const response = await fetch(drawUrl);
    const data = await response.json();
    const cards = data.cards;
    
    if (this.playerHand.length === 0) {
      for (const card of cards) {
        const value = this.getCardValue(card);
        this.playerHand.push(card);
        this.playerScore += value;
        const playerHandElement = document.getElementById("player-hand");
        playerHandElement.innerHTML += `<img src="${card.image}">`;
      }
    } else {
      const card = cards[0];
      const value = this.getCardValue(card);
      this.playerHand.push(card);
      this.playerScore += value;
      const playerHandElement = document.getElementById("player-hand");
      playerHandElement.innerHTML += `<img src="${card.image}">`;
    }
  
    const cartasRecibidas = this.playerHand.length === 0 ? 2 : 1;
    const message = cartasRecibidas > 1 ? `Has recibido ${cartasRecibidas} cartas.` : "";
    document.getElementById("mensaje").textContent = `${message} Tu puntuación actual es ${this.playerScore}.`;
  
    if (this.playerScore > 21) {
      document.getElementById("mensaje").textContent = "¡Te has pasado de 21! Has perdido😥.";
      this.endGame();
    }
  }
  

  async stand() {
    if (this.gameOver) return

    while (this.dealerScore < 17) {
      const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`
      const response = await fetch(drawUrl)
      const data = await response.json()
      const card = data.cards[0]
      const value = this.getCardValue(card)

      this.dealerHand.push(card)
      this.dealerScore += value

      const dealerHandElement = document.getElementById("dealer-hand")
      dealerHandElement.innerHTML += `<img src="${card.image}">`
    }

    if (this.dealerScore > 21 || this.playerScore > this.dealerScore) {
      document.getElementById("mensaje").textContent = "¡Has ganado!🏆"
    } else if (this.playerScore < this.dealerScore) {
      document.getElementById("mensaje").textContent = "Has perdido😭."
    } else {
      document.getElementById("mensaje").textContent = "¡Empate!🤛🏻🤜🏻"
    }

    this.endGame()
    this.displayScores()
  }

  reset() {
    this.deckId = null
    this.playerHand = []
    this.dealerHand = []
    this.playerScore = 0
    this.dealerScore = 0
    this.gameOver = false

    document.getElementById("player-hand").innerHTML = ""
    document.getElementById("dealer-hand").innerHTML = ""
    document.getElementById("mensaje").textContent = ""

    this.startGame()
    this.displayScores()
  }

  getCardValue(card) {
    if (card.value === "ACE") {
      return 1
    } else if (["KING", "QUEEN", "JACK"].includes(card.value)) {
      return 10
    } else {
      return parseInt(card.value)
    }
  }

  displayScores() {
    document.getElementById("puntosJugador").textContent = `Puntaje total del jugador: ${this.playerScore}`
    document.getElementById("puntosComputadora").textContent = `Puntaje total de la computadora: ${this.dealerScore}`
  }

  async startGame() {
    await this.getNewDeck()
    await this.shuffleDeck()

    document.getElementById("hit-button").disabled = false
    document.getElementById("stand-button").disabled = false
  }

  endGame() {
    this.gameOver = true
    document.getElementById("hit-button").disabled = true
    document.getElementById("stand-button").disabled = true

    this.displayScores()
  }
}

// Referencias a los elementos de los botones
const pedirButton = document.getElementById("hit-button")
const mostrarButton = document.getElementById("stand-button")
const reiniciarButton = document.getElementById("reset-button")

// Instancia de la clase
const juego = new JuegoCartas21()


pedirButton.addEventListener("click", () => {
  juego.hit()
})

mostrarButton.addEventListener("click", () => {
  juego.stand()
})

reiniciarButton.addEventListener("click", () => {
  juego.reset()
})


juego.startGame()

