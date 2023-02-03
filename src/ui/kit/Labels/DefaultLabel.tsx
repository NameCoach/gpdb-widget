import React from "react"

// this is a workaround hack to get <label/> component outside of JSX
export const DefaultLabel = (args) => {
  return <label {...args}/>
}
