import React, { useEffect, useState } from 'react'

import { Widget, loadClient } from 'gpdb-widget'
import { useDebouncedCallback } from 'use-debounce'
import MyInfoSection from './examples/MyInfoSection'
import { PermissionsManager } from "gpdb-api-client";

const style = {
  margin: '50px auto 0 auto',
};

const App = () => {
  const [name, setName] = useState('Jon Snow');
  const [manager, setManager] = useState<PermissionsManager>();

  const applicationContext = { instanceSig: 'name-coach.com', typeSig: 'email_dns_name' }
  const nameOwnerContext = { signature: 'jon.snow@name-coach.com', email: 'jon.snow@name-coach.com' }
  const userContext = { email: 'veronika.peknaia@jetruby.com', signature: 'veronika.peknaia@jetruby.com' }
  const client = loadClient(
    {
      accessKeyId: process.env.REACT_APP_GPDB_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_GPDB_SECRET_ACCESS_KEY
    },
    applicationContext,
    nameOwnerContext,
    userContext
  );
  const loadPermissions = async () => {
    const permissions = await client.loadPermissions();
    setManager(permissions);
  };

  useEffect(() => {

    loadPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounced = useDebouncedCallback(
    (value) => {
      if (value.trim().length === 0) return;
      setName(value);
    },
    600
  );

  return <div style={{ margin: "50px auto 0 auto", width: "500px" }}>
      Name:
      <input
        defaultValue={name}
        type="text"
        onChange={(e) => debounced(e.target.value)}
        required
        style={{ width: "80%", marginLeft: "20px" }}
      />

    <Widget client={client} name={name} style={style} />

      <hr className='divider'/>

    {manager && <MyInfoSection client={client} manager={manager} />}
    </div>
}

export default App
