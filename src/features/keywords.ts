const retext = require("retext");
const pos = require("retext-pos");
const keywords = require("retext-keywords");
const deasync = require("deasync");
let ret: any = null;
const toString=(node:any, separator = ""):string=> {
    let index = -1;
    /** @type {Array.<Node>} */
    let children;
    /** @type {Array.<string>} */
    let values;
    // @ts-ignore Looks like an object.
    if (!node || (!Array.isArray(node) && !node.type)) {
    // throw new Error('Expected node, not `' + node + '`')
        return "";
    }

    // @ts-ignore Looks like a literal.
    if (typeof node.value === "string") return node.value;

    // @ts-ignore Looks like a list of nodes or parent.
    children = ("length" in node ? node : node.children) || [];

    // Shortcut: This is pretty common, and a small performance win.
    if (children.length === 1 && "value" in children[0]) {
    // @ts-ignore Looks like a literal.
        return children[0].value;
    }

    values = [];

    while (++index < children.length) {
        values[index] = toString(children[index], separator);
    }

    return toString(values.join(separator));
};

function done(err: any, file: any) {
    if (err) throw err;
  
    const returnList:Array<string> = [];
    file.data.keywords.forEach(function(keyword: { matches: { node: any }[] }) {
        returnList.push(toString(keyword.matches[0].node));
    });
    
    ret = returnList.filter(Boolean);
    // console.log()
    // console.log('Key-phrases:')
    // file.data.keyphrases.forEach(function(phrase: { matches: { nodes: any[] }[] }) {
    //   console.log(phrase.matches[0].nodes.map(stringify).join(''))
    //   function stringify(value: any) {
    //     return toString(value)
    //   }
    // })
}

export default (input: string) =>
// Like with the text-length feature, this definitely isn't the most
// performant way to do this, but if performance is a concern, NodeJS
// is fundamentally the wrong decision.
{if(input.length > 0){
    retext()
        .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
        .use(keywords)
        .process(input.trim(), done);
  
    while(ret == null)
    {
        deasync.runLoopOnce();
    }
    return (ret || ["error"]);
}
};