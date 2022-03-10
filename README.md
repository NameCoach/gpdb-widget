# gpdb-widget

Try it on [demo page](https://namecoach.github.io/gpdb-widget/)

[![NPM](https://img.shields.io/npm/v/gpdb-components.svg)](https://www.npmjs.com/package/gpdb-components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save gpdb-widget
```

## Usage
Read more about application, name owner and user contexts [here](https://namecoachgpdb.docs.apiary.io/#introduction/context-info)

```tsx
import React from 'react'

import { Widget, loadClient } from 'gpdb-widget'

const Example = () => {
  const applicationContext = { instanceSig: 'name-coach.com', typeSig: 'email_dns_name' }
  const nameOwnerContext = { signature: 'jon.snow@name-coach.com', email: 'jon.snow@name-coach.com'  }
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

## Development

1. Install dependencies:
   ```bash
      yarn install
   ```
1. Run library in watch mode:
```bash
  yarn watch
```
1. Run [example](/example/src/App.tsx) app to use it in time:
```bash
  cd example && yarn install && yarn start
```
## License

MIT © [NameCoach](https://github.com/NameCoach)
