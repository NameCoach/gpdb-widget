import { JSXElementConstructor, ReactElement } from "react";

export type Child = ReactElement<
  any,
  string | JSXElementConstructor<any>
> | null;

type Children = Child[] | Child;

export default Children;
