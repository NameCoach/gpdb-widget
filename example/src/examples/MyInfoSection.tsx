import React from 'react'
import { addOnDeviceChangeHandler, IFrontController, PronunciationMyInfoWidget } from 'gpdb-widget'

interface Props {
  client: IFrontController
}

export const me = {
  value: 'Jack Green',
  owner: {
    signature: 'jack@name-coach.com',
    signatureType: 'email',
    email: 'jack@name-coach.com'
  }
};

const MyInfoSection = (props: Props) => {
  addOnDeviceChangeHandler();

  const email = {
    value: 'sometest.email@gmail.com',
    owner: {
      signature: 'sometest.email@gmail.com',
      email: 'sometest.email@gmail.com'
    }
  };
  const emailWithoutDot = {
    value: 'sometestemailwithoutadot@gmail.com',
    owner: {
      signature: 'sometestemailwithoutadot@gmail.com',
      email: 'sometestemailwithoutadot@gmail.com'
    }
  };
  const longEmailWithComplexDomain = {
    value: 'somelongemailwithcomplexdomain@custom-domain.omniemail.com',
    owner: {
      signature: 'somelongemailwithcomplexdomain@custom-domain.omniemail.com',
      email: 'somelongemailwithcomplexdomain@custom-domain.omniemail.com'
    }
  };
  const testName1 = {
    value: 'Jason Robertson',
    owner: {
      signature: 'jasonrobertson@gmail.com',
      email: 'jasonrobertson@gmail.com'
    }
  }
  const testName2 = {
    value: 'Robert John Downey Jr.',
    owner: {
      signature: 'robertdowney@gmail.com',
      email: 'robertdowney@gmail.com'
    }
  }
  const widgetTest = {
    value: 'widget test',
    owner: {
      signature: 'jon.snow@name-coach.com',
      email: 'jon.snow@name-coach.com'
    }
  }
  const names = [
    { key: 'snow', ...me },
    { key: 'key0', ...email },
    { key: 'key1', ...emailWithoutDot },
    { key: 'key2', ...longEmailWithComplexDomain },
    { key: 'key3', ...testName1 },
    { key: 'key4', ...testName2 },
    { key: "widget",  ...widgetTest },
  ]

  return (<PronunciationMyInfoWidget client={props.client} name={me} names={names}/>)
}

export default MyInfoSection;
