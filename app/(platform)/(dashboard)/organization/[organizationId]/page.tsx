import { OrganizationSwitcher, auth } from '@clerk/nextjs'
import React from 'react'

function OrganizationPage() {
  const { orgId, userId } = auth();  
  return (
    <div>
     <OrganizationSwitcher 
        hidePersonal
     />
    </div>
  )
}

export default OrganizationPage
