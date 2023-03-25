
const error = document.getElementById('error-message');

const listValidChars = "abcdefghijklmnopqrstuvwxyz1234567890_";

const validateForm = () => {
    let input = document.forms['username-input']['username'].value;
    let errorList = new Array();
    
    if (input.length < 1 || input.length > 20) 
        errorList.push(NewErrorNode("Must be between 1 and 20 characters"));

    if (CheckValidChars(input, listValidChars))
        errorList.push(NewErrorNode("Can only contain letters, numbers, and underscores"));

    

    error.children = errorList;
    if (errorList[1] !== undefined) {
        return false;
    }
}

//Function: NewErrorNode
//Params:
//  errorMessage: message to show in error node
//Returns: Html list element with errorMessage as its text
const NewErrorNode = (errorMessage) => {
    let e = document.createElement('li');
    e.innerHTML = errorMessage;
    return e;
}


//Function: CheckValidChars
//Params: 
//  input: user input string
//  validChars: string of all valid characters
//Returns: true if all chars in input are valid; false otherwise
const CheckValidChars = (input, validChars) => {
    for (let c of input) {
        c = c.toLowerCase();
        if (!validChars.includes(c)) return false;
    }
    return true;
}