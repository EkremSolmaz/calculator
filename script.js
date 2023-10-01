const operator_priority = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};
const operatorMap = {
  "+": (n1, n2) => n1 + n2,
  "-": (n1, n2) => n1 - n2,
  "*": (n1, n2) => n1 * n2,
  "/": (n1, n2) => n1 / n2,
};

const isOperator = (c) => "/*-+".includes(c);
const isNumber = (c) => !isNaN(c);
const addLeadingZero = (items) => {
  if (items.length > 0 && isOperator(items[0])) {
    return [0, ...items];
  }
  return items;
};
const getItemsFromText = (text) => {
  const result = text.split(/([+\-/*\)\(])/);
  return addLeadingZero(result.filter((item) => item !== ""));
};

function areParenthesesMatch() {
  const stack = [];

  for (let char of current_text) {
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      if (stack.pop() !== "(") {
        return false;
      }
    }
  }

  return stack.length === 0;
}

function areOperatorsValid() {
  const operators = "/*-+";

  for (let i = 0; i < current_text.length - 1; i++) {
    const char1 = current_text[i];
    const char2 = current_text[i + 1];

    if (operators.includes(char1) && operators.includes(char2)) {
      return false;
    }
  }

  return true;
}

function areParenthesesValid() {
  const regex = /\d\(|\)\d/g; //Check if parantheses are not next to a number
  return !regex.test(current_text);
}

function areDecimalsValid() {
  const items = getItemsFromText(current_text);
  return items.every((item) => {
    const regex = /\..*\./g; //Check if a number has one decimal point at most
    return !regex.test(item);
  });
}

function isValid() {
  const errorDisplay = document.getElementById("error_display");
  let result = true;
  let errorText = "";
  if (!areOperatorsValid()) {
    errorText = "Double operators not allowed";
    result = false;
  }
  if (!areParenthesesValid()) {
    errorText = "Parentheses next to numbers are not allowed";
    result = false;
  }
  if (!areParenthesesMatch()) {
    errorText = "Parentheses do not match";
    result = false;
  }
  if (!areDecimalsValid()) {
    errorText = "A number cannot have multiple decimal points";
    result = false;
  }

  errorDisplay.textContent = errorText;
  return result;
}

let current_text = "";

const operatorStack = [];
const postfixStack = [];
const solveStack = [];

function calculatePostfix() {
  postfixStack.splice(0); // empty postfix stack
  const items = getItemsFromText(current_text);
  items.forEach((item) => {
    if (item === "(") {
      operatorStack.push("(");
    } else if (item === ")") {
      while (operatorStack.length > 0) {
        const lastItem = operatorStack.pop();
        if (lastItem === "(") break;
        postfixStack.push(lastItem);
      }
    } else if (isOperator(item)) {
      while (operatorStack.length > 0) {
        const lastItem = operatorStack[operatorStack.length - 1];
        if (
          isOperator(lastItem) &&
          operator_priority[lastItem] >= operator_priority[item]
        ) {
          postfixStack.push(lastItem);
          operatorStack.pop();
        } else {
          break;
        }
      }
      operatorStack.push(item);
    } else if (isNumber(item)) {
      const numValue = parseFloat(item);
      postfixStack.push(numValue);
    }
  });
  while (operatorStack.length > 0) {
    postfixStack.push(operatorStack.pop());
  }
}

function solvePostfix() {
  postfixStack.forEach((item) => {
    if (isOperator(item)) {
      if (solveStack.length < 2) {
        throw new Error("Something went wrong");
      }
      const n1 = solveStack.pop();
      const n2 = solveStack.pop();
      solveStack.push(operatorMap[item](n2, n1));
    } else {
      if (!isNumber(item)) {
        throw new Error("Something went wrong");
      }
      solveStack.push(item);
    }
  });

  if (solveStack.length !== 1) {
    throw new Error("Something went wrong");
  }
  current_text = solveStack.pop().toString();
}

function calculate() {
  if (!isValid()) {
    handleDisplay(false);
    return;
  }

  calculatePostfix();
  console.log(postfixStack);
  solvePostfix();

  handleDisplay(true);
}

function handleDisplay(isValid) {
  let display = document.getElementById("display");
  if (isValid) {
    display.classList.remove("invalid");
    display.classList.add("valid");
  } else {
    display.classList.remove("valid");
    display.classList.add("invalid");
  }

  display.textContent = current_text;
}

function main() {
  const buttons = document.querySelectorAll("button");
  display.textContent = "";
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const btnValue = e.currentTarget.value;

      if (btnValue === "=") {
        calculate();
        return;
      } else if (btnValue === "C") {
        current_text = "";
      } else {
        current_text += "" + btnValue;
      }

      handleDisplay(isValid(current_text));
    });
  });
}
document.addEventListener("DOMContentLoaded", main);
