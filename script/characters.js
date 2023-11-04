class NPC extends AI {
    // Private attributes
    #mov_x = 0;
    #mov_y = 0;
    #request = new XMLHttpRequest();
    #API_KEY = "OPENAI_API_KEY";

    constructor() {
        super();

        // Public attributes
        this.x = 0;
        this.y = 0;
        this.speed = 1;
    }

    #ready_signal() {
        this.#request.open("POST", "https://api.openai.com/v1/chat/completions");
        this.#request.setRequestHeader("Content-Type", "application/json");
        this.#request.setRequestHeader("Authorization", "Bearer " + this.#API_KEY);
    }

    // Instruct ChatGPT but don't store message
    async tell(mess) {
        // Setup request
        this.#ready_signal();

        // Send request
        this.#request.send(JSON.stringify({
           "model": "gpt-3.5-turbo",
           "messages": [{ role: "user", content: mess }],
           "temperature": 0.7
        }));

        // Recieve response
        return new Promise(() => {
            this.#request.onload = (e) => {
                let msg = JSON.parse(e.target.responseText).choices[0].message;

                if (this.debug) console.log(msg); // Report all messages

                // Move based on instruction
                if (msg.content.includes("ACTION MOVEME")) {
                    let instruct = msg.content.split(" ");

                    instruct.forEach(mov => {
                        if (mov.includes("UP")) this.#mov_y -= 1;
                        if (mov.includes("DOWN")) this.#mov_y += 1;
                        if (mov.includes("LEFT")) this.#mov_x -= 1;
                        if (mov.includes("RIGHT")) this.#mov_x += 1;
                    });
                }
            }
        });
    }

    move(delta) {
        // Move left or right
        if (this.#mov_x > this.x) this.x += delta;
        if (this.#mov_x < this.x) this.x -= delta;

        // Move up or down
        if (this.#mov_y > this.y) this.y += delta;
        if (this.#mov_y < this.y) this.y -= delta;
    }
}
