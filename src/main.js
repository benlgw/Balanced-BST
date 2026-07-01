//ts-worksheet-with-variables
import Tree from "./modules/Tree.js";

const randomArray = [];
for (let i = 1; i <= 100; i++) {
	randomArray.push(Math.floor(Math.random() * 100));
}

const tree = new Tree(randomArray);

tree.visualize();
