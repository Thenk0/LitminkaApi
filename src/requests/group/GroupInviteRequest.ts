import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";

export default class GroupInviteRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithGroupInvites(userId);
    }
}