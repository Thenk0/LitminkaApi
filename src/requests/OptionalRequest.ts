import prisma from "../db";
import { RequestAuthTypes } from "../ts/enums";
import Request from "./Request";


export default class OptionalRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Optional;

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserById(userId);
    }
}