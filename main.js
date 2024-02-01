import * as Utils from './Algorithms/Utils.js'
import { BFS } from "./Algorithms/BFS.js";
import { DFS } from "./Algorithms/DFS.js";
import { IDDFS } from "./Algorithms/IDDFS.js";
import { AStar } from './Algorithms/AStar.js';
import { IDAStar } from './Algorithms/IDAStar.js';

let canvas = document.getElementById("canvas");
let canvasStart = document.getElementById("canvasStart");
let canvasEnd = document.getElementById("canvasEnd");
let ctx = canvas.getContext("2d");
let ctxS =  canvasStart.getContext("2d");
let ctxE =  canvasEnd.getContext("2d");
let currGraph = {
	start : [],
	end : [],
	columns : 0,
	height : 0
};
let BLOCK_WIDTH = 50, BLOCK_HEIGHT = 50;
let previousTimeStamp = 0;
let display = {doDraw : false, path : [], scene : "", delay : 1000}
/*let HTMLElements = {
	time: document.querySelector("#time .length").innerText,
	count: document.querySelector("#count .length").innerText,
	depth: document.querySelector("#depth .length").innerText,
	length: document.querySelector("#length .length").innerText,
	price: document.querySelector("#price .length").innerText,
	pathArea: document.getElementById("pathArea").va,
}*/


function loadExample(file) {
	
	var rawFile = new XMLHttpRequest();
	var rawText = "";
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status == 0) {
				rawText = rawFile.responseText;
			} else {
				alert(`Error: Couldn't load example`)
				throw new Error("Couldn't load example")
			}
		}
	}


	//začetna pozicija
	rawFile.open("GET", `./Examples/${file}_zacetna.txt`, false);
	rawFile.send();
	currGraph.start = textToArray(rawText);


	//končna pozicija
	rawFile.open("GET", `./Examples/${file}_koncna.txt`, false);
	rawFile.send();
	currGraph.end = textToArray(rawText);
	console.log(currGraph)
}

function textToArray(rawText) {
	let arr = [];
	let colHeight = 0;
	for(let row of rawText.trim().split("\n")) {
		colHeight++;
		row = row.trim().replaceAll("\'","").split(",");
		for(let col in row) {
			if(arr[col] === undefined)
				arr[col] = []

			if(row[col] == " ")
				continue;
			else
				arr[col].push(row[col])
		}
	}
	currGraph.height = colHeight;
	currGraph.columns = arr.length;
	return JSON.stringify(arr);
}

function render(timestamp) {
	if (display.doDraw && timestamp - previousTimeStamp > display.delay /*/ (currGraph.start.length / 2)*/) { 
		previousTimeStamp = timestamp;

		//transpose
		let nextMove = display.path.shift();
		if(nextMove != undefined) {
			let arr = display.scene;
			arr[nextMove[1]].unshift(arr[nextMove[0]].shift());

			let val = Number(document.querySelector("#length .value").innerText);
			document.querySelector("#length .value").innerText = val+1;

			val = Number(document.querySelector("#price .value").innerText);
			document.querySelector("#price .value").innerText = val + Math.abs(nextMove[0] - nextMove[1]);


		} else {
			display.doDraw = false;
			document.getElementById("displayBtn").style.boxShadow = '';
		}
		//draw
		drawScene(display.scene)
	}
	
	window.requestAnimationFrame(render);
}

function drawScene(scene) {
	if(!Array.isArray(scene))
		scene = JSON.parse(scene)

	let leftXoffset = (canvas.width - BLOCK_WIDTH*currGraph.columns)/2;
	let leftYoffset = canvas.height-150;

	

	//draw background
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.textAlign = "center";
	ctx.font = "20px consolas";

	ctx.beginPath();
	ctx.fillStyle = "gray";
	ctx.rect(0, canvas.height-150, canvas.width, 50);
	ctx.fill();

	//column numbers
	ctx.fillStyle = "white";
	for(let i in scene) {
		ctx.fillText(i, leftXoffset + i*BLOCK_WIDTH + BLOCK_WIDTH/2, canvas.height - 150 + BLOCK_WIDTH*.6);
	}

	ctx.fillStyle = "gray";
	ctx.font = "40px consolas";
	for(let i in scene) {
		for(let j in scene[i]) {
			ctx.beginPath();
			ctx.rect(leftXoffset + i*BLOCK_WIDTH, leftYoffset - (scene[i].length - j)*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			ctx.stroke();
			ctx.fillText(scene[i][j], leftXoffset + i*BLOCK_WIDTH + BLOCK_WIDTH/2, leftYoffset - (scene[i].length - j)*BLOCK_HEIGHT + BLOCK_WIDTH*.78);
		}
	}
}

function drawSceneCtx(inCtx ,scene, canvs, nameCanvas) {
	if(!Array.isArray(scene))
		scene = JSON.parse(scene)
	
	let block_width = BLOCK_WIDTH / 1.4;
	let block_height = BLOCK_HEIGHT / 1.4;

	let leftXoffset = (canvs.width - block_width*currGraph.columns)/2;
	let leftYoffset = canvs.height-75;

	//draw background
	inCtx.clearRect(0, 0, canvs.width, canvas.height);
	inCtx.textAlign = "center";
	inCtx.font = "15px consolas";

	inCtx.beginPath();
	inCtx.fillStyle = "gray";
	inCtx.rect(0, canvs.height-75, canvs.width, 25);
	inCtx.fill();

	//column numbers
	inCtx.fillStyle = "white";
	for(let i in scene) {
		inCtx.fillText(i, leftXoffset + i*block_width + block_width/2, canvs.height - 75 + block_width*.6);
	}

	//draw text
	inCtx.font = "20px consolas";
	inCtx.fillText(nameCanvas, 80, 20);

	inCtx.fillStyle = "gray";
	inCtx.font = "30px consolas";
	for(let i in scene) {
		for(let j in scene[i]) {
			inCtx.beginPath();
			inCtx.rect(leftXoffset + i*block_width, leftYoffset - (scene[i].length - j)*block_height, block_width, block_height);
			inCtx.stroke();
			inCtx.fillText(scene[i][j], leftXoffset + i*block_width + block_width/2, leftYoffset - (scene[i].length - j)*block_height + block_width*.78);
		}
	}
}


function testAlgo(start, end, path) {
	if(path == null) {
		console.warn("%cNO PATH FOUND",'background: #222; color: #c92626');
		return;
	}
    start = JSON.parse(start);
    end = JSON.parse(end);
    for(let el of path) {
        start[el[1]].unshift(start[el[0]].shift());
    }

	if(JSON.stringify(start) == JSON.stringify(end)) {
		console.log('%cOK', 'background: #222; color: #3fc926');
		document.getElementById("searchBtn").style.boxShadow = '0 0 0 2px #368f26';
	} else {
		console.log("%cFAIL:",'background: #222; color: #c92626',start, end);
		document.getElementById("searchBtn").style.boxShadow = '0 0 0 2px #8f2626';
	}

	setTimeout(function() {document.getElementById("searchBtn").style.boxShadow = '';}, 2000);
}
//testAlgo('[["B","A"],["D","C"],["F","E"],[],[]]', '[["A","B"],["C","D"],["E","F"],[],[]]', [[0,2],[1,4],[0,1],[2,0],[2,1],[3,1],[4,1],[4,0]])


function findPath() {
	let example = document.getElementById("example").value;
	let algorithm = document.getElementById("algorithm").value;
	let algo;
	loadExample(example)

	switch(algorithm) {
		case "BFS": algo = new BFS(currGraph); break;
		case "DFS": algo = new DFS(currGraph); break;
		case "IDDFS": algo = new IDDFS(currGraph); break;
		case "A*": algo = new AStar(currGraph); break;
		case "IDA*": algo = new IDAStar(currGraph); break;
	}

	let beginTime = Date.now();
	let res = algo.search();
	let performance = algo.perf.getResult();

	document.querySelector("#time .value").innerText = (Date.now()-beginTime) / 1000 + "s";
	document.querySelector("#pathArea").value = JSON.stringify(res);
	document.querySelector("#pathLen").innerText = res.length;
	document.querySelector("#count .value").innerText = performance.processed;
	document.querySelector("#depth .value").innerText = performance.maxDepth;


	console.log(res,performance);
	testAlgo(currGraph.start, currGraph.end, res)
}

function pathClean(path) {
	for(let i=path.length-1; i>=0; i--) {
		if(path[i][0] == path[i][1])
			path.splice(i, 1);

		else if(i > 0 && path[i][0] == path[i-1][1]) {
			path[i-1][1] = path[i][1];
			path.splice(i, 1);
		}
	}

	document.getElementById("cleanPathBtn").style.boxShadow = '0 0 0 1px #808080';
	setTimeout(function() {document.getElementById("cleanPathBtn").style.boxShadow = '';}, 2000);
	return path;
}

window.onload = function() {
	loadExample("primer0")
	drawScene(currGraph.start)
	drawSceneCtx(ctxS, currGraph.start, canvasStart, "Start Postion");
	drawSceneCtx(ctxE, currGraph.end, canvasEnd, "End Position");
	findPath();
	window.requestAnimationFrame(render);
	display.delay = document.getElementById("animSpeed").value * 1000;
}

document.getElementById("searchBtn").onclick = function() {
	findPath()
	drawScene(currGraph.start)
}


document.getElementById("displayBtn").onclick = function() {
	drawScene(currGraph.start);

	document.getElementById("displayBtn").style.boxShadow = (display.doDraw ? '0 0 0 2px #268f8a' : '');
	document.querySelector("#length .value").innerText = 0;
	document.querySelector("#price .value").innerText = 0;

	display.doDraw = !display.doDraw;
	display.path = JSON.parse(document.querySelector("#pathArea").value);
	display.scene = JSON.parse(currGraph.start);
	console.log(display);
}

document.getElementById("cleanPathBtn").onclick = function() {
	let path = JSON.parse(document.getElementById("pathArea").value);
	let len = path.length
	if(path.length > 0) {
		path = pathClean(path);
		document.getElementById("pathArea").value = JSON.stringify(path);
		document.querySelector("#pathLen").innerText = path.length;
	}
}

document.getElementById("animSpeed").onchange = function() {
	display.delay = this.value * 1000;
}

document.getElementById("example").onchange = function(evt) {
	loadExample(evt.target.value);
	drawScene(currGraph.start)
	drawSceneCtx(ctxS, currGraph.start, canvasStart, "Start Postion");
	drawSceneCtx(ctxE, currGraph.end, canvasEnd, "End Postion");
	window.requestAnimationFrame(render);
}