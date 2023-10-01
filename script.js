const operator_priority = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
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

function isOperationValid() {
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

const operator_stack = [];
const postfix_stack = [];

function calculatePostfix() {
  postfix_stack.splice(0); // empty postfix stack
  const items = getItemsFromText(current_text);
  items.forEach((item) => {
    if (item === "(") {
      operator_stack.push("(");
    } else if (item === ")") {
      while (operator_stack.length > 0) {
        const lastItem = operator_stack.pop();
        if (lastItem === "(") break;
        postfix_stack.push(lastItem);
      }
    } else if (isOperator(item)) {
      while (operator_stack.length > 0) {
        const lastItem = operator_stack[operator_stack.length - 1];
        if (
          isOperator(lastItem) &&
          operator_priority[lastItem] >= operator_priority[item]
        ) {
          postfix_stack.push(lastItem);
          operator_stack.pop();
        } else {
          break;
        }
      }
      operator_stack.push(item);
    } else if (isNumber(item)) {
      const numValue = parseFloat(item);
      postfix_stack.push(numValue);
    }
  });
  while (operator_stack.length > 0) {
    postfix_stack.push(operator_stack.pop());
  }
}

function handleDisplay() {
  let display = document.getElementById("display");
  if (isOperationValid()) {
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
        console.log(postfix_stack);
      } else if (btnValue === "C") {
        current_text = "";
      } else {
        current_text += "" + btnValue;
      }

      calculatePostfix();
      handleDisplay();
    });
  });
}
document.addEventListener("DOMContentLoaded", main);
