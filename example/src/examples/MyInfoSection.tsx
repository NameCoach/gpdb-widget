import React from 'react'
import { IFrontController, MyInfo } from 'gpdb-widget'

interface Props {
  client: IFrontController
}

const MyInfoSection = (props: Props) => {
  const me = { value: 'Jack Green', owner: { signature: 'jack@nc-demo.com', email: 'jack@nc-demo.com' } }
  const names = [{ key: 'jack', ...me }]

  return (<MyInfo client={props.client} name={me} names={names} />)
}

export default MyInfoSection;
