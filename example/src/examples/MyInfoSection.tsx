import React from 'react'
import { IFrontController, MyInfo } from 'gpdb-widget'

interface Props {
  client: IFrontController
}

const MyInfoSection = (props: Props) => {
  const me = { value: 'Jack Green', owner: { signature: 'jack@name-coach.com', email: 'jack@name-coach.com' } }
  const names = [{ key: 'snow', ...me }, { key: "widget", value: 'widget test', owner: { signature: 'jon.snow@name-coach.com', email: 'jon.snow@name-coach.com'} }]

  return (<MyInfo client={props.client} name={me} names={names}/>)
}

export default MyInfoSection;
