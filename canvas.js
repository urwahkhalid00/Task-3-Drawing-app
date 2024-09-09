const canvas = document.getElementById("canvas");
const body = document.querySelector("body");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var thecolor = '';
let prevX = null;
let prevY = null;
let draw = false;

body.style.backgroundColor = "#fffffff";
var theinput = document.getElementById("favclr");
theinput.addEventListener("input" , function () {
    thecolor = theinput.value;
    body.style.backgroundColor = thecolor;
}, false);

const ctx = canvas.getContext("2d");

let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", ()=>{
        ctx.strokeStyle = clr.dataset.clr;
    })
})

let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

let saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
    let data = canvas.toDataURL("imag/png");
    let a = document.createElement("a");
    a.href = data;
    a.download = "sketch.png";
    a.click();
})

window.addEventListener("mousedown", (e) => draw = true);
window.addEventListener("mouseup", (e) => draw = false);

window.addEventListener("mousemove", (e) => {
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX;
        prevY = e.clientY;
        return
    }

    let currentX = e.clientX;
    let currentY = e.clientY;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    prevX = currentX;
    prevY = currentY;
})


// Get the brush elements
let brushes = document.querySelectorAll(".brush");
brushes = Array.from(brushes);

// Add event listeners to the brushes
brushes.forEach(brush => {
    brush.addEventListener("click", () => {
        let brushSize = brush.dataset.brush;
        if (brushSize === "small") {
            ctx.lineWidth = 2;
        } else if (brushSize === "medium") {
            ctx.lineWidth = 5;
        } else if (brushSize === "large") {
            ctx.lineWidth = 10;
        }
    });
});

// Get the shape elements
let shapes = document.querySelectorAll(".shape");
shapes = Array.from(shapes);

// Add event listeners to the shapes
shapes.forEach(shape => {
    shape.addEventListener("click", () => {
        let shapeType = shape.dataset.shape;
        addShape(shapeType, prevX, prevY);
    });
});

// Array to store the shapes
let shapeArray = [];

// Function to add a shape to the array
function addShape(shapeType, x, y) {
    shapeArray.push({ type: shapeType, x: x, y: y });
    drawShapes();
}

// Function to draw the shapes
function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapeArray.forEach(shape => {
        if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, 50, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (shape.type === "square") {
            ctx.beginPath();
            ctx.rect(shape.x - 50, shape.y - 50, 100, 100);
            ctx.stroke();
        } else if (shape.type === "triangle") {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y - 50);
            ctx.lineTo(shape.x - 50, shape.y + 50);
            ctx.lineTo(shape.x + 50, shape.y + 50);
            ctx.closePath();
            ctx.stroke();
        }
    });
}

// Variables to store the shape being dragged and its offset
let draggedShape = null;
let shapeOffsetX = 0;
let shapeOffsetY = 0;

// Update the mousedown event listener to start dragging shapes
window.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("shape")) {
        draggedShape = e.target.dataset.shape;
        shapeOffsetX = e.clientX - prevX;
        shapeOffsetY = e.clientY - prevY;
    } else {
        draw = true;
    }
});

// Update the mousemove event listener to drag shapes
window.addEventListener("mousemove", (e) => {
    if (draggedShape) {
        prevX = e.clientX - shapeOffsetX;
        prevY = e.clientY - shapeOffsetY;

        // Find the shape being dragged and update its position
        shapeArray.forEach((shape, index) => {
            if (shape.type === draggedShape) {
                shape.x = prevX;
                shape.y = prevY;
                drawShapes();
            }
        });
    } else if (prevX == null || prevY == null || !draw) {
        prevX = e.clientX;
        prevY = e.clientY;
        return;
    }

    let currentX = e.clientX;
    let currentY = e.clientY;

    // Draw a line
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Update the previous coordinates
    prevX = currentX;
    prevY = currentY;
});

// Update the mouseup event listener to stop dragging shapes
window.addEventListener("mouseup", (e) => {
    if (draggedShape) {
        draggedShape = null;
    } else {
        draw = false;
    }
});

