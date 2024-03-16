import AuthRequest from "@requests/AuthRequest";
import { GroupListIdValidator } from "@validators/GroupListValidator";

export default class LeaveGroupRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return GroupListIdValidator();
    }
}