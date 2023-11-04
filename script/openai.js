class AI {
    // Private attributes
    #API_KEY = "OPENAI_API_KEY";
    #request = new XMLHttpRequest();

    constructor() {
        // Public attributes
        this.conversation = [];
    }

    #ready_signal() {
        this.#request.open("POST", "https://api.openai.com/v1/chat/completions");
        this.#request.setRequestHeader("Content-Type", "application/json");
        this.#request.setRequestHeader("Authorization", "Bearer " + this.#API_KEY);
    }

    // Message ChatGPT
    async chat(mess) {
        // Add to conversation
        this.conversation.push({ role: "user", content: mess });

        // Setup request
        this.#ready_signal();

        // Send request
        this.#request.send(JSON.stringify({
           "model": "gpt-3.5-turbo",
           "messages": this.conversation,
           "temperature": 0.7
        }));

        // Recieve response
        return new Promise(resolve => {
            this.#request.onload = (e) => {
                let msg = JSON.parse(e.target.responseText).choices[0].message;
                this.conversation.push(msg);
                resolve(msg);
            };
        });
    }
}

class Tapastry {
    #API_KEY = "OPENAI_API_KEY";

    constructor(ref) {
        this.x = 0;
        this.y = 0;

        if (ref instanceof Image) {
            this.image = ref;
        } else {
            // Private attributes
            let request = new XMLHttpRequest();

            // Setup
            request.open("POST", "https://api.openai.com/v1/images/generations");
            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("Authorization", "Bearer " + this.#API_KEY);

            // Ready image
            this.image = new Image();
            request.onload = e => this.image.src = JSON.parse(e.target.responseText).data[0].url;

            // Finalize request
            request.send(JSON.stringify({ "prompt": ref, "n": 1, "size": "256x256" }));
        }
    }
}
