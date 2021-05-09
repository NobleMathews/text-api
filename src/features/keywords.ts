// const retext = require("retext");
// const pos = require("retext-pos");
// const keywords = require("retext-keywords");
const deasync = require("deasync");
let ret: any = null;
var request = require("request");
const analyze = require('schenkerian')
// const toString=(node:any, separator = ""):string=> {
//     let index = -1;
//     /** @type {Array.<Node>} */
//     let children;
//     /** @type {Array.<string>} */
//     let values;
//     // @ts-ignore Looks like an object.
//     if (!node || (!Array.isArray(node) && !node.type)) {
//     // throw new Error('Expected node, not `' + node + '`')
//         return "";
//     }

//     // @ts-ignore Looks like a literal.
//     if (typeof node.value === "string") return node.value;

//     // @ts-ignore Looks like a list of nodes or parent.
//     children = ("length" in node ? node : node.children) || [];

//     // Shortcut: This is pretty common, and a small performance win.
//     if (children.length === 1 && "value" in children[0]) {
//     // @ts-ignore Looks like a literal.
//         return children[0].value;
//     }

//     values = [];

//     while (++index < children.length) {
//         values[index] = toString(children[index], separator);
//     }

//     return toString(values.join(separator));
// };

// function done(err: any, file: any) {
//     if (err) throw err;
  
//     const returnList:Array<string> = [];
    // file.data.keywords.forEach(function(keyword: { matches: { node: any }[] }) {
    //     returnList.push(toString(keyword.matches[0].node));
    // });
    
//     ret = returnList.filter(Boolean);
// }

function done(file: any) {
    const returnList:Array<string> = [];
    file.relevance?.forEach(function(keyword: any) {
        returnList.push(keyword.term);
    });
    
    ret = returnList.filter(Boolean);
}

export default (input: string) =>

{
    // retext()
    //     .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
    //     .use(keywords)
    //     .process(input.trim(), done);
    ret = null;
    // request({uri:input.trim()}, 
    // function(error:any, response:any, body:any) {
    // if (error) return [];
    analyze({url:"https://www.google.co.in","body":`<html><head></head><body>${input}</body></html>`}).then(function(result: any){done(result);})
    .catch((e:any)=>{ret=[`${e}`];})
    // });
    while(ret == null)
    {
        deasync.runLoopOnce();
    }
    return (ret || []);

};