import {
  GetServerSideProps,
  GetServerSidePropsResult,
  GetServerSidePropsContext,
} from "next"

import { parseCookies } from "nookies"
// verifica se o usuário está logado e redireciona para a página de dashboard
export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async function (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> {
    const cookies = parseCookies(ctx)

    if (cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    return await fn(ctx)
  }

}