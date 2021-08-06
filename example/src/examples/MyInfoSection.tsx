import React from 'react'
import { IFrontController, MyInfo } from 'gpdb-widget'
import { PermissionsManager } from "gpdb-api-client";

interface Props {
  client: IFrontController
  manager: PermissionsManager
}

const MyInfoSection = (props: Props) => {
  const me = { value: 'John Snow', owner: { signature: 'jack@nc-demo.com', email: 'jack@nc-demo.com' } }
  const names = [{ key: 'snow', ...me }, { key: "outlook", value: 'outlook test', owner: { signature: 'jack@nc-demo.com', email: 'jack@nc-demo.com' } }]

  return (<MyInfo client={props.client} name={me} names={names} manager={props.manager} />)
}

export default MyInfoSection;
