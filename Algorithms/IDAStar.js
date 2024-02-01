import * as Utils from './Utils.js'
import {PerfCounter} from './PerfCounter.js';
export class IDAStar {
	constructor(graph) {
		this.graph = graph;
		this.perf = new PerfCounter();
	}

	search() {
		this.perf.reset();
		let graph = this.graph;
		let threshold = this.threshold = this.heuristic(graph.start,true)

		while(true) {
			//console.log("threshold: " + threshold);
			let result = this.find(threshold)

			if(Array.isArray(result)) {
				return result;
			} else if(result == Infinity) {
				return null;
			} 

			threshold = result
			//console.log(threshold);
			
		}
		return null;
	}

	find(threshold) {
		let open = [];
		let closed = new Set();
		let graph = this.graph;
		open.push({
			value: this.graph.start, 
            fScore: this.heuristic(this.graph.start, true),
            gScore: 0,
			path: []
        });
		this.perf.processed++;
		let minOverThreshold = Infinity;
		
		while(open.length > 0) {

			let currNode = open.shift();
			let childValue = JSON.parse(currNode.value);
			//console.log("current Node: ", JSON.parse(currNode.value), " path: ", currNode.path);

			//performance
			this.perf.processed++;
			if(this.perf.maxDepth < currNode.path.length)
				this.perf.maxDepth = currNode.path.length;

			if(currNode.fScore > threshold) {
				if(currNode.fScore < minOverThreshold)
					minOverThreshold = currNode.fScore;
				//console.log("SKIPPING: over threshold");
				continue;
			}

			closed.add(currNode)
			
			if(currNode.value == this.graph.end) {
				console.log("END ", JSON.stringify(currNode.value));
				return currNode.path;
				
			} else {

				for(let i=0; i<graph.columns; i++) {
					if(childValue[i].length == 0) continue;
				
					for(let j=0; j<graph.columns; j++) { 
						if(i == j || childValue[j].length >= graph.height || childValue[i].length == 0) continue;
						
						//SHIFT to new position
						childValue[j].unshift(childValue[i].shift());
						//console.log(i,"=>",j, Utils.nodeToText(childValue) , JSON.stringify(childValue), (this.containsNode(closed, JSON.stringify(childValue)) ?" SKIP":""));
						if(this.containsNode(closed, JSON.stringify(childValue))) {childValue[i].unshift(childValue[j].shift());continue;}	

						let childFScore = this.heuristic(JSON.stringify(childValue), true) + currNode.gScore + Math.abs(i-j);

						
						let isOpened = this.containsNode(open, JSON.stringify(childValue));
						if(isOpened) {
							if(childFScore < isOpened.fScore) {
								//update node
								isOpened.fScore = childFScore;
								isOpened.gScore = currNode.gScore + Math.abs(i-j);
								isOpened.path = currNode.path.concat([[i,j]])
							}
						} else {
							open.push({
								value: JSON.stringify(childValue), 
								fScore: childFScore, //heuristic
								gScore: currNode.gScore + Math.abs(i-j), //cost
								path: currNode.path.concat([[i,j]])
							})
						}


						//UNSHIFT to old position
						childValue[i].unshift(childValue[j].shift());
	
					}
				}

			}


			

			
		}
		return minOverThreshold;
	}

	heuristic(node, penalty = true) {
		//štejejo premiki po x osi + le element ostane v istem stolpcu se mu prišteje delta y iz spodaj navzgor. ==> (indexe v Y začnemo štet spodi)

		node = JSON.parse(node);
		let end = JSON.parse(this.graph.end);

		let heuristic = 0;
		let startPos = new Map();
		for(let i in node) {
			for(let j in node[i]) {
				startPos[node[i][j]] = [Number(i), node[i].length - 1 - Number(j)];
			}
		}
		for(let i in end) {
			for(let j in end[i]) {
				heuristic +=  Math.abs(Number(i) - startPos[end[i][j]][0]);
				if(penalty && i == startPos[end[i][j]][0]) {
					heuristic +=  2*Math.abs(end[i].length - 1 - Number(j) - startPos[end[i][j]][1]);
				}
			}
		}
		return heuristic;
	}
	

	findBestNextNode(openNodes) {
		let [bestScore] = openNodes;
		openNodes.forEach(element => {
			if(element.fScore < bestScore.fScore) 
				bestScore = element;
		});
		return bestScore;
	}

	containsNode(set, node) {
		let con = false;
		set.forEach(element => {
			if(element.value == node)
			con = element;
		});
		return con;
	}
}