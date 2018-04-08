// cipher functions ===========================================================

// returns a type7 encode
// seed can be randomly generated 0-52, but is a user supplied integer here
var type7enc = function (input, seed) {
	var fiftythree = "dsfd;kfoA,.iyewrkldJKDHSUBsgvca69834ncxv9873254k;fg87";

	var initial_i = seed % 53;
	var seedstr = "";
	if (initial_i < 10) {
	    seedstr = "0" + initial_i;
	}
	else {
	    seedstr = initial_i;
	}

	var output = "" + seedstr;

	for (var i = 0; i < input.length; i ++) {
	    var x = input.charCodeAt(i);
	    //console.log("input: " + x + " " + i);
	    var a = fiftythree.charCodeAt(initial_i + i);
	    //console.log("52str: " + a + " " + i);
	    var tmpout = (a ^ x).toString(16);
	    
	    var out = "";
	    if (tmpout.length == 1) {
	        out = "0" + tmpout.toUpperCase();
	    }
	    else {
	        out = tmpout.toUpperCase();
	    }
	    output += out;
	}
	return output;
};

// returns a type7 decode
var type7dec = function (input) {
	var fiftythree = "dsfd;kfoA,.iyewrkldJKDHSUBsgvca69834ncxv9873254k;fg87";

	var seed = input[0] + input[1];
	var seedint = parseInt(seed, 10);
	
	var output = "";

	var index = 0;
	for (var i = 2; i < input.length; i+= 2) {
	    index ++;
	    var hexpair_raw = input[i] + input[i + 1];
	    var hexpair_num = parseInt(hexpair_raw, 16);
	    var a = fiftythree.charCodeAt(seedint + index - 1);
	    output += String.fromCharCode(hexpair_num ^ a);
	}
	return output;
};



// webui functions ============================================================

encode = function() {
    var input = document.getElementById("txboxin").value;
    var seed = document.getElementById("ek1").value;
    document.getElementById("txboxout").value = type7enc(input, seed);
};

decode = function() {
    var input = document.getElementById("rxboxin").value;
    document.getElementById("rxboxout").value = type7dec(input);
};
