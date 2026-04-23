import { Calculate, DoesEndWithMathSymbol } from "./calculations.js";

let currentCalcString = "0";
let currentOp = '';

let bHasDecimal = false;
let bHasValue = false;
let bCompletedCalc = false;

// references to elements on the DOM
const display = document.getElementById("display");
const buttonArr = [...document.getElementsByClassName("btn")];

// bindings
buttonArr.forEach(btn => {
    btn.addEventListener('click', HandleButtonPress);
});
window.addEventListener("keydown", HandleKeyPress);

// handle keyboard input
function HandleKeyPress(event)
{
    switch(event.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case ".": {
            HandleNum(event.key);
            break;
        }
        case "Enter":
        case "=": {
            HandleOp("=");
            break;
        }
        case "Backspace":
        {
            HandleOp("DEL");
            break;
        }
        case "Escape": {
            HandleOp("C");
            break;
        }
        case "+": {
            HandleOp("+");
            break;
        }
        case "-": {
            HandleOp("-");
            break;
        }
        case "x":
        case "*": {
            HandleOp('*');
            break;
        }
        case "/": {
            HandleOp("/");
            break;
        }
        default: return;
    }

    display.firstChild.textContent = currentCalcString.toString();
}

function HandleButtonPress(event)
{
    // get the value of the button pressed
    const value = event.target.dataset.btn;

    if(event.target.classList.contains("op"))
        HandleOp(value);
    else if(event.target.classList.contains("num"))
        HandleNum(value);
    else // edge case break
        return;

    // set the display to the modified calcValue
    display.firstChild.textContent = currentCalcString.toString();
}

// Handle adding basic numbers
function HandleNum(value)
{
    if(value === ".")
    {
        // check if current value already has decimal
        if(bHasDecimal === true || /[^0-9]$/.test(currentCalcString))
            return;

        bHasDecimal = true;
        bCompletedCalc = false;
    }

    // if value is 0, replace as first number
    if(currentCalcString === '0' || bCompletedCalc === true)
        currentCalcString = value;
    else
        currentCalcString += value;


    bCompletedCalc = false;
}

// handle special keys such as Clear, Delete, Equals, and Math Symbols
function HandleOp(value)
{
    bCompletedCalc = false;

    switch(value){
        case "C":
        {
            // reset calculator string to 0
            currentCalcString = "0";
            currentOp = "";
            bHasDecimal = false;

            break;
        }
        case "DEL":
        {
            HandleDelete();
            break;
        }
        case "=": {
            currentCalcString = CalculateEqualsResult(currentCalcString);
            currentOp = "";
            bHasValue = currentCalcString.includes(".");
            bCompletedCalc = true;
            break;
        }
        case "Negate":
        {
            if(currentOp === "")
            {
                currentCalcString = NegateNumber(parseFloat(currentCalcString)).toString()
            }
            else
            {
                if(DoesEndWithMathSymbol(currentCalcString))
                    return;

                const [a, b] = currentCalcString.split(currentOp);
                const negatedB = NegateNumber(parseFloat(b))

                // make sure to pass a string so it doesn't break
                currentCalcString = a + "" + currentOp + "" + negatedB;
            }
            break;
        } // not one of the special cases
        default: {
            HandleMathSymbol(value);
            break;
        }
    }

    return false;
}

function CalculateEqualsResult(calcString)
{
    // split string by math symbol
    const [a, b] = calcString.split(currentOp);
    // calculate result of operation a * b, a - b, etc...
    const result = currentOp ? Calculate(currentOp, a, b) : null;
    // if result fails return the unmodified string
    return result != null ? result.toString() : calcString;
}

function NegateNumber(numberToNegate)
{
    return numberToNegate * -1;
}

function HandleMathSymbol(value)
{
    // append zero to float if decimal is last character
    if(bHasDecimal === true && currentCalcString.at(-1) === ".")
        currentCalcString += "0";

    // if currentOp already exists replace with this Op
    if (currentOp !== "") {
        if (DoesEndWithMathSymbol(currentCalcString))
        {
            // remove last char from calculator string & add new one
            currentCalcString = currentCalcString.substring(0, currentCalcString.length - 1);
            currentCalcString += value;
            currentOp = value;

            // in case last key was the decimal
            bHasDecimal = false;
        }
        else
        {
            // calc previous operations so that there is only one at a time
            currentCalcString = CalculateEqualsResult(currentCalcString);
            currentOp = "";
            bHasValue = currentCalcString.includes(".");

            // break string into operation, a and b
            let [a, b] = currentCalcString.split(currentOp);
            let result = currentOp ? Calculate(currentOp, a, b) : null;

            currentCalcString = (result != null && isNaN(result)) ? result.toString() : currentCalcString;
            currentOp = value;
            currentCalcString += value;

            bHasDecimal = false;
        }
    }
    else {
        currentOp = value;
        currentCalcString += value;

        bHasDecimal = false;
    }
}

function HandleDelete()
{
    // reset calculator to default if only one character to delete
    if (currentCalcString.length === 1)
    {
        currentCalcString = '0';
        bHasValue = false;
        bHasDecimal = false;
    }
    else
    {
        // remove last character
        currentCalcString = currentCalcString.substring(0, currentCalcString.length - 1);
    }

    console.log(currentCalcString.at(-1));

    if (DoesEndWithMathSymbol(currentCalcString)) {
        currentOp = currentCalcString.at(-1);
        bHasValue = currentCalcString.includes(".");
        bHasDecimal = false;
    }
    else if (currentCalcString.endsWith(".")) {
        bHasDecimal = true;
    }
}