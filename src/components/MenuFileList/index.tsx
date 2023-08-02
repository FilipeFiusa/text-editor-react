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
        return(
            <div key={folder.root}>   
                <li 
                    onClick={() => checkFolderClicked(folder)}
                    onContextMenu={ (e) => folderContextMenu(e, folder) }>
                    <div><img id={folder.root + "_icon"} src={ArrowIcon} alt="" /></div>
                    <div><img src={FolderIcon} alt="" /></div>
                    { folder.root.split("/").at(-1)?.length == 0 ? workspaceName : folder.root.split("/").at(-1) }
                    </li>
                <ul className='close' id={folder.root}>
                    {folder.folders.length !== 0 ? folder.folders.map((f) => {return mapFolder(f)}) : ""}
                    {folder.files.length !== 0 ? folder.files.map(file => { 
                        return (
                            <li key={file.fileName} 
                                onClick={() => changeSocketRoom(folder.root + "/" + file.fileName)}
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

    const folderContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, clickedFolder: Folder ) => {
        e.preventDefault();
        setClicked(true);
        setPoints({
            x: e.pageX,
            y: e.pageY
        })

        setCurrentClickedFolder(clickedFolder.root);
    }

    const fileContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault();
        console.log("file: ");
        console.log(e.pageX, e.pageY);

        setClicked(true);

        setPoints({
            x: e.pageX,
            y: e.pageY
        })

        console.log(points)
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
            console.log(modalInputText)
            console.log(currentFolder)

            addFolder(modalInputText, currentFolder);
        }

        if(menuType == "AddFile" && currentFolder != "") {
            console.log(modalInputText)
            console.log(currentFolder)

            addFile(modalInputText, currentFolder);
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