type Mapper<T> = (raw: { [x: string]: any }, user?: any, owner?: any) => T;
