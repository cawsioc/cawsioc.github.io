// cipher functions ===========================================================

// returns a playfair cipher encryption/decryption
var playfairCipher = function (selector, message, keyword) {
    var pA = ["a","b","c","d","e","f","g","h","i","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

    // clean keyword, swap j for i, remove repeated letters
    var cleanKey = [];
    var char = "";
    for (var i = 0; i < keyword.length; i ++) {
        char = keyword[i].toLowerCase();
        if (char === "j") {
            char = "i";
        }
        if ((char >= "a") && (char <= "z")) {
            if (cleanKey.indexOf(char) === -1) {
                cleanKey.push(char);
            }
        }
    }
    console.log(cleanKey);
    
    // construct ciphertext alphabet
    var cA = [];
    for (var i = 0; i < cleanKey.length; i ++) {
        cA[i] = cleanKey[i].toUpperCase();
    }
    for (var i = 0; i < pA.length; i ++) {
        char = pA[i].toUpperCase();
        if (cA.indexOf(char) === -1) {
            cA.push(char);
        }
    }
    console.log(cA);

    // construct square for display
    //var psq = "";
    //for (var c = 0; c < 5; c ++) {
    //    for (var r = 0; r < 5; r ++) {
    //        psq += cA[(c * 5) + r] + " ";
    //    }
    //    psq += "\n";
    //}
    //console.log("psq\n" + psq);    
    
    var output = "";
    
    if (selector === "encrypt") {
        // clean up message
        var cleanMessage = [];
        var char = "";
        for (var i = 0; i < message.length; i ++) {
            char = message[i].toLowerCase();
            if (char === "j") {
                char = "i";
            }
            if ((char >= "a") && (char <= "z")) {
                cleanMessage.push(char);
            }
        }
        console.log(cleanMessage);
        console.log(cleanMessage.length);
        
        // get ready for digraphs
        var digraphReadyMessage = [];
        for (var p = 0; p < cleanMessage.length; p ++) {
            
            // parse for repeats starting on a multiple of 2
            if (cleanMessage[p] === cleanMessage[p + 1]) {
                
                if (digraphReadyMessage.length % 2 === 0) {
                    digraphReadyMessage.push(cleanMessage[p]);
                    digraphReadyMessage.push("x");
                }
                else {
                    digraphReadyMessage.push(cleanMessage[p]);
                }
            }
            else {
                digraphReadyMessage.push(cleanMessage[p]);
            }
        }
        if (digraphReadyMessage.length % 2 !== 0) {
            digraphReadyMessage.push("x");
        }
        console.log(digraphReadyMessage);
        

        for (var d = 0; d < digraphReadyMessage.length; d += 2) {
            var d1P = cA.indexOf(digraphReadyMessage[d].toUpperCase());
            var d2P = cA.indexOf(digraphReadyMessage[d + 1].toUpperCase());
            //console.log("d1P: " + d1P + " d2P: " + d2P);
            
            var o1P = "";
            var o2P = "";
    
            // establish relationship between letters of digraph        
            if ((d2P % 5) === (d1P % 5)) {
                // same column
                //console.log("same column");
                
                if (d1P < 20) {
                    o1P = cA[d1P + 5];
                }
                else {
                    o1P = cA[d1P - 20];
                }
                
                if (d2P < 20) {
                    o2P = cA[d2P + 5];
                }
                else {
                    o2P = cA[d2P - 20];
                }
                //console.log(o1P + o2P);
                output += o1P;
                output += o2P;
            }
            else if ((Math.floor(d1P / 5)) === (Math.floor(d2P / 5))) {
                // same row
                //console.log("same row");
                
                if ((d1P % 5) < 4) {
                    o1P = cA[d1P + 1];
                }
                else {
                    o1P = cA[d1P - 4];
                }
                
                if ((d2P % 5) < 4) {
                    o2P = cA[d2P + 1];
                }
                else {
                    o2P = cA[d2P - 4];
                }
                //console.log(o1P + o2P);
                output += o1P;
                output += o2P;
            }
            else {
                // neither
                //console.log("neither");
                
                var t1 = d1P % 5;
                var t2 = d2P % 5;
                var gap = t1 - t2;
                o1P = cA[d1P - gap];
                o2P = cA[d2P + gap];
                //console.log(o1P + o2P);
                output += o1P;
                output += o2P;
            }
        }
    }

    if (selector === "decrypt") {

        for (var d = 0; d < message.length; d += 2) {
            var d1P = cA.indexOf(message[d].toUpperCase());
            var d2P = cA.indexOf(message[d + 1].toUpperCase());
            //console.log("d1P: " + d1P + " d2P: " + d2P);
            
            var o1P = "";
            var o2P = "";
    
            // establish relationship between letters of digraph        
            if ((d2P % 5) === (d1P % 5)) {
                // same column
                //console.log("same column");
                
                if (d1P > 4) {
                    o1P = cA[d1P - 5];
                }
                else {
                    o1P = cA[d1P + 20];
                }
                
                if (d2P > 4) {
                    o2P = cA[d2P - 5];
                }
                else {
                    o2P = cA[d2P + 20];
                }
                //console.log(o1P + o2P);
                output += o1P;
                output += o2P;
            }
            else if ((Math.floor(d1P / 5)) === (Math.floor(d2P / 5))) {
                // same row
                //console.log("same row");
                
                if ((d1P % 5) > 0) {
                    o1P = cA[d1P - 1];
                }
                else {
                    o1P = cA[d1P + 4];
                }
                
                if ((d2P % 5) > 0) {
                    o2P = cA[d2P - 1];
                }
                else {
                    o2P = cA[d2P + 4];
                }
                //console.log(o1P + o2P);
                output += o1P;
                output += o2P;
            }
            else {
                // neither
                //console.log("neither");
                
                var t1 = d1P % 5;
                var t2 = d2P % 5;
                var gap = t1 - t2;
                o1P = cA[d1P - gap];
                o2P = cA[d2P + gap];
                //console.log(o1P + o2P);
                output += o1P;
                output += o2P;
            }
        }
        var xoutput = output.toLowerCase();

        // assume a terminal x is padding not real
        if ((xoutput.length % 2) === 0) {
            if (xoutput[xoutput.length - 1] === "x") {
                var xoutput = xoutput.slice(0, xoutput.length - 1);
            }
        }

        // assume an x inbetween 2 identical letters is padding
        output = "";
        for (var o = 0; o < xoutput.length; o ++) {
            if (xoutput[o] === "x") {
                if (xoutput[o - 1] !== xoutput[o + 1]) {
                    output += xoutput[o];
                }
            }
            else {
                output += xoutput[o];
            }
        }
    }

    console.log(output);

    var returns = [];
    returns.push(output);
    returns.push(cA.slice(0,1) + " " + cA.slice(1,2) + " " + cA.slice(2,3) + " " + cA.slice(3,4) + " " + cA.slice(4,5));
    returns.push(cA.slice(5,6) + " " + cA.slice(6,7) + " " + cA.slice(7,8) + " " + cA.slice(8,9) + " " + cA.slice(9,10));
    returns.push(cA.slice(10,11) + " " + cA.slice(11,12) + " " + cA.slice(12,13) + " " + cA.slice(13,14) + " " + cA.slice(14,15));
    returns.push(cA.slice(15,16) + " " + cA.slice(16,17) + " " + cA.slice(17,18) + " " + cA.slice(18,19) + " " + cA.slice(19,20));
    returns.push(cA.slice(20,21) + " " + cA.slice(21,22) + " " + cA.slice(22,23) + " " + cA.slice(23,24) + " " + cA.slice(24,25));

    return returns;
};



// webui functions ============================================================

encrypt = function() {
    var plaintext = document.getElementById("txboxin").value;
    var keyword = document.getElementById("ek").value;
    var returns = playfairCipher("encrypt", plaintext, keyword);
    document.getElementById("epsqr1").innerHTML = returns[1];
    document.getElementById("epsqr2").innerHTML = returns[2];
    document.getElementById("epsqr3").innerHTML = returns[3];
    document.getElementById("epsqr4").innerHTML = returns[4];
    document.getElementById("epsqr5").innerHTML = returns[5];    
    document.getElementById("txboxout").value = returns[0];
};

decrypt = function() {
    var dciphertext = document.getElementById("rxboxin").value;
    var keyword = document.getElementById("dk").value;
    var returns = playfairCipher("decrypt", dciphertext, keyword);
    document.getElementById("dpsqr1").innerHTML = returns[1];
    document.getElementById("dpsqr2").innerHTML = returns[2];
    document.getElementById("dpsqr3").innerHTML = returns[3];
    document.getElementById("dpsqr4").innerHTML = returns[4];
    document.getElementById("dpsqr5").innerHTML = returns[5];
    document.getElementById("rxboxout").value = returns[0];
};
