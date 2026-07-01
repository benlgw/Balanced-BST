// ts-worksheet-with-variables
import Node from "./Node.js";

export default class Tree {
	constructor(array) {
		this.root = this.buildTree([...new Set(array)]);
	}

	visualize(node = this.root, prefix = "", isLeft = true) {
		if (node === null || node === undefined) {
			return;
		}
		this.visualize(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
		console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
		this.visualize(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
	}

	height(value, node = this.root) {
		if (node === null) return undefined;

		if (node.value === value) {
			return this.heightHelper(node);
		}

		if (value < node.value) {
			return this.height(value, node.left);
		} else {
			return this.height(value, node.right);
		}
	}

	heightHelper(node) {
		if (node === null) return -1;
		const left = this.heightHelper(node.left);
		const right = this.heightHelper(node.right);
		return 1 + Math.max(left, right);
	}

	depth(value, node = this.root, depth = 0) {
		if (node === null) return undefined;
		if (node.value === value) return depth;

		const left = this.depth(value, node.left, depth + 1);
		if (left !== undefined) return left;

		const right = this.depth(value, node.right, depth + 1);
		if (right !== undefined) return right;

		return undefined;
	}

	isBalanced(node = this.root) {
		return this.isBalancedHelper() !== -1;
	}

	isBalancedHelper(node = this.root) {
		if (node === null) return 0;

		const left = this.isBalancedHelper(node.left);
		if (left === -1) return -1;

		const right = this.isBalancedHelper(node.right);
		if (right === -1) return -1;

		if (Math.abs(left - right) > 1) return -1;
		return 1 + Math.max(left, right);
	}

	buildTree(array) {
		if (!array.length) return null;

		const middleIndex = Math.floor((array.length - 1) / 2);
		const middleElement = array[middleIndex];
		const rootNode = new Node(middleElement);

		const leftArray = array.slice(0, middleIndex);
		const rightArray = array.slice(middleIndex + 1, array.length);

		rootNode.left = this.buildTree(leftArray);
		rootNode.right = this.buildTree(rightArray);

		return rootNode;
	}

	rebalance() {
		const newTree = [];
		this.inOrderForEach((value) => {
			newTree.push(value);
		});
		this.root = this.buildTree(newTree);
	}

	insert(value, node = this.root) {
		if (node === null) return;
		if (value === node.value) return;

		if (value < node.value) {
			this.insert(value, node.left);
			if (!node.left) node.left = new Node(value);
		} else {
			this.insert(value, node.right);
			if (!node.right) node.right = new Node(value);
		}

		if (!this.isBalanced()) this.rebalance();
	}

	delete(value, node = this.root) {
		if (node === null) return;

		if (value < node.value) {
			node.left = this.delete(value, node.left);
		} else if (value > node.value) {
			node.right = this.delete(value, node.right);
		} else {
			if (node.left === null) return node.right;
			if (node.right === null) return node.left;

			const temp = this.deleteHelper(node);
			node.value = temp.value;
			node.right = this.delete(temp.value, node.right);
		}
		return node;
	}

	deleteHelper(node) {
		node = node.right;
		while (node !== null && node.left !== null) {
			node = node.left;
		}
		return node;
	}

	includes(value, node = this.root, includes = false) {
		if (node === null) return false;
		if (node.value === value) return true;

		includes = this.includes(value, node.left, includes);
		if (includes === true) return true;

		includes = this.includes(value, node.right, includes);
		return includes;
	}

	levelOrderForEach(callback) {
		if (typeof callback === "undefined") throw Error("Callback expected");
		const queue = [];
		queue.push(this.root);

		while (queue.length) {
			let curr = queue.shift();
			callback(curr.value);

			if (curr.left) {
				queue.push(curr.left);
			}

			if (curr.right) {
				queue.push(curr.right);
			}
		}
	}

	preOrderForEach(callback, node = this.root) {
		if (typeof callback === "undefined") throw Error("Callback expected");
		if (node === null) return;

		callback(node.value);
		this.preOrderForEach(callback, node.left);
		this.preOrderForEach(callback, node.right);
	}

	inOrderForEach(callback, node = this.root) {
		if (typeof callback === "undefined") throw Error("Callback expected");
		if (node === null) return;

		this.inOrderForEach(callback, node.left);
		callback(node.value);
		this.inOrderForEach(callback, node.right);
	}

	postOrderForEach(callback, node = this.root) {
		if (typeof callback === "undefined") throw Error("Callback expected");
		if (node === null) return;

		this.postOrderForEach(callback, node.left);
		this.postOrderForEach(callback, node.right);
		callback(node.value);
	}
}
