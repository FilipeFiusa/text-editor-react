import File from "./File";

class Folder{
    id: string
    root: string;
    folders: Folder[];
    files: File[];

    constructor(id: string, root: string, folders: Folder[], files: File[]){
        this.id = id;
        this.root = root;
        this.folders = folders;
        this.files = files;
    }
}

export default Folder;