document.getElementById("submitNumerals").addEventListener("click", function(event) {
    event.preventDefault();
    // store current input in text field in lowercase to allow capital and
    // lowercase numeral inputs
    const input = document.getElementById("numeralsInput").value.toLowerCase();
    if (input === "")
    // do nothing if nothing is in text field. OR could send a message here
        return;
    
    console.log(input);    
    // output function using nodes
    function displayResult(message) {
        const resultText = document.createElement("p");
        resultText.appendChild(document.createTextNode(message));
        const result = document.getElementById("conversionResult");
        if (result.hasChildNodes()) {
            result.replaceChild(resultText, result.childNodes[0]);
        }
        else {
            result.appendChild(resultText);
        }
    }
    // base value of each numeral
    const numValue = new Map();
    numValue.set("i", 1);
    numValue.set("v", 5);
    numValue.set("x", 10);
    numValue.set("l", 50);
    numValue.set("c", 100);
    numValue.set("d", 500);
    numValue.set("m", 1000);
    // magnitude will map each Roman Numeral to a weight so we don't need tons
    // of if statements for each symbol when parsing input
    const magnitude = new Map();
    magnitude.set("i", 1);
    magnitude.set("v", 2);
    magnitude.set("x", 3);
    magnitude.set("l", 4);
    magnitude.set("c", 5);
    magnitude.set("d", 6);
    magnitude.set("m", 7);
    
    // keep track of which magnitude we are on. Starts at 8 to see if at beginning
    // of the input
    let prevMagnitude = 8;
    let currMagnitude = 7;
    // keep track of repeated numerals. Cannot allow more than 3 in a row
    let repeatedNumeralCntr = 1;
    // this will flag when a subtractive pair was used. Cannot have same or
    // greater magnitude of symbol after this.
    let followsSubtractivePair = false;
    // keep track of previous numeral. Starts as undefined to know where *%*%*%*%
    let prevNumeral;
    // number we are building
    let arabicNumeral = 0;
    
    // loop through input--may want to play with i so no for each
    for (let i = 0; i < input.length; i++) {
        console.log(arabicNumeral);
        console.log(input[i]);
        // if the current character is one of the list of numerals
        if (magnitude.get(input[i]) !== undefined) {
            currMagnitude = magnitude.get(input[i]);
            // if previous numeral was the same as current
            if (prevMagnitude === currMagnitude) {
                // if there was a subtractive pair with this same numeral
                if (followsSubtractivePair) {
                    displayResult("Invalid Input: cannot have a subtractive pair followed " +
                    "by the same numeral");
                    return;
                }
                else {
                    followsSubtractivePair = false; // reset flag
                }
                // if current magnitude is a half step numeral ('v', 'l', or 'd'), then there
                // cannot be two in a row
                if ((currMagnitude === 2) || (currMagnitude === 4) || (currMagnitude === 6)) {
                    displayResult("Invalid Input: cannot have two in a row of 'V,' " +
                    "'L,' or 'D'");
                    return;
                }
                // if the current numeral hasn't been repeated 3 times
                if (repeatedNumeralCntr < 3) {
                    repeatedNumeralCntr += 1;
                    if (i === input.length - 1) {
                        // then this is the end of the numeral input and is ready
                        // to output
                        arabicNumeral += numValue.get(input[i]) * repeatedNumeralCntr;
                        //output
                        displayResult("Result: " + arabicNumeral);
                        return;
                    }
                    prevMagnitude = currMagnitude;
                }
                else {
                    //return error for four of same numeral in a row
                    displayResult("Invalid Input: cannot have four of the same numeral in a row " +
                    "nor two in a row after a subtractive numeral");
                    return;
                }
            }
            
            else if (prevMagnitude > currMagnitude) {
                if (prevMagnitude !== 8) {
                    // if it followed a subtractive pair then arabicNumeral was already
                    // increased and just need to reset the flag
                    if (!followsSubtractivePair) {
                        arabicNumeral += (numValue.get(input[i-1]) * repeatedNumeralCntr);
                        // reset counter to 1 since current numeral hasn't been repeated
                        repeatedNumeralCntr = 1;
                        if (i === input.length - 1) {
                            // then this is the end of the numeral input and is ready
                            // to output
                            arabicNumeral += numValue.get(input[i]);
                            //output
                            displayResult("Result: " + arabicNumeral);
                            return;
                        }
                    }
                    else {
                        followsSubtractivePair = false;
                        if (i === input.length - 1) {
                            // then this is the end of the numeral input and is ready
                            // to output
                            // increase total by current value
                            arabicNumeral += numValue.get(input[i]);
                            //output
                            displayResult("Result: " + arabicNumeral);
                            return;
                        }
                    }
                }
                if (i === input.length - 1) {
                    // then this is the end of the numeral input and is ready
                    // to output
                    // increase total by current value
                    arabicNumeral += numValue.get(input[i]);
                    //output
                    displayResult("Result: " + arabicNumeral);
                    return;
                }
                prevMagnitude = currMagnitude;
            }
            
            else if (prevMagnitude < currMagnitude) {
                // cannot have more than one numeral of lesser magnitude precede
                // one of greater magnitude
                if (repeatedNumeralCntr === 1) {
                    // increase total by current value - previous value
                    arabicNumeral += (numValue.get(input[i]) - numValue.get(input[i-1]))
                    // can't have same magnitude after having a subtractive pair
                    followsSubtractivePair = true;
                    // repeatedNumeralCntr = 3;
                    prevMagnitude = currMagnitude;
                }
                else {
                    //return error more than one subtractive numeral in a row
                    displayResult("Invalid Input: More than one subtractive numeral in a row");
                    return;
                }
            }
        }
        else {
            //return error for invalid character
            displayResult("'" + input[i] + "' is not a Roman Numeral");
            return;
        }
    }
    
    displayResult("Result: " + arabicNumeral);
});
// Issues I noticed while testing I didn't have time to resolve but could do with more time:
// Half steps need more rules: for example, IXV is possible but should not be.
// Also can combine incompatible numerals into subtractive pair like XC
// These give technically correct responses but do not follow standard notation