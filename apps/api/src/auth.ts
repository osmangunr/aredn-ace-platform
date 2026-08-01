import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "ACE_SECRET_KEY_CHANGE";

export async function hashPassword(password:string){
  return await bcrypt.hash(password,10);
}

export async function comparePassword(password:string,hash:string){
  return await bcrypt.compare(password,hash);
}

export function createToken(user:any){
  return jwt.sign(
    {
      id:user.id,
      username:user.username,
      role:user.role
    },
    SECRET,
    {
      expiresIn:"7d"
    }
  );
}

export function verifyToken(token:string){
  return jwt.verify(token,SECRET);
}
