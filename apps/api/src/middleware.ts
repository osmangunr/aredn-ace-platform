import {verifyToken} from "./auth";

export async function authGuard(req:any,reply:any){
  const header=req.headers.authorization;

  if(!header){
    return reply.code(401).send({
      error:"Missing authorization token"
    });
  }

  const token=header.replace("Bearer ","");

  try{
    req.user=verifyToken(token);
  }
  catch(e){
    return reply.code(401).send({
      error:"Invalid token"
    });
  }
}


export function roleGuard(...roles:string[]){
  return async(req:any,reply:any)=>{

    if(!req.user){
      return reply.code(401).send({
        error:"Unauthorized"
      });
    }

    if(!roles.includes(req.user.role)){
      return reply.code(403).send({
        error:"Forbidden"
      });
    }

  };
}
