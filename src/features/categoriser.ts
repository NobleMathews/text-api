var fs = require( 'fs' ),
    path = require('path'),
	Natural = require( 'natural' ),
	Tokenizer = new Natural.WordTokenizer( {
		pattern: /[^a-zA-Z\u00C0-\u017F]+/
	} );

var classifyText = function ( text: string, classifiers: any, stopwords: Array<String>, epsilon: number ) {
    var tokens = Tokenizer.tokenize( text );


	var tokens_list = tokens.filter( function ( i: String ) {
		return stopwords.indexOf( i ) < 0;
	} );

	tokens = {};

	for ( var _i in tokens_list ) {
		var tkn = tokens_list[ _i ];
		if ( tokens[ tkn ] === undefined ) {
			tokens[ tkn ] = 1;
		} else {
			tokens[ tkn ]++;
		}
	}

	var max = {
		c: undefined,
		s: 1
	};

	var log_epsilon = Math.log( epsilon );

	for ( var _c in classifiers ) {
		var score = classifiers[ _c ].aPriori;
		for ( var _t in tokens ) {
			var ctf = classifiers[ _c ].vector[ _t ];
			ctf = ( ctf === undefined ) ? log_epsilon : ctf;
			score += ctf * tokens[ _t ];
		}
		if ( max.c == undefined || score > max.s ) {

            Object.assign(max, {c: _c,
				s: score})
        }
	}

	return max.c;
};

var classifier_text = function ( text: string ) {
	var category = classifyText(
		text,
		JSON.parse(fs.readFileSync(path.resolve(__dirname, "classifiers.json"))),
		JSON.parse(fs.readFileSync(path.resolve(__dirname, "stopwords.json"))),
		0.00001
	);
	return( "Category for given text is " + category );
};

export default (input: string) =>

    input.length > 0
        ? classifier_text(input.trim())
        : "unknown";