import * as Utils from './Utils.js'
import {PerfCounter} from './PerfCounter.js';
export class IDDFS {
    constructor(graph) {
        this.graph = graph;
        this.perf = new PerfCounter();
    }

	search(depthLimit = 32768) {
		//console.log("graph: ", this.graph);
        this.perf.reset();


        for(let depth=0; depth<depthLimit; depth++) {
		    //console.log("DEPTH: ", depth);
            let visited = this.visited = new Set();
            let stack = this.stack = [this.graph.start]
            let path = this.path = [];
            let graph = this.graph;
            this.perf.processed++;


            while(stack.length > 0) { 
                
                
                
                let currNode = JSON.parse(stack[stack.length - 1]);
                //let currPath = paths[paths.length - 1];
                //console.log("current Node: ",JSON.stringify(currNode) , " path: ", path);

                //performance
				this.perf.processed++;
				if(this.perf.maxDepth < path.length)
					this.perf.maxDepth = path.length;

                visited.add(JSON.stringify(currNode));
                if(JSON.stringify(currNode) == graph.end) {
                    console.log("END ", JSON.stringify(currNode));
                    return this.path;
                } else {
                    if(stack.length <= depth) {
                        let nextChild = this.findNextChild(currNode);
                        //console.log(nextChild ? nextChild : "going back");
                        if(nextChild) {
                            this.stack.push(nextChild.node);
                            this.path.push(nextChild.pathMove);
                        } else {
                            stack.pop();
                            path.pop();
                        }

                    } else {
                        stack.pop();
                        path.pop();
                    }
                 
                }
                
            }
            //console.log("\n");
		}
		return null;

	}


    findNextChild(node) {
        for(let i=0; i<this.graph.columns; i++) {
            if(node[i].length == 0) continue;
        
            for(let j=0; j<this.graph.columns; j++) { 
                if(i == j || node[j] >= this.graph.height || node[i].length == 0) continue;

                
                node[j].unshift(node[i].shift());
                //console.log(i,"=>",j, Utils.nodeToText(node) , JSON.stringify(node), (this.visited.has(JSON.stringify(node)) || this.stack.includes(JSON.stringify(node)) ?" SKIP":""));
                
                if(!this.visited.has(JSON.stringify(node)) && !this.stack.includes(JSON.stringify(node)) ) {
                    let output = {node: JSON.stringify(node), pathMove: [i,j]}
                    node[i].unshift(node[j].shift());
                    return output;
                }

                node[i].unshift(node[j].shift());
                
            }
        }
        return null;
    }
	
}