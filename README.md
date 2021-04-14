# gpdb-components

>

[![NPM](https://img.shields.io/npm/v/gpdb-components.svg)](https://www.npmjs.com/package/gpdb-components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save gpdb-components
```

## Usage

```tsx
import React from 'react'

import { Widget, loadClient } from 'gpdb-components'

const Example = () => {
  const applicationContext = { instanceSig: 'name-coach.com', typeSig: 'email_dns_name' }
  const nameOwnerContext = { signature: 'jon.snow@name-coach.com' }
  const userContext = { signature: 'jon.snow@name-coach.com' }

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
```

## Develop

1. Run library in watch mode:
```bash
  yarn watch
```
2. Run [example](/example/src/App.tsx) app to use it in time:
```bash
  cd example && yarn start
```
## License

MIT © [NameCoach](https://github.com/NameCoach)
