import Folder from "./Folder";

export default interface Workspace {
    id: number;
    name: string;
    workspaceImage: string;
    inviteCode: string;
    workspaceRootFolder?: string;
    ownerId: number
    createdAt: Date

    setIsSelected?: () => void;
    newNotifications?: boolean;

    workspaceFolder: Folder;
}