import React from 'react'
import { useCurrentUser } from '~/hooks/auth';

function route() {
      const {data} = useCurrentUser()
    
      console.log(data);
  return (
    <div>route</div>
  )
}

export default route