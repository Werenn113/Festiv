export type UserType = {
    id: number
    createdAt: Date
    updateAt: Date
    username: string
    email: string
    // role: RoleType
    isLoggedOut?: boolean
}    

// export type RoleType = "user" | "admin"