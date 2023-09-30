import ConnectedUser from "./ConnectedUser";
import Message from "./Message";

type DirectChat = {
    id: string
    users: ConnectedUser[];
    messages: Message[];
}

export default DirectChat;