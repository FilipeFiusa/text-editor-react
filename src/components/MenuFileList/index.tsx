import File from '../../model/File';
import Folder from "../../model/Folder";

import ArrowIcon from "../../icons/arrow.svg";
import FileIcon from "../../icons/file.svg";
import FolderIcon from "../../icons/folder.svg";

import './style.css';
import FolderContextMenu from '../FolderContextMenu';
import { useEffect, useState } from 'react';
import MenuListModal from '../modals/MenuListModal';
import FileContextMenu from '../FileContextMenu';

interface MenuFileListProps {
    workspaceFolder: Folder | null;
    changeSocketRoom(roomName:string): any; 
    workspaceName: string;

    addFolder(newFolderName: string, folder: string): any;
    addFile(fileName: string, folder: string): any;
    renameFolder(newFolderName: string, folder: string): any;
    deleteFolder(folder: string): any
    renameFile(parentId: string, newFilerName: string, fileId: string): any;
    deleteFile(parentId: string, fileId: string): any
}

function MenuFileList({
    workspaceFolder, 
    changeSocketRoom, 
    workspaceName,
    addFolder,
    addFile,
    renameFolder,
    deleteFolder,
    renameFile,
    deleteFile
}: MenuFileListProps){
    const [menuListModalActive, setMenuListModalActive] = useState(false);
    const [modalText, setModalText] = useState("");
    const [menuType, setMenuType] = useState("");
    const [clicked, setClicked] = useState(false);
    const [currentFolder, setCurrentFolder] = useState<Folder | null>();
    const [currentClickedFolder, setCurrentClickedFolder] = useState<Folder | null>();
    const [currentFile, setCurrentFile] = useState<File | null>();
    const [currentClickedFile, setCurrentClickedFile] = useState<File | null>();

    const [folderPoints, setFolderPoints] = useState({ x: 0, y: 0 })
    const [filePoints, setFilePoints] = useState({ x: 0, y: 0 })

    

    useEffect(() => {
        const handleClick = () => {
            setClicked(false)
            setCurrentClickedFolder(null);
            setCurrentClickedFile(null);
        };
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
      }, []);

    const mapFolder = (folder: Folder) => {
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
                        file.parentId = folder.id
                        return (
                            <li key={file.fileName} 
                                onClick={() => changeSocketRoom(folder.fullPath + "/" + file.fileName)}
                                onContextMenu={ (e) => fileContextMenu(e, file)}>
                            <img src={FileIcon} alt="" />
                            {file.fileName}</li>
                        )}): ""}
                </ul>    

                {currentClickedFolder
                    ? <FolderContextMenu 
                        x={folderPoints.x} 
                        y={folderPoints.y}

                        folder={currentClickedFolder}
                        
                        openModal={openModal}
                        /> 
                    : ""}

                {currentClickedFile
                    ? <FileContextMenu 
                        x={filePoints.x} 
                        y={filePoints.y}

                        file={currentClickedFile}
                        
                        openModalFile={openModalFile}
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
        setFolderPoints({
            x: e.pageX,
            y: e.pageY
        })

        setCurrentClickedFolder(clickedFolder);
    }

    const fileContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, clickedFile: File) => {
        e.preventDefault();

        setClicked(true);

        setFilePoints({
            x: e.pageX,
            y: e.pageY
        })

        console.log(clickedFile.parentId)

        setCurrentClickedFile(clickedFile);
    }


    const openModal = (modalText: string, menuType: string, folder?: Folder) => {
        setMenuListModalActive(true);
        setModalText(modalText);
        setMenuType(menuType);
        if(folder){
            setCurrentFolder(folder);
        }
    }

    const openModalFile = (modalText: string, menuType: string, file?: File) => {
        setMenuListModalActive(true);
        setModalText(modalText);
        setMenuType(menuType);

        console.log(modalText)
        console.log(menuType)

        if(file){
            setCurrentFile(file);
        }
    }

    const handleModalSubmit = (modalInputText: string) => {
        if(menuType == "AddFolder" && currentFolder) {
            addFolder(modalInputText, currentFolder.id);
        }

        if(menuType == "AddFile" && currentFolder) {
            addFile(modalInputText, currentFolder.id);
        }

        if(menuType == "RenameFolder" && currentFolder) {
            console.log(modalInputText)
            //console.log(currentFolder)

            renameFolder(modalInputText, currentFolder.id);
        }

        if(menuType == "DeleteFolder" && currentFolder) {
            console.log(currentFolder)
            //console.log(currentFolder)

            deleteFolder(currentFolder.id);
        }

        if(menuType == "RenameFile" && currentFile && currentFile.parentId) {
            console.log(currentFile.parentId)
            //console.log(currentFolder)

            renameFile(currentFile.parentId, modalInputText, currentFile.id);
        }


        if(menuType == "DeleteFile" && currentFile && currentFile.parentId) {
            console.log(currentFile)
            //console.log(currentFolder)

            deleteFile(currentFile.parentId, currentFile.id);
        }

        setCurrentFolder(null);
        setCurrentFile(null);
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
                handleModalSubmit={handleModalSubmit} 
                modalType={menuType} />            
        </div>
    );
}

export default MenuFileList;