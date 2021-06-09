let calcValue = "0";
let currOp = '';
let bHasDecimal = false;
const ops = new RegExp("^.*[+-X/]$");
const display = document.getElementById("display");

display.firstChild.textContent = calcValue;

let btns = [...document.getElementsByClassName("btn")];

const add = (a,b) => { return a + b };
const subtract = (a,b) => { return a - b };
const multiply = (a,b) => { return a * b };
const divide = (a,b) => { return a / b};

btns.forEach(btn => {
    btn.addEventListener('click', HandleButtonPress);
});

window.addEventListener("keydown", HandleKeyPress);

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
            HandleOp("AC");
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
            HandleOp("X");
            break;
        }
        case "/": {
            HandleOp("/");
            break;
        }
    }

    display.firstChild.textContent = calcValue.toString();
}

function HandleButtonPress(event) 
{
    const value = event.target.textContent;

    if(event.target.classList.contains("op"))
    {
        HandleOp(value);
        console.dir("op");
    }
    else if(event.target.classList.contains("num"))
    {
        HandleNum(value);
        console.dir("num");
    }

    display.firstChild.textContent = calcValue.toString();
}

function HandleNum(value)
{
    console.dir(value);

    if(value == ".")
    {
        if(bHasDecimal == true || /[^0-9]$/.test(calcValue))
            return;

        bHasDecimal = true; 
    }

    if(calcValue == '0')
        calcValue = value;
    else
         calcValue += value;
}

function HandleOp(value)
{
    switch(value){
        case "AC": {
            calcValue = "0";
            currOp = "";
            bHasDecimal = false;

            break;
        }
        case "DEL":{
            HandleDelete();
            break;
        }
        case "=": {
            let [a, b] = calcValue.split(currOp);
            let newVal = currOp ? operator(currOp, a, b) : null;
            console.dir(newVal);
            calcValue = newVal != null ? newVal.toString() : calcValue;
            currOp = "";
            bHasValue = calcValue.includes(".");

            break;
        }
        default: {    
            HandleMathSymbol(value);
            break;
        }
    }
}

function HandleMathSymbol(value) 
{
    if (currOp != "") {
        if (calcValue.endsWith('+') || calcValue.endsWith('-') || calcValue.endsWith('X') || calcValue.endsWith('/')) {
            calcValue = calcValue.substring(0, calcValue.length - 1);
            calcValue += value;
            currOp = value;

            bHasDecimal = false;
        }
        else {
            let [a, b] = calcValue.split(currOp);
            let newVal = currOp ? operator(currOp, a, b) : null;
            console.dir(newVal);
            calcValue = newVal != null ? newVal.toString() : calcValue;

            currOp = value;
            calcValue += value;

            bHasDecimal = false;
        }
    }
    else {
        currOp = value;
        calcValue += value;

        bHasDecimal = false;
    }
}

function HandleDelete()
{
    if (calcValue.endsWith('+') || calcValue.endsWith('-') || calcValue.endsWith('X') || calcValue.endsWith('/')) {
        currOp = "";

        bHasValue = calcValue.includes(".");
    }
    else if (calcValue.endsWith(".")) {
        bHasDecimal = false;
    }

    if (calcValue.length == 1)
        calcValue = 0;
    else
        calcValue = calcValue.substring(0, calcValue.length - 1);
}

function operator(op, a, b)
{
    a = parseFloat(a);
    b = parseFloat(b);

    let result = null;

    switch(op)
    {
        case '+': {
            result = add(a, b);
            break;
        }
        case '-': {
            result = subtract(a, b);
            break;
        }
        case 'X': {
            result = multiply(a, b);
            break;
        }
        case '/': {
            result = divide(a, b);
            break;
        }
    }

    console.dir("end of switch: " + result);
    return (Math.round((result + Number.EPSILON) * 100) / 100).toString();
}