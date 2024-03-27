#! /usr/bin/env node
import inquirer from "inquirer";
import { colors, printColoredMessage } from "../coloredPrint.js";

const stages: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
let points: number = 0;
let stage: number = 0;
let attempts: number = 0;
const closeNumber = (num: number, num2: number): boolean => {
  if (Math.abs(num - num2) <= 5) {
    if (num2 > num) {
      printColoredMessage("Your number is higher than the guessed number");
    } else {
      printColoredMessage("Your number is lower than the guessed number");
    }
  }
  return Math.abs(num - num2) <= 5;
};

const instructionConsole = () => {
  console.log(`
${colors.orange}HOW TO PLAY${colors.reset}
0. Difficulty level will increase by correct answer. Current difficulty level is ${
    colors.green
  }${stage + 1}${colors.reset}.
1. You need to guess a number between ${colors.yellow}1${colors.reset} to ${
    colors.green
  }${stages[stage]}${colors.reset}.
2. If you guess a lower number, score will be deducted by -1, and you will be informed to enter a higher number.
3. If you guess a higher number, score will be deducted by -1, and you will be informed to enter a lower number.
4. If close to the number, score will be added by 0.25.
5. After every 4 attempts, 1 point will be deducted in each stage.
6. If you guess correctly, Congratulations! you will get 5 points.
`);
};

let computerNumber: number = Math.floor(Math.random() * stages[stage] + 1);
printColoredMessage("Computer has guessed the number.");

export const number_guessing_game = async () => {
  attempts++;
  if (attempts % 4 === 0 && points > 0) {
    printColoredMessage('1 point has been deducted due to attempts limit exceeding by 4');
    points -= 1;
  }
  printColoredMessage(`Your score is ${points}`, points < 0 ? "red" : "green");

  let userNumber: { number: number } = await inquirer.prompt([
    {
      message: "Enter your number here",
      type: "number",
      name: "number",
      validate: function (input) {
        if (isNaN(input) || !input) {
          return "Please enter a valid number.";
        }
        return true;
      },
      filter: function (input) {
        if (isNaN(input) || !input) {
          return undefined; // Clear input
        }
        return input;
      },
    },
  ]);

  if (userNumber.number !== computerNumber) {
    if (closeNumber(computerNumber, userNumber.number)) {
      points += 0.25;
      printColoredMessage(`You are too close to guess the number :)`);
    } else {
      points -= 1;
      if (userNumber.number > computerNumber) {
        printColoredMessage(
          `You guessed ${userNumber.number}, which is a higher number`,
          "yellow"
        );
      } else {
        printColoredMessage(
          `You guessed ${userNumber.number}, which is a lower number`,
          "yellow"
        );
      }
    }
    await number_guessing_game();
  } else {
    printColoredMessage(
      `Hoorah!! You guessed the right number ${computerNumber} 😊`,
      "green"
    );
    const continueGame = await inquirer.prompt([
      {
        message: "Do you want to continue your Game",
        type: "confirm",
        name: "continue",
      },
    ]);
    points += 5;
    if (continueGame.continue) {
      stage++;
      if (stage >= stages.length) {
        printColoredMessage(`Congratulations! You have completed all stages. Your total score is ${points}`, "green");
        return;
      }
      computerNumber = Math.floor(Math.random() * stages[stage] + 1);
      attempts = 0;
      instructionConsole();
      await number_guessing_game();
    } else {
      printColoredMessage(`Your total score is ${points}`, "green");
    }
  }
};

instructionConsole();
number_guessing_game();
