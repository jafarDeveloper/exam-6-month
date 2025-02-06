import { IncomingMessage, ServerResponse } from "http";

type Request = IncomingMessage;
export type Response = ServerResponse<Request>
export abstract class Auth {
    abstract register(req: Request, res:Response): void;
    abstract login(req: Request, res:Response): void;
}

export abstract class Todos {
    abstract getTodos(req: Request, res:Response): void;
    abstract getTodo(req: Request, res:Response): void;
    abstract updateTodo(req: Request, res:Response): void;
    abstract deleteTodo(req: Request, res:Response): void;
    abstract cerateTodo(req: Request, res:Response): void;
}