// Simplified Enigma Simulator


// remove non-alphabetic characters from input
var cleanInput = function (input) {
    var cleanStr = "";
    var aChar = "";
    for (var i = 0; i < input.length; i ++) {
        aChar = input[i].toUpperCase();
        if ((aChar >= "A") && (aChar <= "Z")) {
            cleanStr += aChar;
        }
    }
    return cleanStr;
};


// move cleaned up input into the machine's input queue
commit = function() {
    document.getElementById("txInputQueue").value = cleanInput(document.getElementById("txboxin").value);
};


// run the machine
execute = function(wheelSet, r1, r2, r3, speed) {
    var inputQ = document.getElementById("txInputQueue").value;
    var outputQ = "";
    var step = 0;
    var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var wheels = ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "BDFHJLCPRTXVZNYEIWGAKMUSQO", "ESOVPZJAYQUIRHXLNFTGKDCMWB", "VZBRGITYUPSDNHLXAWMJQOFECK"];
    var ref = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
    var w1 = wheels[wheelSet[0] - 1];
    var w2 = wheels[wheelSet[1] - 1];
    var w3 = wheels[wheelSet[2] - 1];

    // set display update speed
    if (speed == "slow") {
        var interval = 250;
    }
    else if (speed == "fast") {
        var interval = 25;
    }

    // display fixed fields
    document.getElementById("reflector").value = ref;
    document.getElementById("w3").innerHTML = "Wheel " + wheelSet[2];
    document.getElementById("w2").innerHTML = "Wheel " + wheelSet[1];
    document.getElementById("w1").innerHTML = "Wheel " + wheelSet[0];

    // get wheels and their associated rotating alphabets in position
    var leftWheelStartPos = w1.slice(r1,26) + w1.slice(0,r1);
    var leftAlphaStartPos = alpha.slice(r1,26) + alpha.slice(0,r1);
    var middleWheelStartPos = w2.slice(r2,26) + w2.slice(0,r2);
    var middleAlphaStartPos = alpha.slice(r2,26) + alpha.slice(0,r2);
    var rightWheelStartPos = w3.slice(r3,26) + w3.slice(0,r3);
    var rightAlphaStartPos = alpha.slice(r3,26) + alpha.slice(0,r3);

    // display initial wheel state
    document.getElementById("txWheel1").value = leftWheelStartPos;
    document.getElementById("txWheel2").value = middleWheelStartPos;
    document.getElementById("txWheel3").value = rightWheelStartPos;

    // machine operation embedded inside display update function to give visual feedback
    function displayUpdate()
    {
        t = setTimeout(
            function() {
                var currentChar = inputQ[step];

                // display input to be processed
                document.getElementById("txInputQueue").value = inputQ;

                // wheel rotation stage - occurs before encrypt/decrypt for each step
                var rWheelIndex = (step + 1) % 26;
                var mWheelIndex = Math.floor((step + 1) / 26);
                var lWheelIndex = Math.floor((step + 1) / (26 * 26));

                console.log("Rotating wheels on step " + step + " -rightmost wheel = " + rWheelIndex + " -middle wheel = " + mWheelIndex + " -leftmost wheel = " + lWheelIndex);

                // always rotate rightmost wheel one step
                var rightWheelAfterRot = rightWheelStartPos.slice(rWheelIndex,26) + rightWheelStartPos.slice(0,rWheelIndex);
                var rightAlphaAfterRot = rightAlphaStartPos.slice(rWheelIndex,26) + rightAlphaStartPos.slice(0,rWheelIndex);
                console.log("Right wheel rotated");

                // check if rightmost wheel is back to starting position
                if (rightWheelAfterRot[0] == w3[0]) {
                    // yes it is, so rotate middle
                    var middleWheelAfterRot = middleWheelStartPos.slice(mWheelIndex,26) + middleWheelStartPos.slice(0,mWheelIndex);
                    var middleAlphaAfterRot = middleAlphaStartPos.slice(mWheelIndex,26) + middleAlphaStartPos.slice(0,mWheelIndex);
                    console.log("middle wheel stepped forward");

                    // middle wheel turned so check if it's back in starting position
                    if (middleWheelAfterRot[0] == w2[0]) {
                        // yes it is, so rotate left
                        var leftWheelAfterRot = leftWheelStartPos.slice(lWheelIndex,26) + leftWheelStartPos.slice(0,lWheelIndex);
                        var leftAlphaAfterRot = leftAlphaStartPos.slice(lWheelIndex,26) + leftAlphaStartPos.slice(0,lWheelIndex);
                        console.log("left wheel stepped forward");
                    }
                    else {
                        // middle wheel not back at start, so left wheel is static
                        var leftWheelAfterRot = leftWheelStartPos;
                        var leftAlphaAfterRot = leftAlphaStartPos;
                    }
                }
                else {
                    // right wheel not back at start, so middle and left are static
                    var middleWheelAfterRot = middleWheelStartPos.slice(mWheelIndex,26) + middleWheelStartPos.slice(0,mWheelIndex);
                    var middleAlphaAfterRot = middleAlphaStartPos.slice(mWheelIndex,26) + middleAlphaStartPos.slice(0,mWheelIndex);
                    var leftWheelAfterRot = leftWheelStartPos.slice(lWheelIndex,26) + leftWheelStartPos.slice(0,lWheelIndex);
                    var leftAlphaAfterRot = leftAlphaStartPos.slice(lWheelIndex,26) + leftAlphaStartPos.slice(0,lWheelIndex);
                }
                var rightAlphaAfterRot = rightAlphaStartPos.slice(rWheelIndex,26) + rightAlphaStartPos.slice(0,rWheelIndex);

                // display post rotation wheel state
                document.getElementById("txWheel1").value = leftWheelAfterRot;
                document.getElementById("txWheel2").value = middleWheelAfterRot;
                document.getElementById("txWheel3").value = rightWheelAfterRot;

                // encryption/decryption stage

                // consume an input q character
                var ch = inputQ[0];
                inputQ = inputQ.slice(1,inputQ.length);

                // run it through the machine
                var ici = alpha.indexOf(ch);
                console.log("Input character's index = " + ici + " (" + ch +")");

                var w3BottomChar = rightWheelAfterRot[ici];
                var w3TopIndex = rightAlphaAfterRot.indexOf(w3BottomChar);
                console.log("Rightmost wheel's bottom character = " + w3BottomChar + " whose top index = " + w3TopIndex);

                var w2BottomChar = middleWheelAfterRot[w3TopIndex];
                var w2TopIndex = middleAlphaAfterRot.indexOf(w2BottomChar);
                console.log("Middle wheel's bottom character = " + w2BottomChar + " whose top index = " + w2TopIndex);

                var w1BottomChar = leftWheelAfterRot[w2TopIndex];
                var w1TopIndex = leftAlphaAfterRot.indexOf(w1BottomChar);
                console.log("Leftmost wheel's bottom character = " + w1BottomChar + " whose top index = " + w1TopIndex);

                var refBottomChar = ref[w1TopIndex];
                var refTopIndex = alpha.indexOf(refBottomChar);
                console.log("Reflector's bottom character = " + refBottomChar + " whose top index = " + refTopIndex);

                var w1TopCharOut = leftAlphaAfterRot[refTopIndex];
                var w1BottomIndex = leftWheelAfterRot.indexOf(w1TopCharOut);
                console.log("Leftmost wheel's top character = " + w1TopCharOut + " whose bottom index = " + w1BottomIndex);

                var w2TopCharOut = middleAlphaAfterRot[w1BottomIndex];
                var w2BottomIndex = middleWheelAfterRot.indexOf(w2TopCharOut);
                console.log("Middle wheel's top character = " + w2TopCharOut + " whose bottom index = " + w2BottomIndex);

                var w3TopCharOut = rightAlphaAfterRot[w2BottomIndex];
                var w3BottomIndex = rightWheelAfterRot.indexOf(w3TopCharOut);
                console.log("Middle wheel's top character = " + w3TopCharOut + " whose bottom index = " + w3BottomIndex);

                var outChar = alpha[w3BottomIndex];
                console.log("Ouput character's index = " + w3BottomIndex + " (" + outChar +")");

                // add output to output stream and display
                outputQ += outChar;
                document.getElementById("txOutputQueue").value = outputQ;

                // set machine up for next cycle
                step ++;
                 
                // condition to continue processing data
                if (inputQ.length > 0)
                {
                    displayUpdate();
                }
                else
                {
                    document.getElementById("txInputQueue").value = "";
                }
            }, interval);
    };
    displayUpdate();
};


// run the machine with the inputs provided - note encryption and decryption are the same process
encryptdecrypt = function() {
    var wheelSet = document.getElementById("txWheelSet").value;
    var r1 = document.getElementById("r1").value;
    var r2 = document.getElementById("r2").value;
    var r3 = document.getElementById("r3").value;
    var speed = document.getElementById("speed").value;
    execute(wheelSet, r1, r2, r3, speed);
};
