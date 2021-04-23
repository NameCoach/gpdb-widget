import React from 'react'

import { Widget, loadClient } from 'gpdb-components'

const App = () => {
  const applicationContext = { instanceSig: 'name-coach.com', typeSig: 'email_dns_name' }
  const nameOwnerContext = { signature: 'jon.snow@name-coach.com' }
  const userContext = { email: 'jon.snow@name-coach.com', signature: 'jon.snow@name-coach.com' }

  const client = loadClient(
    {
      accessKeyId: process.env.REACT_APP_GPDB_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_GPDB_SECRET_ACCESS_KEY
    },
    applicationContext,
    nameOwnerContext,
    userContext
  )

  return <Widget client={client} name="Jon Snow" width={300} />
}

export default App
