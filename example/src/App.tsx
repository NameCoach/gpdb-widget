import React, { useEffect, useState } from 'react';

import { loadClient, Widget, SearchWidget, ExtensionWidget } from 'gpdb-widget';
import { useDebouncedCallback } from 'use-debounce';
import MyInfoSection from './examples/MyInfoSection';
import Parser from './parser';
import ScreenResizer from './dev-tools/ScreenResizer';
import Name, { NameTypes } from "../../src/types/resources/name";

const style = {
  margin: '50px auto 0 auto',
};

const creds = {
  accessKeyId: process.env.REACT_APP_GPDB_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_GPDB_SECRET_ACCESS_KEY
};
const applicationContext = { instanceSig: 'name-coach.com', typeSig: 'email_dns_name' }
const nameOwnerContext = { signature: 'jon.snow@name-coach.com', email: 'jon.snow@name-coach.com' }
const userContext = { email: 'jon.snow@name-coach.com', signature: 'jon.snow@name-coach.com' }
const parser = new Parser();

const extensionWidgetNames: { [t in NameTypes]: Name } =
  {
    firstName: {key: 'Cole', type: 'firstName' as NameTypes.FirstName, exist: true},
    fullName: {key: 'Cole Cassidy', type: 'fullName' as NameTypes.FullName, exist: true},
    lastName: {key: 'Cassidy', type: 'lastName' as NameTypes.LastName, exist: false},
  };


const App = () => {
  const [name, setName] = useState('Jon Snow');
  const [loading, setLoading] = useState(true);
  const client = loadClient(
    creds,
    applicationContext,
    nameOwnerContext,
    userContext,
    parser
  );

  useEffect(() => {
    const load = async () => {
      await client.loadPermissions({ user_sig: userContext.email })

      setLoading(false);
    }

    load();
  }, [client]);

  const debounced = useDebouncedCallback(
    (value) => {
      if (value.trim().length === 0) return;
      setName(value);
    },
    600
  );

  return <div style={{ margin: "50px auto 0 auto", width: "500px" }}>
    <ScreenResizer />
    <div>
      Name:
      <input
        defaultValue={name}
        type="text"
        onChange={(e) => debounced(e.target.value)}
        required
        style={{ width: "80%", marginLeft: "20px" }}
      />
    </div>

    <Widget client={client} name={name} style={style} />

      <hr className='divider'/>

    {!loading && <ExtensionWidget names={extensionWidgetNames} client={client} style={style} />}

      <hr className='divider'/>

    {!loading && <MyInfoSection client={client} />}

      <hr className='divider'/>

    <SearchWidget client={client} />
    </div>
}

export default App
