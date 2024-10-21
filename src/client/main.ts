import {fromEvent, map, tap, merge, shareReplay} from "rxjs";
import {serverMessages$, sendMessage} from "./connection";

const form = document.getElementById("form")!;

const userMessages$ = fromEvent<FormDataEvent>(form, 'submit').pipe(
    tap(event => event.preventDefault()), 
    tap(x => console.log(x)),
    map(e => {

        const messageInput: HTMLInputElement = ((e.currentTarget as HTMLFormElement).querySelector('input[name="message"]')!);
        const message = messageInput.value;
        messageInput.value = ""; 
        return message;
    }),
    map((message: string): Message => {
        return { data: message, action: "sent", timestamp: new Date() }; 
    }),
    shareReplay(1)
);
const messages$ = merge(userMessages$, serverMessages$);

messages$.subscribe(message => {
    console.log("message", message)
    const newMessage = document.createElement("li");
    newMessage.innerHTML = `
        <div>
            <p class="message-text">${message.data}</p>
            <p class="message-date">${message.action} ${new Date(message.timestamp).toLocaleString()}</p>
        </div>
    `;
    newMessage.classList.add(message.action);
    document.getElementById("messages")!.appendChild(newMessage);
});

userMessages$.subscribe(message => {
    sendMessage(message)
});




