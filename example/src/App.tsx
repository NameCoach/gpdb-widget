import React from 'react'

import { Widget, loadClient } from 'gpdb-components'

const App = () => {
  const applicationContext = { instanceSig: 'namecoach.com', typeSig: 'email_dns_name' }
  const nameOwnerContext = { signature: 'pavel.shushpan@jeturby.com' }
  const userContext = { signature: 'pavel.shushpan@jeturby.com' }

  const client = loadClient(
    {
      accessKeyId: process.env.REACT_APP_GPDB_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_GPDB_SECRET_ACCESS_KEY
    },
    applicationContext,
    nameOwnerContext,
    userContext
  )

  return <Widget client={client} name="Pavel Shushpan" width={300} />
}

export default App
