const add = (a,b) => a + b;
const subtract = (a,b) => a - b;
const multiply = (a,b) => a * b;
const divide = (a,b) => a / b;
const percentage = (a,b) => ( a / 100 ) * b;

export function Calculate(op, a, b)
{
    a = parseFloat(a);
    b = parseFloat(b);

    if(op !== "%" && isNaN(b))
        return;

    b = isNaN(b) ? null : b;

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
        case '*': {
            result = multiply(a, b);
            break;
        }
        case '/': {
            result = divide(a, b);
            break;
        }
        case "%":
            result = percentage(a, b);
            break;
    }

    console.dir("end of switch: " + result);
    return (Math.round((result + Number.EPSILON) * 100) / 100).toString();
}

export function DoesEndWithMathSymbol(text) {
    return text.endsWith('+')
        || text.endsWith('-')
        || text.endsWith('*')
        || text.endsWith('/')
        || text.endsWith('%');
}