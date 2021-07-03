import React, { useState } from 'react'

import { Widget, loadClient } from 'gpdb-widget'
import { useDebouncedCallback } from 'use-debounce'

const style = {
  margin: '50px auto 0 auto',
}

const App = () => {
  const [name, setName] = useState('Jon Snow');

  const applicationContext = { instanceSig: 'name-coach.com', typeSig: 'email_dns_name' }
  const nameOwnerContext = { signature: 'jack@name-coach.com', email: 'jack@name-coach.com' }
  const userContext = { email: 'jon.snow@name-coach.com', signature: 'jon.snow@name-coach.com' }

  const client = loadClient(
    {
      accessKeyId: "WDtHDuULcObwYdva0E5ZfPfsNpRSQWxq",
      secretAccessKey: "Jcdu4q4I4MGw2Jt8cctJ_E-aQAb1zKUHeKH6aWyRsJU"
    },
    applicationContext,
    nameOwnerContext,
    userContext
  )

  const debounced = useDebouncedCallback(
    (value) => {
      if (value.trim().length === 0) return;
      setName(value);
    },
    600
  );

  return <>
    <div style={{ margin: "50px auto 0 auto", width: "400px" }}>
      Name:
      <input
        defaultValue={name}
        type="text"
        onChange={(e) => debounced(e.target.value)}
        required
        style={{ width: "80%", marginLeft: "20px" }}
      />
    </div>

    <Widget client={client} name={name} width={600} style={style} />
  </>
}

export default App
