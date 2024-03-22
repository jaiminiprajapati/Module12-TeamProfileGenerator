const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const employeeTeam = [];

const questions = {
  manager: [
    { type: "input", name: "name", message: "What is the Team Manager's Name?" },
    { type: "input", name: "empId", message: "Enter the manager's employee ID:" },
    { type: "input", name: "email", message: "Enter the manager's email address:" },
    { type: "input", name: "officeNum", message: "Enter the manager's office number:" },
  ],
  engineer: [
    { type: "input", name: "name", message: "What is the Engineer's Name?" },
    { type: "input", name: "id", message: "Enter the employee ID:" },
    { type: "input", name: "email", message: "Enter the email address:" },
    { type: "input", name: "github", message: "Enter the GitHub username:" },
  ],
  intern: [
    { type: "input", name: "name", message: "What is the Intern's Name?" },
    { type: "input", name: "id", message: "Enter the employee ID:" },
    { type: "input", name: "email", message: "Enter the email address:" },
    { type: "input", name: "school", message: "Enter the school name:" },
  ],
};

async function addEmployee(role, EmployeeClass) {
  const answers = await inquirer.prompt(questions[role]);
  const employee = new EmployeeClass(...Object.values(answers));
  employeeTeam.push(employee);
  console.log(employee);
}

async function buildTeam() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, render(employeeTeam), 'utf-8');
    console.log(`Team Created`);
}

async function menu() {
  const userChoice = await inquirer.prompt({
    type: "list",
    name: "choice",
    message: "Enter your choice:",
    choices: ["Add an engineer", "Add an intern", "Finish building the team"],
  });
  return userChoice.choice;
}

async function init() {
  await addEmployee('manager', Manager);
  let userChoice = await menu();
  while (userChoice !== "Finish building the team") {
    if (userChoice === "Add an engineer") {
      await addEmployee('engineer', Engineer);
    }
    if (userChoice === "Add an intern") {
      await addEmployee('intern', Intern);
    }
    userChoice = await menu();
  }
  buildTeam();
}

init();
