import React, { useContext, useEffect } from 'react'
import { Can } from '../components/Can'
import { AuthContext, signOut } from '../contexts/AuthContext'
import { useCan } from '../hooks/useCan'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const userCanSeeMetrics = useCan({ roles: ['administrator', 'editor'] });
  
  useEffect(() => {
    api.get('me')
    .then(response => console.log(response.data))    
  }, []);

  return (
    <div>
      <h1>Dashboard {user?.email}</h1>
      <button onClick={signOut}>Sign out</button>
      {userCanSeeMetrics && <h1>Metrics page</h1>}
      <Can permissions={['metrics.list']}>
        <h2>Metrics</h2>
      </Can>
    </div>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
 
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('me');

  console.log(response)
  
  return {
    props: {}
  }
});
