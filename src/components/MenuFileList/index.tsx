import File from '../../model/File';
import Folder from "../../model/Folder";

import ArrowIcon from "../../icons/arrow.svg";
import FileIcon from "../../icons/file.svg";
import FolderIcon from "../../icons/folder.svg";

import './style.css';

interface MenuFileListProps {
    workspaceFolder: Folder | null;
    changeSocketRoom(roomName:string): any; 
    workspaceName: string;
}

function MenuFileList({workspaceFolder, changeSocketRoom, workspaceName}: MenuFileListProps){
    const tempFiles: Folder[] = [];
    tempFiles.push(new Folder("1", "src",
        [new Folder("2", "src/model", [], [
            new File("User.ts", "src/model", "nada aqui ainda model", new Date(), new Date()),
        ])], [
        new File("index.ts", "src", "nada aqui ainda", new Date(), new Date()),
        new File("index2.ts", "src", "nada aqui ainda 2", new Date(), new Date()),
        new File("index3.ts", "src", "nada aqui ainda 3", new Date(), new Date()),
    ]))

    function checkFolderClicked(folder: Folder){
        const test = document.getElementById(folder.root);
        const icon = document.getElementById(folder.root + "_icon");
        
        if(test?.classList.length === 0){
            icon?.classList.remove("open-image")
            test?.classList.add("close");
        }else{
            icon?.classList.add("open-image")
            test?.classList.remove("close");
        }
    }

    function mapFolder(folder: Folder){
        return(
            <div key={folder.root}>   
                <li onClick={ () => checkFolderClicked(folder)}>
                    <div><img id={folder.root + "_icon"} src={ArrowIcon} alt="" /></div>
                    <div><img src={FolderIcon} alt="" /></div>
                    { folder.root.split("/").at(-1)?.length == 0 ? workspaceName : folder.root.split("/").at(-1) }
                    </li>
                <ul className='close' id={folder.root}>
                    {folder.folders.length !== 0 ? folder.folders.map((f) => {return mapFolder(f)}) : ""}
                    {folder.files.length !== 0 ? folder.files.map(file => { return <li key={file.fileName} onClick={() => changeSocketRoom(folder.root + "/" + file.fileName)}><img src={FileIcon} alt="" />{file.fileName}</li> }): ""}
                </ul>    
            </div>
        )
    }

    return (
        <ul>
            {workspaceFolder ?  mapFolder(workspaceFolder) : ""}
        </ul>  
    );
}

export default MenuFileList;