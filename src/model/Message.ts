export default class Message {
    id?: number;
    icon: string;
    userName: string;
    content: string;

    constructor(icon:string, userName:string, content:string){
        this.icon = icon;
        this.userName = userName;
        this.content = content;
    }
}
