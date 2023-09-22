class File{
    id: string
    fileName: string;
    path: string;
    content: string;
    createdAt: Date;
    lastChange: Date;

    parentId?: string

    constructor(id: string, fileName: string, path: string, content: string, createdAt: Date, lastChange: Date){
        this.id= id;
        this.fileName = fileName;
        this.path = path;
        this.content = content;
        this.createdAt = createdAt;
        this.lastChange = lastChange;
    }



}

export default File;