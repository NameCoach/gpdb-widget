import React from "react"
import styles from "./styles.module.css"
import classNames from 'classnames/bind'

interface Props {
  inline?: boolean
}

const cx = classNames.bind(styles)

const Loader = (props: Props) => <div
  className={cx(styles.loader, { 'loader__inline': props.inline  })}
/>

export default Loader
