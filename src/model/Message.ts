import ConnectedUser from "./ConnectedUser";

export default class Message {
    id?: number;
    avatar: string;
    content: string;

    user: ConnectedUser;
    userName: string;

    constructor(icon:string, userName:string, content:string, user: ConnectedUser){
        this.avatar = icon;
        this.userName = userName;
        this.content = content;
        this.user = user;
    }
}
