import React from 'react'
import { IFrontController, PronunciationMyInfoWidget } from 'gpdb-widget'

interface Props {
  client: IFrontController
}

const MyInfoSection = (props: Props) => {
  const me = { value: 'Jack Green', owner: { signature: 'jack@name-coach.com', email: 'jack@name-coach.com' } }
  const names = [{ key: 'snow', ...me }, { key: "widget", value: 'widget test', owner: { signature: 'jon.snow@name-coach.com', email: 'jon.snow@name-coach.com'} }]

  return (<PronunciationMyInfoWidget client={props.client} name={me} names={names}/>)
}

export default MyInfoSection;
