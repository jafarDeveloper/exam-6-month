import fs from "fs/promises"
import { serverConfiguration } from "../config";
import { Todo, User } from "../types";
const {dbFilePath} = serverConfiguration;
export const writeFile = async (fileName:string, data:User[]|Todo[]):Promise<boolean> => {
    await fs.writeFile(dbFilePath(fileName), JSON.stringify(data, null, 4));
    return true;
};
