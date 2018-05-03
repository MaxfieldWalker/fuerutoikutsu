/*
 * 定数
 */

// なに 足す なに かを決める
const left = 4;
const right = 3;
const margin = 60;



function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

function getExpressionNode() {
    return document.getElementById("expression");
}
function getNumbersNode() {
    return document.getElementById("numbers");
}

function showAppleCount(option) {
    function showLeft() {
        const leftPromises = [];
        if (option.left) {
            // りんごのカウントを表示する
            for (let i = 0; i < left; i++) {
                const numberNode = document.createElement("span");
                numberNode.className = "number-node";
                numberNode.textContent = (i + 1).toString();
                numberNode.style.opacity = "0.0";
                getNumbersNode().appendChild(numberNode);

                x = 20 + i * (64 + 20);
                leftPromises.push(anime({
                    targets: numberNode,
                    translateX: {
                        value: [x - 20, x],
                        duration: 1200
                    },
                    opacity: 1.0,
                    delay: i * 500
                }).finished);
            }
        }
        return leftPromises;
    }

    function showRight() {
        const rightPromises = [];
        if (option.right) {
            for (let i = 0; i < right; i++) {
                const numberNode = document.createElement("span");
                numberNode.className = "number-node";
                const count = (option.left && option.right) ? (left + i + 1) : (i + 1);
                numberNode.textContent = count.toString();
                numberNode.style.opacity = "0.0";
                getNumbersNode().appendChild(numberNode);

                const x = margin + 20 + (left + i) * (64 + 20);
                const factor = option.left ? (left + i) : i;
                rightPromises.push(anime({
                    targets: numberNode,
                    translateX: {
                        value: [x - 20, x],
                        duration: 1200
                    },
                    opacity: 1.0,
                    delay: factor * 500
                }).finished);
            }
        }

        return rightPromises;
    }

    if (option.left && option.right) {
        return Promise.all(showLeft().concat(showRight()));
    } else if (option.left) {
        return Promise.all(showLeft());
    } else if (option.right) {
        return Promise.all(showRight());
    } else {
        throw "error";
    }
}


function genApple() {
    const apple = document.createElement("img");
    apple.src = "img/apple.png";
    apple.width = 64;
    return apple;
}

// 左辺のりんごを表示する
const appDiv = document.getElementById("app");
for (let i = 0; i < left; i++) {
    const applesDiv = document.getElementById("apples");
    const apple = genApple();
    anime({
        targets: apple,
        scale: [2, 1], // 2倍から1倍へ
        translateX: [i * 20, i * 20]
    });
    applesDiv.appendChild(apple);
}

sleep(1000).then(() => {

    showAppleCount({ left: true }).then(() => {
        // 左辺のりんごを出した後
        getExpressionNode().textContent = left;

        sleep(1000).then(() => {
            // 右辺のりんごを表示
            for (let i = 0; i < right; i++) {
                const applesDiv = document.getElementById("apples");
                const apple = genApple();
                x = margin + (left + i) * 20;
                anime({
                    targets: apple,
                    scale: [2, 1], // 2倍から1倍へ
                    translateX: [x, x]
                });
                applesDiv.appendChild(apple);
            }
            sleep(1000).then(() => {
                showAppleCount({ right: true }).then(() => {
                    getExpressionNode().textContent += " + " + right;
                    sleep(1000).then(() => {
                        // いったん数字を消す
                        const n = getNumbersNode();
                        while (n.firstChild) {
                            n.removeChild(n.firstChild);
                        }
                        sleep(1000).then(() => {
                            showAppleCount({ left: true, right: true }).then(() => {
                                getExpressionNode().textContent += " = " + (left + right);
                            })
                        });
                    });

                });
            });
        });
    });
});
