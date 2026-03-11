import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    backendToken: string;
    firstName: string;
    lastName: string;
    role: {
      roleId: number;
      roleName: string;
    };
  }

  interface Session {
    user: {
      id: string;
      backendToken: string;
      email: string;
      firstName: string;
      lastName: string;
      role: {
        roleId: number;
        roleName: string;
      };
      avatar?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    backendToken: string;
    email: string;
    firstName: string;
    lastName: string;
    role: {
      roleId: number;
      roleName: string;
    };
    avatar?: string | null;
  }
}