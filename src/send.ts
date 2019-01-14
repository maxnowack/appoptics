import fetch from 'node-fetch'

export const defaultEndpoint = 'https://api.appoptics.com/v1/measurements'

export interface Tag {
  [key: string]: string
}
export interface Measurement {
  name: string
  value: number
  time?: Date
  tags?: Tag[]
  period?: number
  count?: number
  sum?: number
  max?: number
  min?: number
  last?: number
  stddev?: number
  stddev_m2?: number
}
export interface Options {
  measurements: Measurement[]
  tags?: Tag[]
  token: string
  endpoint: string
}

export default ({
  measurements = [],
  tags = [],
  token,
  endpoint = defaultEndpoint,
}: Options) => fetch(endpoint, {
  method: 'POST',
  headers: {
    body: JSON.stringify({
      ...tags,
      measurements,
    }),
    Authorization: 'Basic ' + new Buffer(`${token}:`).toString('base64'),
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'appoptics-node',
  },
}).then(r => r.json())
