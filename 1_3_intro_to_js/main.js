console.log('hello world');

document.addEventListener("DOMContentLoaded", function () {
    const clickButton = document.getElementById("clickButton");
    const resetButton = document.getElementById("resetButton");
    const countDisplay = document.getElementById("count");
    const circle = document.querySelector(".circle");

    let count = 0;
    let fontSize = 24;

    clickButton.addEventListener("click", function () {
        count++;
        countDisplay.textContent = count;
        fontSize += 2; 
        countDisplay.style.fontSize = fontSize + "px";

        const newSize = 100 + count * 10; 
        circle.style.width = newSize + "px";
        circle.style.height = newSize + "px";
    });

    resetButton.addEventListener("click", function () {
        count = 0;
        fontSize = 24;
        countDisplay.textContent = count;
        countDisplay.style.fontSize = fontSize + "px";
        circle.style.width = "100px"; 
        circle.style.height = "100px";
    });
});
