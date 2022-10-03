import { orderBy } from "lodash";
import { EXTENSION_BACKEND_API_URL } from "../../constants";

const MIN_NAME_LENGTH = 2;

export default class NamesApi {
  private url: string;
  private headers: HeadersInit;

  constructor(url = process.env.NAMES_API_URL || EXTENSION_BACKEND_API_URL) {
    this.url = url;
    this.headers = { "Content-Type": "application/json;charset=utf-8" };
  }

  searchNames(content: string, orgSig: string) {
    return fetch(`${this.url}/search/get?text=${content}&sig=${orgSig}`, {
      headers: { ...this.headers } as HeadersInit,
    })
      .then((response) => response.json())
      .then((data) => {
        const { aggregations } = data;
        const allNames = NamesApi.prepareResult(aggregations.allNames, content);
        const fullName = NamesApi.prepareResult(aggregations.fullName, content);

        return { allNames, fullName };
      });
  }

  static prepareResult(aggregations, content) {
    const {
      names: { buckets = [] },
    } = aggregations;

    const validBuckets = buckets.filter((b) => b.key.length >= MIN_NAME_LENGTH);

    return orderBy(validBuckets, [
      ({ key }) => {
        const match = key.match(/([\w'-]+)/gi);

        if (match !== null) content.search(new RegExp(match[0], "i"));
      },
    ]).map((n) => n.key);
  }
}
