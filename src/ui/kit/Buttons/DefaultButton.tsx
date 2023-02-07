import React from "react"

// this is a workaround hack to get <button/> component outside of JSX
export const DefaultButton = React.forwardRef<HTMLButtonElement>((props, ref) => {
  return <button ref={ref} {...props}/>
})
