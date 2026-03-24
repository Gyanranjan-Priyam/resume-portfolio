
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";

import { admin } from "better-auth/plugins";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
        },
        google: {
            clientId: env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
        },
        discord: {
            clientId: env.AUTH_DISCORD_CLIENT_ID,
            clientSecret: env.AUTH_DISCORD_CLIENT_SECRET,
            permissions: 2048 | 16384, // Send Messages + Embed Links
        }
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
            },
            bio: {
                type: "string",
                required: false,
            },
            role: {
                type: "string",
                required: false,
            }
        }
    },
    plugins: [
        admin(),
    ],
});