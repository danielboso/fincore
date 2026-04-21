import { createServerFn } from "@tanstack/react-start"
import { getRequest, setResponseHeader } from "@tanstack/react-start/server"
import { db } from "@/core/server/db"
import { user, session } from "@/core/server/schema"
import { eq, and, gt } from "drizzle-orm"
import { hashPassword, verifyPassword, generateSessionId } from "@/core/server/auth-utils"
import { loginSchema, registerSchema } from "@/features/auth/schemas"

const SESSION_COOKIE_NAME = "fincore_session"
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30 // 30 days

export const getSession = createServerFn({ method: "GET" })
  .handler(async () => {
    const request = getRequest()
    const cookies = request?.headers.get("cookie")
    const sessionId = cookies
      ?.split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.split("=")[1]

    if (!sessionId) return null

    const result = await db
      .select({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
        },
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(
        and(
          eq(session.id, sessionId),
          gt(session.expiresAt, new Date())
        )
      )
      .limit(1)

    const found = result[0]
    if (!found) return null

    return {
      user: found.user,
      session: found.session,
    }
  })

export const registerAction = createServerFn({ method: "POST" })
  .inputValidator(registerSchema)
  .handler(async ({ data }) => {

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.username, data.username))
      .limit(1)

    if (existingUser.length > 0) {
      throw new Error("Username already taken")
    }

    const userId = crypto.randomUUID()
    const password = hashPassword(data.password)

    await db.insert(user).values({
      id: userId,
      username: data.username,
      name: data.name,
      password: password,
    })

    const sessionId = generateSessionId()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    await db.insert(session).values({
      id: sessionId,
      userId,
      expiresAt,
    })

    setResponseHeader(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION / 1000}`
    )

    return { success: true }
  })

export const loginAction = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const foundUsers = await db
      .select()
      .from(user)
      .where(eq(user.username, data.username))
      .limit(1)

    const userRecord = foundUsers[0]
    if (!userRecord || !verifyPassword(data.password, userRecord.password)) {
      throw new Error("Invalid username or password")
    }

    const sessionId = generateSessionId()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    await db.insert(session).values({
      id: sessionId,
      userId: userRecord.id,
      expiresAt,
    })

    setResponseHeader(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION / 1000}`
    )

    return { success: true }
  })

export const logoutAction = createServerFn({ method: "POST" })
  .handler(async () => {
    const request = getRequest()
    const cookies = request?.headers.get("cookie")
    const sessionId = cookies
      ?.split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.split("=")[1]

    if (sessionId) {
      await db.delete(session).where(eq(session.id, sessionId))
    }

    setResponseHeader(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    )

    return { success: true }
  })
