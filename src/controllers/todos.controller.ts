import { IncomingMessage, ServerResponse } from "http";
import { Response, Todos } from "./controller.dto";
import { Error, Todo, User } from "../types";
import { ClientError, globalError, ServerError } from "../utils/error";
import { loginValidator, registerValidator, TodoValidator } from "../utils/validator";
import { readFile } from "../models/readFile";
import { writeFile } from "../models/writeFile";
import { tokenService } from "../lib/jwt/jwt";
import { log } from "console";
import { JwtPayload, verify } from "jsonwebtoken";
import { TokenBody } from "../lib/jwt/jwt.dto";
const { createToken } = tokenService;
class TodosController extends Todos {
    deleteTodo(req: IncomingMessage, res: Response): void {}
    getTodo(req: IncomingMessage, res: Response): void {}
    getTodos(req: IncomingMessage, res: Response): void {}
    updateTodo(req: IncomingMessage, res: Response): void {}
    cerateTodo(req: IncomingMessage, res: Response): void {}
    constructor(){
        super()
        this.getTodos =async(req:IncomingMessage,res:Response)=>{
            let todos:Todo[]=await readFile("todos.json") as Todo[];

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(todos))
        
        }
        this.getTodo=async(req:IncomingMessage,res:Response)=>{
            let todos:Todo[]=await readFile("todos.json") as Todo[];
             let id =req.url?.split("/").at(-1)
            let todo=todos.find((u)=>{
                
               if (u.id ==id)return u
            })
            if (!todo) {
                res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({message: "Todo is not available.", status: 404}))
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(todo))
        }
        this.cerateTodo=async(req:IncomingMessage,res:Response)=>{
            try {
                let todo_chunk: string = "";
                req.on("data", (chunk) => { todo_chunk += chunk });
                req.on("end", async () => {
                    try {
                        const todo: Todo = JSON.parse(todo_chunk);
                        const todos: Todo[] = await readFile("todos.json") as Todo[];
                        const validation:Boolean= TodoValidator(todo) as boolean ;
                        if (validation) {
                            const token: string = req.headers.token as string;
                            const verify_token: JwtPayload =tokenService.verifyToken(token) as JwtPayload;
                            todo.message = (todo.message.toLowerCase());
                            todo.iscomplate = false;
                            todo.id = todos.length ? (todos[todos.length - 1].id as number) + 1 : 1;
                            todo.user_id = verify_token.user_id;
                            todos.push(todo);
                            const save_todo: boolean | void = await writeFile("todos.json", todos);
                            if (!save_todo) throw new ServerError("Todo not saved");
                            
                            res.statusCode = 201;
                            res.end(JSON.stringify({message: "Todo is saved", status: 201,}));
                        }
                    } catch (error) {
                        globalError(res, (error as Error))
                    }
                })
            } catch (error) {
                globalError(res, (error as Error))
            }
        }
        this.deleteTodo=async(req:IncomingMessage,res:Response)=>{
            let todos:Todo[]=await readFile("todos.json") as Todo[];
            
            let user:TokenBody= tokenService.verifyToken(req.headers.token as string) as TokenBody
            
            let todo=todos.find((u)=>{
                let id =req.url?.split("/").at(-1)
                
                if (u.id ==id)return u
             })
             let id =req.url?.split("/").at(-1)
             if (user.user_id==todo?.user_id) {
                let ChangedTodos=todos.filter((u)=>u.id !=id)
                writeFile("todos.json", ChangedTodos)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({message:"Todo deleted", status:200}))
                
                
            }else{
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({message:"You can not delete this todo", status:400}))  
            }
            
        }
        this.updateTodo=(req:IncomingMessage,res:Response)=>{
            try {
                let todo_chunk: string = "";
                req.on("data", (chunk) => { todo_chunk += chunk });
                req.on("end", async () => {
                    try {
                        const change_todo: Todo = JSON.parse(todo_chunk);
                        const todos: Todo[] = await readFile("todos.json") as Todo[];
                        const validation:Boolean= TodoValidator(change_todo) as boolean;
                        if (validation) {
                            const todo_id: number = Number((req.url as string).trim().split("/").at(-1));
                            if (!todo_id) throw new ClientError("NOT FOUND", 404);
                            const find_index_todo: number = todos.findIndex((t: Todo) => t.id == todo_id);
                            if (find_index_todo == -1) throw new ClientError("NOT FOUND", 404);
                            const token: string = req.headers.token as string;
                            const verify_token: TokenBody = tokenService.verifyToken(token) as TokenBody;
                            const todo: Todo = todos[find_index_todo];
                            if (todo.user_id != verify_token.user_id) throw new ClientError("Todo is not edit", 400);
                            todo.message = change_todo.message;
                            todo.iscomplate = change_todo.iscomplate|| false;
                            const save_todo: boolean | void = await writeFile("todos.json", todos);
                            if (!save_todo) throw new ServerError("Todo is not changed");
                            
                            res.statusCode = 200;
                            res.end(JSON.stringify({message: "Todo is changed",status: 200,}));
                        }
                    } catch (error) {
                        globalError(res, (error as Error));
                    }
                })
            } catch (error) {
                globalError(res, (error as Error));
            }
        }
    }
}

export default new TodosController()