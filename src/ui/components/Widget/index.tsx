import React, { createContext, MouseEventHandler, useEffect, useState } from 'react'
import IFrontController from '../../../types/front-controller'
import Container  from '../Container'
import Name, { NameTypes } from '../../../types/resources/name'
import styles from './styles.module.css'
import classNames from 'classnames/bind'
import Close from '../Close'
import Loader from '../Loader'

export interface ElemStyleProps {
  width?: number | string,
  height?: number | string,
  className?: string,
  style?: object
}

interface MainProperties {
  name: string,
  client: IFrontController,
  closable?: boolean,
  onClose?: MouseEventHandler,
}

type Props = MainProperties & ElemStyleProps

const cx = classNames.bind(styles);

const Widget = (props: Props) => {
  const ControllerContext = createContext<IFrontController>(null);
  const [names, setNames] = useState<{[t in NameTypes]: Name}>();
  const [loading, setLoading] = useState<boolean>(true)

  if (!Boolean(props.name.trim())) throw new Error("Name shouldn't be blank")

  useEffect(() => {
    const verifyNames = async () => {
      setLoading(true)
      setNames(await props.client.verifyNames(props.name))
      setLoading(false)
    }

    verifyNames()
  }, [props.name])

  return <ControllerContext.Provider value={props.client}>
    <div
      className={cx(styles.widget, props.className)}
      style={{ ...props.style, maxWidth: props.width, height: props.height }}>

      {props.closable && <Close onClick={props.onClose}/>}

      {
        loading
        ? <Loader inline/>
        : <Container
            firstName={names.firstName}
            lastName={names.lastName}
            fullName={names.fullName}
          />
      }
    </div>
  </ControllerContext.Provider>
}

export default Widget
