import {PerfCounter} from './PerfCounter.js';
export class BFS {
	constructor(graph) {
		this.graph = graph;
		this.perf = new PerfCounter();
	}

	search() {
		//console.log("current graph: ",graph);
		this.perf.reset();

		let queue = this.queue = [this.graph.start]
		let visited = this.visited = new Set();
		let paths = this.paths = [[]];
		let graph = this.graph;
		this.perf.processed++;

		while(queue.length > 0) { 
			
			let currNode = JSON.parse(queue.shift());
			let currPath = paths.shift();
			//console.log("current Node: ",JSON.stringify(currNode) , " path: ",paths);
			//if(visited.has(JSON.stringify(currNode)))
			//	continue;

			//performance
				this.perf.processed++;
				if(this.perf.maxDepth < currPath.length)
					this.perf.maxDepth = currPath.length;

			visited.add(JSON.stringify(currNode));
			if(JSON.stringify(currNode) == graph.end) {
				console.log("END ", JSON.stringify(currNode));
				return currPath;
			} else {

				for(let i=0; i<graph.columns; i++) {
					if(currNode[i].length == 0) continue;
				
					for(let j=0; j<graph.columns; j++) { 
						if(i == j || currNode[j] >= graph.height || currNode[i].length == 0) continue
						if(queue.length != paths.length) throw new Error("ERROR:");
						currNode[j].unshift(currNode[i].shift());
						//console.log(i,"=>",j, Utils.nodeToText(currNode) , JSON.stringify(currNode), (visited.has(JSON.stringify(currNode)) || queue.includes(JSON.stringify(currNode)) ?" SKIP":""));
						if(!visited.has(JSON.stringify(currNode)) && !queue.includes(JSON.stringify(currNode)) ) {
							queue.push(JSON.stringify(currNode))
							paths.push(currPath.concat([[i,j]]))
							
						}
						currNode[i].unshift(currNode[j].shift());
						
					}
				}
			}


		}
		return null;
	}
	
}