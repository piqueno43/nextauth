import { GetServerSideProps } from 'next'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { parseCookies } from 'nookies';

import styles from '../styles/Home.module.scss'
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home() {
  const [user, setUser] = useState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useContext(AuthContext)
  
  async function handleSubmit (event: FormEvent) {
    event.preventDefault()
    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <div className={styles.container}>
     <form onSubmit={handleSubmit}>
      <h3>Login</h3>
      <label htmlFor="email">
        Email:        
        <input 
        id="email"
        type="text"
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        />
      </label>
      <label htmlFor="password">
        Password:
        <input 
        id="password"
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
      />
      </label>
      <button type="submit">Entrar</button>
     </form>
    </div>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {  
  return {props: {}}
});