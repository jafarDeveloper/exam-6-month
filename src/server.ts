import http from "node:http";
import { METHODS_ENUM, serverConfiguration } from "./config";
import userController from "./controllers/auth.controller";
import { checkToken } from "./models/checkToken";
import todosController from "./controllers/todos.controller";
import { TodoValidator } from "./utils/validator";
import { Todo } from "./types";
const { port } = serverConfiguration;






import { createServer, IncomingMessage, ServerResponse } from "http";

const requestCounts: Map<string, number[]> = new Map();

const RATE_LIMIT = 2; 
const WINDOW_TIME = 1 * 1000; 

const rateLimiter = (req: IncomingMessage, res: ServerResponse) => {
  const ip = req.socket.remoteAddress || "unknown";
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip)!;
  timestamps.push(now);

  while (timestamps.length > 0 && timestamps[0] < now - WINDOW_TIME) {
    timestamps.shift();
  }

  if (timestamps.length > RATE_LIMIT) {
    res.writeHead(429, { "Content-Type": "text/plain" });
    res.end("Too Many Requests. Please try again later.");
    return false;
  }

  return true;
};




const server = http.createServer(async (req, res) => {
    if (!rateLimiter(req, res)) {
        return;
      }
    let reqUrl:string = (req.url as string).trim().toLocaleLowerCase();
    let reqMethod:string = (req.method as string).trim().toUpperCase();
    res.setHeader("Content-type", "application/json");
    if(reqUrl.startsWith("/api")){
        if(reqUrl.startsWith("/api/auth/register") && reqMethod == METHODS_ENUM.CREATE) return userController.register(req, res);
        if(reqUrl.startsWith("/api/auth/login") && reqMethod == METHODS_ENUM.CREATE) return userController.login(req, res);
        if(await checkToken(req, res)){
            if(reqUrl.startsWith("/api/todos") && reqMethod == METHODS_ENUM.READ) return  todosController.getTodos(req,res);
            if(reqUrl.startsWith("/api/todo/create") && reqMethod == METHODS_ENUM.CREATE) return  todosController.cerateTodo(req,res);
            if(reqUrl.startsWith("/api/todo/") && reqMethod == METHODS_ENUM.UPDATE) return  todosController.updateTodo(req,res);
            if(reqUrl.startsWith("/api/todo/") && reqMethod == METHODS_ENUM.DELETE) return  todosController.deleteTodo(req,res);
            if(reqUrl.startsWith("/api/todo/") && reqMethod == METHODS_ENUM.READ) return  todosController.getTodo(req,res);
            
        }
    }else return res.end(JSON.stringify({message: "Invalid URL", status: 404}));
})
server.listen(port, () => {
    console.log(`Server is runnin on ${port}-port`)
})