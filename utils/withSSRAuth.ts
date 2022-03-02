import {
  GetServerSideProps,
  GetServerSidePropsResult,
  GetServerSidePropsContext,
} from "next"
import decode from 'jwt-decode';

import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../services/erros/AuthTokenError"
import { validadeUserPermissions } from "./validadeUserPermissions";

type WithSSRAuthOptions = {
  permissions?: string[]
  roles?: string[]
}

// verifica se o usuário está autenticado e redireciona para a página de login
export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
  return async function (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> {
    const cookies = parseCookies(ctx)
    const token = cookies['nextauth.token']

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    if (options) {
      const user = decode<{ permissions: string[], roles: string[] }>(token);
      const { permissions, roles } = options || {};

      const userHasValidPermissions = validadeUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}