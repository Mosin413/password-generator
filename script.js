const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]"); 
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

setIndicator("#ccc");

function handleSlider() {
  lengthDisplay.innerText = passwordLength;
  inputSlider.value = passwordLength;
  
  // something +++++

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRandomInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}
// uppercaseCheck.checked=true;
// lowercaseCheck.checked=true;
// numbersCheck.checked=true;
// symbolsCheck.checked=true;

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  // to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
    // array.forEach((el) => (str += el));     // use to convert generated shuffle array into string
    // return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

//   if (passwordLength < checkCount) {
//     passwordLength = checkCount;
//     handleSlider();
//   }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) {
    return;
  }
//   if (checkCount > passwordLength) {
//     passwordLength = checkCount;
//     handleSlider();
//   }
  

  password = ""; // remove old password

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  shufflePassword(funcArr)

  if(checkCount > passwordLength){
    
    // shufflePassword(funcArr)
    funcArr.length = passwordLength
  }

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndexOfFuncArr = getRandomInteger(0, funcArr.length);
    password += funcArr[randIndexOfFuncArr]();
  }

  // password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});
