import React from 'react'
import { IFrontController, MyInfo } from 'gpdb-widget'
import { PermissionsManager } from "gpdb-api-client";

interface Props {
  client: IFrontController
  manager: PermissionsManager
}

const MyInfoSection = (props: Props) => {
  const me = { value: 'Veronika Peknaia', owner: { signature: 'veronika.peknaia@jetruby.com', email: 'veronika.peknaia@jetruby.com' } }
  const names = [
    { key: 'jack', value: 'Jack Green', owner: { signature: 'jack@nc-demo.com', email: 'jack@nc-demo.com'}},
    { key: 'alla', value: 'Alla Stone', owner: { signature: 'test@yopmail.com', email: 'test@yopmail.com'}},
    {key: 'ver', ...me}]

  return (<MyInfo client={props.client} name={me} names={names} manager={props.manager} />)
}

export default MyInfoSection;
