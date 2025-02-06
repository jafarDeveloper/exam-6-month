import fs from "fs/promises"
import { serverConfiguration } from "../config";
import { Todo, User } from "../types";
const {dbFilePath} = serverConfiguration;
export const readFile = async (fileName:string):Promise<[] | User[]|Todo[]> => {
    let read:User[] | string  |Todo[] = await fs.readFile(dbFilePath(fileName), "utf-8");
    return read ? JSON.parse(read): [];
};
