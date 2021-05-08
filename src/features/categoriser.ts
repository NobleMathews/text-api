const fs = require( "fs" ),
    path = require("path"),
    Natural = require( "natural" ),
    Tokenizer = new Natural.WordTokenizer( {
        pattern: /[^a-zA-Z\u00C0-\u017F]+/
    } );

const classifyText = function ( text: string, classifiers: any, stopwords: Array<string>, epsilon: number ) {
    let tokens = Tokenizer.tokenize( text );


    const tokens_list = tokens.filter( function ( i: string ) {
        return stopwords.indexOf( i ) < 0;
    } );

    tokens = {};

    for ( const _i in tokens_list ) {
        const tkn = tokens_list[ _i ];
        if ( tokens[ tkn ] === undefined ) {
            tokens[ tkn ] = 1;
        } else {
            tokens[ tkn ]++;
        }
    }

    const max = {
        c: undefined,
        s: 1
    };

    const log_epsilon = Math.log( epsilon );

    for ( const _c in classifiers ) {
        let score = classifiers[ _c ].aPriori;
        for ( const _t in tokens ) {
            let ctf = classifiers[ _c ].vector[ _t ];
            ctf = ( ctf === undefined ) ? log_epsilon : ctf;
            score += ctf * tokens[ _t ];
        }
        if ( max.c == undefined || score > max.s ) {

            Object.assign(max, {c: _c,
                s: score});
        }
    }

    return max.c;
};

const classifier_text = function ( text: string ) {
    const category = classifyText(
        text,
        JSON.parse(fs.readFileSync(path.resolve(__dirname, "classifiers.json"))),
        JSON.parse(fs.readFileSync(path.resolve(__dirname, "stopwords.json"))),
        0.00001
    );
    return( category );
};

export default (input: string) =>

    input.length > 0
        ? classifier_text(input.trim())
        : "unknown";