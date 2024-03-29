import { CreateUser, FollowAnime, LoginUser, UserNotify } from "@/ts";
import prisma from "@/db";
import { Prisma } from "@prisma/client";

const extention = Prisma.defineExtension({
    name: "UserModel",
    model: {
        user: {
            async createUser(createUser: CreateUser) {
                const { email, login, password, name } = createUser;
                await prisma.user.create({
                    data: {
                        email,
                        login,
                        password,
                        name,
                        role: {
                            connectOrCreate: {
                                where: {
                                    name: "user"
                                },
                                create: {
                                    name: "user"
                                }
                            }
                        },
                        integration: { create: {} }
                    }
                });
            },
            async findUserByIdWithAnimeList(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: { id },
                    include: {
                        animeList: {
                            include: {
                                anime: true
                            }
                        }
                    }
                });
            },
            async findUserByShikimoriLinkToken(token: string) {
                return await prisma.user.findFirstOrThrow({
                    where: {
                        shikimoriLink: {
                            token
                        }
                    },
                    include: {
                        integration: true,
                        shikimoriLink: true
                    }
                });
            },
            async findUserByIdWithIntegration(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: {
                        id
                    },
                    include: {
                        integration: true,
                        shikimoriLink: true
                    },
                });
            },
            async findUserByIdWithRolePermission(id: number) {
                return await prisma.user.findFirst({
                    where: {
                        id
                    },
                    include: {
                        role: {
                            include: {
                                permissions: true
                            }
                        }
                    },
                });
            },
            async findUserWithTokensAndPermissions(id: number) {
                return await prisma.user.findFirst({
                    where: { id },
                    include: {
                        role: {
                            include: { permissions: true }
                        },
                        sessionTokens: true
                    }
                });
            },
            async findUserById(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: { id }, include: {
                        role: {
                            include: {
                                permissions: true
                            }
                        }
                    }
                });
            },
            async findUserWithOwnedGroups(id: number) {
                return await prisma.user.findFirstOrThrow({ where: { id }, include: { ownedGroups: true } });
            },
            async findUserWithGroupInvites(id: number) {
                return await prisma.user.findFirstOrThrow({ where: { id }, include: { groupInvites: true } });
            },
            async removeById(id: number) {
                return await prisma.user.delete({
                    where: {
                        id
                    }
                })
            },
            async findUserByLogin(login: string) {
                return prisma.user.findFirst({
                    include: {
                        role: {
                            include: {
                                permissions: true
                            }
                        }
                    },
                    where: {
                        OR: [
                            { login: { equals: login } },
                            { email: { equals: login } }
                        ]
                    }
                });
            },
            async followAnime(follow: FollowAnime) {
                const { animeId, userId, status, translationId } = follow
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        follows: {
                            create: {
                                status,
                                animeId,
                                translationId
                            }
                        }
                    }
                });
            },
            async removeIntegrationById(id: number) {
                await prisma.user.update({
                    where: { id },
                    data: {
                        integration: {
                            update: {
                                shikimoriCode: null,
                                shikimoriId: null,
                                shikimoriRefreshToken: null,
                                shikimoriToken: null,
                            }
                        }
                    }
                })
            }
        }
    }
})

export { extention as UserExt }