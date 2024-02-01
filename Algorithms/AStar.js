import * as Utils from './Utils.js'
import {PerfCounter} from './PerfCounter.js';

export class AStar {
	constructor(graph) {
		this.graph = graph;
		this.perf = new PerfCounter();
	}

	search() {
		this.perf.reset();
		let graph = this.graph;
		let closed = new Set();
		let open = new Set()
		open.add({
			value: this.graph.start, 
			fScore: this.heuristic(this.graph.start, true),
			gScore: 0,
			path: []
		});
		this.perf.processed++;
		
		//fScore = heurisika + gScore ... samo za računanje najmanjše poti
		//gScore = cena poti do te točke ... uporabna za pošiljanje na naslednje gočke



		while(open.size > 0) {
			//find best next node in open[]
			let currNode = this.findBestNextNode(open);
			let childValue = JSON.parse(currNode.value);

			//performance
			this.perf.processed++;
			if(this.perf.maxDepth < currNode.path.length)
				this.perf.maxDepth = currNode.path.length;
			
			//console.log("Available nodes ",open)
			//console.log("Current node: ", currNode);
			closed.add(currNode);
			open.delete(currNode);


			if(currNode.value == graph.end) {
				console.log("END ", JSON.stringify(currNode.value));
				return currNode.path;
			} else {
				
				for(let i=0; i<graph.columns; i++) {
					if(childValue[i].length == 0) continue;
				
					for(let j=0; j<graph.columns; j++) { 
						if(i == j || childValue[j].length >= graph.height || childValue[i].length == 0) continue;
						
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
							open.add({
								value: JSON.stringify(childValue), 
								fScore: childFScore, //heuristic
								gScore: currNode.gScore + Math.abs(i-j), //cost
								path: currNode.path.concat([[i,j]])
							})
						}

						
						//console.log(i,"=>",j, Utils.nodeToText(childValue) , JSON.stringify(childValue), (visited.has(JSON.stringify(childValue)) || queue.includes(JSON.stringify(childValue)) ?" SKIP":""));
						childValue[i].unshift(childValue[j].shift());
						
					}
				}

				
			}

			
			//return;
		}
		console.log("---------------------------");
		return null;
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