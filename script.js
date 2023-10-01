const operator_priority = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

const isOperator = (c) => "/*-+".includes(c);
const isNumber = (c) => !isNaN(c);
const getItemsFromText = (text) => {
  const result = text.split(/([+\-/*\)\(])/);
  return result.filter((item) => item !== "");
};

let current_text = "";

const operator_stack = [];
const postfix_stack = [];

function calculatePostfix() {
  const items = getItemsFromText(current_text);
  console.log(items);
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

function main() {
  const buttons = document.querySelectorAll("button");
  let display = document.getElementById("display");

  display.textContent = "";
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const btnValue = e.currentTarget.value;

      if (btnValue === "=") {
        calculatePostfix();
        console.log(postfix_stack);
        postfix_stack.splice(0); // empty array
      } else if (btnValue === "C") {
        current_text = "";
      } else {
        current_text += "" + btnValue;
      }

      display.textContent = current_text;
    });
  });
}
document.addEventListener("DOMContentLoaded", main);
