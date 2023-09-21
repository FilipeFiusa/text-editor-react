import File from '../../model/File';
import Folder from "../../model/Folder";

import ArrowIcon from "../../icons/arrow.svg";
import FileIcon from "../../icons/file.svg";
import FolderIcon from "../../icons/folder.svg";

import './style.css';
import FolderContextMenu from '../FolderContextMenu';
import { useEffect, useState } from 'react';
import MenuListModal from '../modals/MenuListModal';

interface MenuFileListProps {
    workspaceFolder: Folder | null;
    changeSocketRoom(roomName:string): any; 
    workspaceName: string;

    addFolder(newFolderName: string, folder: string): any;
    addFile(fileName: string, folder: string): any;
    renameFolder(newFolderName: string, folder: string): any;
    deleteFolder(folder: string): any

}

function MenuFileList({
    workspaceFolder, 
    changeSocketRoom, 
    workspaceName,
    addFolder,
    addFile,
    renameFolder,
    deleteFolder
}: MenuFileListProps){
    const [menuListModalActive, setMenuListModalActive] = useState(false);
    const [modalText, setModalText] = useState("");
    const [menuType, setMenuType] = useState("");
    const [currentFolder, setCurrentFolder] = useState("");
    const [clicked, setClicked] = useState(false);
    const [currentClickedFolder, setCurrentClickedFolder] = useState("");
    const [points, setPoints] = useState({
        x: 0,
        y: 0
    })

    

    useEffect(() => {
        const handleClick = () => {
            setClicked(false)
            setCurrentClickedFolder("");
        };
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
      }, []);

    const mapFolder = (folder: Folder) => {
        //console.log(folder)

        return(
            <div key={folder.fullPath == "" ? "/" : folder.fullPath}>   
                <li 
                    onClick={() => checkFolderClicked(folder)}
                    onContextMenu={ (e) => folderContextMenu(e, folder) }>
                    <div><img id={folder.fullPath + "_icon"} src={ArrowIcon} alt="" /></div>
                    <div><img src={FolderIcon} alt="" /></div>
                    { folder.folderName == "/" ? workspaceName : folder.folderName }
                    </li>
                <ul className='close' id={folder.fullPath}>
                    {folder.subFolders && folder.subFolders.length !== 0 ? folder.subFolders.map((f) => {return mapFolder(f)}) : ""}
                    {folder.files && folder.files.length !== 0 ? folder.files.map(file => { 
                        return (
                            <li key={file.fileName} 
                                onClick={() => changeSocketRoom(folder.fullPath + "/" + file.fileName)}
                                onContextMenu={ (e) => fileContextMenu(e)}>
                            <img src={FileIcon} alt="" />
                            {file.fileName}</li>
                        )}): ""}
                </ul>    

                {currentClickedFolder != ""
                    ? <FolderContextMenu 
                        x={points.x} 
                        y={points.y}

                        folder={currentClickedFolder}
                        
                        openModal={openModal}
                        /> 
                    : ""}
            </div>
        )
    }

    function checkFolderClicked(folder: Folder){
        //console.log(folder)

        const test = document.getElementById(folder.fullPath == "" ? "/" : folder.fullPath );
        const icon = document.getElementById(folder.fullPath + "_icon");
        
        if(test?.classList.length === 0){
            icon?.classList.remove("open-image")
            test?.classList.add("close");
        }else{
            icon?.classList.add("open-image")
            test?.classList.remove("close");
        }
    }

    const folderContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, clickedFolder: Folder ) => {
        e.preventDefault();
        setClicked(true);
        setPoints({
            x: e.pageX,
            y: e.pageY
        })

        setCurrentClickedFolder(clickedFolder.fullPath);
    }

    const fileContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault();

        setClicked(true);

        setPoints({
            x: e.pageX,
            y: e.pageY
        })
    }


    const openModal = (modalText: string, menuType: string, folder?: string) => {
        setMenuListModalActive(true);
        setModalText(modalText);
        setMenuType(menuType);
        if(folder){
            setCurrentFolder(folder);
        }
    }

    const handleModalSubmit = (modalInputText: string) => {
        if(menuType == "AddFolder" && currentFolder != "") {
            addFolder(modalInputText, currentFolder);
        }

        if(menuType == "AddFile" && currentFolder != "") {
            addFile(modalInputText, currentFolder);
        }

        if(menuType == "RenameFolder" && currentFolder != "") {
            console.log(modalInputText)
            //console.log(currentFolder)

            renameFolder(modalInputText, currentFolder);
        }

        setCurrentFolder("");
        setMenuType("");
    }

    return (
        <div>
            <ul>
                {workspaceFolder ?  mapFolder(workspaceFolder) : ""}
            </ul>  

            <MenuListModal 
                isOpen={menuListModalActive} 
                setIsOpen={setMenuListModalActive} 
                modalText={modalText} 
                handleModalSubmit={handleModalSubmit} />            
        </div>
    );
}

export default MenuFileList;