class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    async insert(value) {
        const newNode = new TreeNode(value);
        if (!this.root) {
            this.root = newNode;
            renderTree();
            await highlightNode(this.root, canvas.width / 2, 50, 0, value, "green");
            return;
        }
        let current = this.root;
        while (true) {
            await highlightNode(current, canvas.width / 2, 50, 0, current.value, "yellow");
            if (value === current.value) {
                alert(`Value ${value} already exists in the tree!`);
                return;
            }
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    break;
                }
                current = current.left;
            } 
            else {
                if (!current.right) {
                    current.right = newNode;
                    break;
                }
                current = current.right;
            }
        }
        renderTree();
        await highlightNode(current, canvas.width / 2, 50, 0, value, "green");
    }

    async delete(value) {
        this.root = await this._deleteRecursively(this.root, value);
        renderTree();
    }

    async _deleteRecursively(node, value) {
        if (!node) return null;
        await highlightNode(node, canvas.width / 2, 50, 0, node.value, "yellow");
        if (value < node.value) {
            node.left = await this._deleteRecursively(node.left, value);
        }
        else if (value > node.value) {
            node.right = await this._deleteRecursively(node.right, value);
        }
        else {
            await highlightNode(node, canvas.width / 2, 50, 0, node.value, "red");
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            const minValue = this._findMin(node.right);
            node.value = minValue;
            node.right = await this._deleteRecursively(node.right, minValue);
        }
        return node;
    }

    _findMin(node) {
        while (node.left) node = node.left;
        return node.value;
    }

    inorder(node, result = []) {
        if (node) {
            this.inorder(node.left, result);
            result.push(node.value);
            this.inorder(node.right, result);
        }
        return result;
    }

    preorder(node, result = []) {
        if (node) {
            result.push(node.value);
            this.preorder(node.left, result);
            this.preorder(node.right, result);
        }
        return result;
    }

    postorder(node, result = []) {
        if (node) {
            this.postorder(node.left, result);
            this.postorder(node.right, result);
            result.push(node.value);
        }
        return result;
    }

    levelorder() {
        if (!this.root) return [];
        const result = [];
        const queue = [this.root];
        while (queue.length) {
            let current = queue.shift();
            result.push(current.value);
            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
        }
        return result;
    }
}

const tree = new BinarySearchTree();
const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

function drawTree(node, x, y, level = 0) {
    if (!node) return;
    const offset = 150 / (level + 1);
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - offset, y + 60);
        ctx.stroke();
        drawTree(node.left, x - offset, y + 60, level + 1);
    }
    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + offset, y + 60);
        ctx.stroke();
        drawTree(node.right, x + offset, y + 60, level + 1);
    }
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(node.value, x, y + 6);
}

function renderTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(tree.root, canvas.width / 2, 50);
}

async function highlightTraversal(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        renderTree();
        highlightNode(tree.root, canvas.width / 2, 50, 0, nodes[i], "orange");
    }
}

async function highlightNode(node, x, y, level, value, color) {
    if (!node) return;
    const offset = 150 / (level + 1);
    if (node.value === value) {
        renderTree();
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(node.value, x, y + 6);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return;
    }
    if (value < node.value) {
        highlightNode(node.left, x - offset, y + 60, level + 1, value, color);
    }
    else {
        highlightNode(node.right, x + offset, y + 60, level + 1, value, color);
    }
}

async function insertNode() {
    const value = document.getElementById("nodeValue").value;
    if (value === "") {
        alert("Please enter a value.");
        return;
    }
    await tree.insert(parseInt(value));
    document.getElementById("nodeValue").value = "";
    renderTree();
}

async function deleteNode() {
    const value = document.getElementById("nodeValue").value;
    if (value === "") {
        alert("Please enter a value to delete.");
        return;
    }
    await tree.delete(parseInt(value));
    document.getElementById("nodeValue").value = "";
    renderTree();
}

async function traverseTree(type) {
    let result = [];
    if (type === "inorder") {
        result = tree.inorder(tree.root);
    }
    else if (type === "preorder") {
        result = tree.preorder(tree.root);
    }
    else if (type === "postorder") {
        result = tree.postorder(tree.root);
    }
    else if (type === "levelorder") {
        result = tree.levelorder();
    }
    document.getElementById("output").innerText = `${type.toUpperCase()} TRAVERSAL: ${result.join(", ")}`;
    await highlightTraversal(result);
}