import React, { useState } from 'react'

import { Widget, loadClient } from 'gpdb-widget'
import { useDebouncedCallback } from 'use-debounce'

const style = {
  margin: '50px auto 0 auto',
};

let termsAndConditionsKey = "AddInTermsAndConditionsAcceptance";
const termsAndConditions = {
  component: <div>
    By continuing to record I accept the <a href={'#'}>terms of use</a>, and am opting in to recording my name. Click here for <a href={'#'}>more info</a>.
  </div>,
  isAccepted: async () => localStorage.getItem(termsAndConditionsKey) === 'yes',
  onAccept: async () => localStorage.setItem(termsAndConditionsKey, 'yes')
};

const App = () => {
  const [name, setName] = useState('Jon Snow');

  const applicationContext = { instanceSig: 'name-coach.com', typeSig: 'email_dns_name' }
  const nameOwnerContext = { signature: 'jack@name-coach.com', email: 'jack@name-coach.com' }
  const userContext = { email: 'jon.snow@name-coach.com', signature: 'jon.snow@name-coach.com' }
  const client = loadClient(
    {
      accessKeyId: process.env.REACT_APP_GPDB_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_GPDB_SECRET_ACCESS_KEY
    },
    applicationContext,
    nameOwnerContext,
    userContext
  );

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

    <Widget client={client} name={name} width={500} style={style} termsAndConditions={termsAndConditions} />
  </>
}

export default App
