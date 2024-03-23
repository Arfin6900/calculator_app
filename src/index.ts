import inquirer from "inquirer";
import { printColoredMessage } from "../coloredPrint.js";
const choices = [
  {
    name: "Subtraction",
    sign: "-",
  },
  {
    name: "Addition",
    sign: "+",
  },
  {
    name: "multiply",
    sign: "*",
  },
  {
    name: "divide",
    sign: "/",
  },
];
interface OperatorsInterface {
  Subtraction: string;
  Addition: string;
  multiply: string;
  divide: string;
}
const Operators: OperatorsInterface = {
  Subtraction: "-",
  Addition: "+",
  multiply: "*",
  divide: "/",
};
export const calculator = async (prevNum?: number) => {
  let expressions = await inquirer.prompt([
    {
      message: "Enter your number here :",
      type: "number",
      name: "number",
      default: prevNum,
      validate: function (input) {
        if (isNaN(input) || !input) {
          return "Please enter a valid number.";
        }
        return true;
      },
      filter: function(input) {
        if (isNaN(input) || !input) {
          return undefined; // Clear input
        }
        return input;
      },
    },
    {
      message: "Enter operation ",
      type: "list",
      choices: choices,
      name: "operator",
    },
    {
      message: "Enter your second number here :",
      type: "number",
      name: "second_number",
      validate: function (input) {
        if (isNaN(input) || !input) {
          return "Please enter a valid number.";
        }
        return true;
      },
      filter: function(input) {
        if (isNaN(input) || !input) {
          return undefined; // Clear input
        }
        return input;
      },
    },
  ]);
  let firstNumber = expressions.number;
  let operator: keyof OperatorsInterface = expressions.operator;
  let lastNumber = expressions.second_number;
  let calculatedValue = `${eval(
    `${firstNumber}${Operators[operator]}${lastNumber}`
  )}`;
  printColoredMessage(`Calculated Value is ${calculatedValue}`, "green");
  let isContinue = await inquirer.prompt([
    { message: "Do you want to continue?", type: "confirm", name: "continue" },
  ]);
  if (isContinue.continue) {
    await calculator(Number(calculatedValue));
  }
  // if (index !== 4 ){
  //   await calculator()
  // }
};


calculator()