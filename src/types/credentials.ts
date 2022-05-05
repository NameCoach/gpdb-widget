import { Configuration } from "gpdb-api-client";

export interface TokenPair {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface BearerToken {
  jwt: string;
}

type Credentials = TokenPair | Configuration;

export default Credentials;
