let inp = document.querySelector("#textbox");
inp.style.height = "0px";

class Player {
    // Private attributes
    #mov = [ 0, 0, 0, 0 ];
    #typing = false;

    constructor() {
        // Public attributes
        this.x = 0;
        this.y = 0;
        this.speed = 1;
        this.owner = false;
        this.conversation = [];
        this.voiceRange = 4;
    }

    // Broadcast message to nearby agents
    say(msg) {
        this.conversation.push({ role: "user", content: msg }); // Log

        inst.forEach(i => {
            if (i instanceof NPC) {
                if (Math.sqrt(Math.pow(i.x - this.x, 2) + Math.pow(i.y - this.y, 2)) < this.voiceRange) i.chat(msg);
            };
        });
    }

    as_owner() {
        if (window.playerOwner) window.playerOwner.owner = false;
        window.playerOwner = this;
        this.owner = true;

        // Keybaord
        window.addEventListener("keydown", (e) => {
            if (this.#typing) { // Typing
                inp.focus();
                if (e.code == "Enter") {
                    inp.style.height = "0px";
                    this.#typing = false;
                    this.say(inp.value);
                    inp.value = "";
                    inp.blur();
                }
            } else { // Moving
                switch (e.code) {
                    case "KeyW": this.#mov[0] = 1; break;
                    case "KeyA": this.#mov[1] = 1; break;
                    case "KeyS": this.#mov[2] = 1; break;
                    case "KeyD": this.#mov[3] = 1; break;
                    case "Enter":
                        inp.style.height = "50px";
                        this.#typing = true;
                        break;
                }
            }
        });
        
        window.addEventListener("keyup", (e) => {
            if (!this.#typing) {
                switch (e.code) {
                    case "KeyW": this.#mov[0] = 0; break;
                    case "KeyA": this.#mov[1] = 0; break;
                    case "KeyS": this.#mov[2] = 0; break;
                    case "KeyD": this.#mov[3] = 0; break;
                }
            }
        });

        return this;
    }

    cam_lock() {
        if (cam) cam.lock = this;
    }

    move(delta) { // Move player around based on input
        let mx = this.#mov[3] - this.#mov[1];
        let my = this.#mov[2] - this.#mov[0];

        this.x += mx * delta;
        this.y += my * delta;
    }
}