import { orderBy } from "lodash";
import { NAMES_API_URL } from "../../constants";

const MAX_NAMES_COUNT = 10_000;
const MIN_NAME_LENGTH = 2;

export default class NamesApi {
  private url: any;
  private headers: HeadersInit;

  constructor(url = process.env.NAMES_API_URL || NAMES_API_URL) {
    this.url = url;
    this.headers = { "Content-Type": "application/json;charset=utf-8" };
  }

  searchNames(content: string, applicationSignature: string) {
    return fetch(`${this.url}/_search?filter_path=aggregations`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        size: 0,
        query: {
          match: {
            utf_8_transcription: {
              query: content,
              operator: "or",
            },
          },
        },
        aggs: {
          allNames: {
            filter: {
              bool: {
                must: [
                  {
                    terms: {
                      target_type_sig: [
                        "person_first_name",
                        "person_last_name",
                        "NULL",
                      ],
                    },
                  },
                  { terms: { org_sig: [applicationSignature, "NULL"] } },
                ],
              },
            },
            aggs: {
              names: {
                terms: {
                  field: "utf_8_transcription",
                  size: MAX_NAMES_COUNT,
                },
              },
            },
          },
          fullName: {
            filter: {
              bool: {
                must: [
                  { term: { target_type_sig: "person_full_name" } },
                  { terms: { org_sig: [applicationSignature, "NULL"] } },
                ],
              },
            },
            aggs: {
              names: {
                terms: {
                  field: "utf_8_transcription",
                },
              },
            },
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // TODO: move to controller
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
      ({ key }) => content.search(new RegExp(key, "i")),
    ]).map((n) => n.key);
  }
}
