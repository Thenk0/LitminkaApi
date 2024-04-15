import { Integration, User, UserSettings, SessionToken } from '@prisma/client';
import { RoleWithPermissions } from '@/ts/role';

export type UserWithIntegration = User & {
    integration: Integration | null;
};

export type UserWithIntegrationSettings = User & {
    integration: Integration | null;
    settings: UserSettings | null;
};

type UserWithTokens = User & {
    sessionTokens: SessionToken[];
};

export type UserWithPermissions = User & {
    role: RoleWithPermissions;
};

export interface LoginUser {
    password: string;
    login: string;
}

export interface CreateUser extends LoginUser {
    email: string;
    name?: string;
}
