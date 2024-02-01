
export function nodeToText(node) {
    let string = [];
    for(let row in node) {
        let tmp = ""
        for(let col in node[row]) {
            tmp += node[row][col];
        }
        string.push(tmp);
    }
    return string.join(",");
}

