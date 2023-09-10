const suits = ["kupa", "karo", "sinek", "maça"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "vale", "kız", "papaz", "as"];

const cards = [];

let cardId = 1;

for (const suit of suits) {
  for (const value of values) {
    const card = {
      id: cardId,
      cardName: value,
      type: suit,
      point: value === "as" ? [1, 11] : (value === "vale" || value === "kız" || value === "papaz") ? [10] : [parseInt(value)]
    };  //ternary operatörü kullandım. üçüncü üçlü operator:eğer diğer koşullar sağlanmazsa kartın değerini sayıya çevirir puan olarak atar.
    cards.push(card);
    cardId++;
  }
}

// console.log(cards);

var betAmountElement = document.getElementById("betAmount");
betAmountElement.textContent = 1000;
var betAmountInteger = 1000;
var isZero = false; // Kalan bahis miktarı sıfıra ulaşırsa takip etmek için.
const form = document.querySelector('form');
const betInput = document.getElementById('bet');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!isZero) {
    start();
  } else {
    resetBetAmountConfirmation();
  }
});

function start() {
  let betValue = parseInt(betInput.value);


  if (betValue <= betAmountInteger) {
    let betAmountSonuc = betAmountInteger - betValue;

    if (betAmountSonuc >= 0) {
      betAmountInteger = betAmountSonuc;
      betAmountElement.textContent = betAmountSonuc; // Ekran görüntülenen kalan bahis miktarını güncelle
    } else {

      alert('The betting value is huge!');
    }
  }
  else if (betValue !== '') {
    alert('Enter Bet Amount')
  }
  else {
    alert('Error: Bet value cannot be greater than remaining bet amount!');
  }

  if (betAmountInteger === 0) {
    isZero = true;
    alert("Your remaining bet amount is zero. Click 'Start' to reset.");
  }
}

function resetBetAmountConfirmation() {
  var resetConfirmed = confirm("Do you want to reset the bet amount?");
  if (resetConfirmed) {
    resetBetAmount();
  } else {
    isZero = false; // sıfırlamak istemediği durumda oyun devam eder
  }
}

function resetBetAmount() {
  isZero = false;
  betAmountInteger = 1000;
  betAmountElement.textContent = betAmountInteger;
}
const crawCard = document.getElementById('crawCard');
betInput.addEventListener('input', function () {
  if (betInput.value.trim() !== ' ') {
    crawCard.removeAttribute('disabled');
  }
  else {
    crawCard.setAttribute('disabled', 'disabled');
  }
})
let selectedUsedCards = [];
let selectedComputerCards = [];
let upperCard = null; // ilk kart seçimi yapılmadığında ve henüz herhangi bir kart seçilmemişken bu değişkene erişilirse 'null' değeri döner.Herhangi bir kart bilgisi tutulmadığını gösterir
let lowerCard = null;

const crawCardButton = document.querySelector(".crawCard");
crawCardButton.addEventListener("click", function () {

  if (betInput.value.trim() !== '') {
    crawCardButton.removeAttribute('disabled');
  } else {
    crawCardButton.setAttribute('disabled', 'disabled');
    return
  }
  createCard()
});

let playerPoint = 0;
let computerPoint = 0;
function createCard() {
  // Tüm kartları seçmişsek, seçilen kartlar listesini sıfırlayalım
  if (selectedUsedCards.length === cards.length || selectedComputerCards.length === cards.length) {
    selectedCards = [];
  }

  let availableCards = cards;

  const userCard = pickCard(availableCards);
  selectedUsedCards.push(userCard);
  availableCards = removeCardFromDeck(userCard, availableCards);
  divCreator("lowerCard", userCard)
  console.log("Kullanıcının Seçtiği Kart:", userCard);
  let checkUser = calculateTotalPoints("oyuncu");
  if (checkUser == "pc") {
    alert('Computer Won!')
    resetGame();
    return
  }
  else if (checkUser == "user") {
    alert('Congratulations you won!')
    resetGame();
    return
  }

  const computerCard = pickCard(availableCards); //rastgele seçilen kart computerCard de saklanır.bu sayede oyuncuya her seferinde farklı kartlar sunulabilir.
  selectedComputerCards.push(computerCard);
  availableCards = removeCardFromDeck(computerCard, availableCards);
  divCreator("upperCard", computerCard)
  console.log("Bilgisayarın Seçtiği Kart:", computerCard);
  let checkComputer = calculateTotalPoints("computer");
  if (checkComputer == "pc") {
    alert('Computer Won');
    resetGame();
    return
  }
  else if (checkComputer == "user") {
    alert('Congratulations you won!')
    resetGame();
    return
  }
  console.log(playerPoint, computerPoint)
}
const divCreator = (cardContainer, card) => {
  var divCreate = document.createElement('div');
  var cardContainerDiv = document.getElementById(cardContainer);
  cardContainer == "upperCard" ? divCreate.textContent = "Hidden" : divCreate.textContent = `${card.cardName} - ${card.type}- ${card.point}`;
  divCreate.classList = "cardContent";
  cardContainerDiv.appendChild(divCreate);
}
const pickCard = (availableCards) => {
  const index = Math.floor(Math.random() * availableCards.length);
  return availableCards[index];
}
const removeCardFromDeck = (card, availableCards) => {
  const usedCardIndex2 = availableCards.findIndex(deckCard => deckCard.id === card.id);
  availableCards.splice(usedCardIndex2, 1);
  return availableCards
}
function calculateTotalPoints(playerType) {

  if (playerType == "oyuncu") {
    playerPoint = 0;
    selectedUsedCards.map((card) => {
      playerPoint = playerPoint + card.point[0];
    })

    if (playerPoint < 21) {
      return "devam"
    }
    else if (playerPoint == 21) {
      return "user";
    }
    else {
      return "pc";
    }
  }
  else if (playerType == "computer") {
    computerPoint = 0;
    selectedComputerCards?.map((card) => {
      computerPoint = computerPoint + card.point[0];
      console.log('test');
    })
    if (computerPoint < 21) {
      return "devam"
    }
    else if (computerPoint == 21) {
      return "pc";
    }
    else {
      return "user";
    }
  }
}
function resetGame() {
  playerPoint = 0;
  computerPoint = 0;
  selectedUsedCards = [];
  selectedComputerCards = [];
  setTimeout(function () { alert('Game Restarted!'); }, 700);
  removeCard(); // Oyun yeniden başlatıldığında kartları temizle
  const betInput = document.getElementById('bet');
  betInput.value = ''; // Bahis miktarı giriş alanını temizle
  setTimeout(function () { alert('Enter a new bet.'); }, 1000);
}
function removeCard() {
  const parentUser = document.getElementById('lowerCard');
  const parentComputer = document.getElementById('upperCard');
  removeElement(parentUser);
  removeElement(parentComputer);
}
function removeElement(element) {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}