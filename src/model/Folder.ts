import File from "./File";

class Folder{
    id: string
    fullPath: string;
    parentFolder: string;
    folderName: string;
    subFolders: Folder[];
    files: File[];

    constructor(id: string, fullPath: string, parentFolder: string, folderName: string, folders: Folder[], files: File[]){
        this.id = id;
        this.folderName = folderName;
        this.fullPath = fullPath;
        this.parentFolder = parentFolder;
        this.subFolders = folders;
        this.files = files;
    }
}

export default Folder;