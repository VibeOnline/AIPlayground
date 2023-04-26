const ctx = document.querySelector("canvas").getContext("2d");

// Format page
function init() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.scale(window.innerWidth / 128, window.innerHeight * (window.innerWidth / window.innerHeight) / 128);
    ctx.imageSmoothingEnabled = false;
    ctx.font = "2px monospace";
} init(), window.onresize = init; // Start and resize

// Scene objects
const inst = [ new Player().as_owner(), new NPC() ]; // Instances in scene
var cam = { x: 0, y: 0, lock: inst[0] }; // Camera values

// Render frames
let lastFrame = new Date().getTime();
function draw() {
    requestAnimationFrame(draw); // Loop

    // Get delta
    let thisFrame = new Date().getTime();
    let delta = (thisFrame - lastFrame) / 100;
    lastFrame = thisFrame;

    // Clear and move cam
    ctx.save();
    ctx.translate(cam.x, cam.y);
    ctx.clearRect(-64, -64, 128, 128);

    // Render scene
    inst.forEach(i => {
        if (i instanceof NPC || i instanceof Player) {
            // Show body
            ctx.fillStyle = "red";
            ctx.fillRect(i.x * 16 - 8, i.y * 16 - 8, 16, 16);

            // Get latest message
            ctx.fillStyle = "black";
            let msg = i.conversation[i.conversation.length - 1];
            if (msg) {
                if (msg.role != "user" || i instanceof Player) {
                    ctx.fillText(msg.content, i.x * 16 - msg.content.length / 2, i.y * 16 - 10);
                }
            }

            i.move(delta);
        } else if (i instanceof Tapastry) {
            ctx.drawImage(i.image, i.x * 16 - 8, i.y * 16 - 8, 16, 16);
        }
    });

    // Lock camera
    if (cam.lock) {
        cam.x = cam.lock.x * -16;
        cam.y = cam.lock.y * -16;
    }

    // Restore
    ctx.restore();
} draw(); // Start