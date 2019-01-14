import fetch from 'node-fetch'

export const defaultEndpoint = 'https://api.appoptics.com/v1/measurements'

export interface Tags {
  [key: string]: string
}
export interface Measurement {
  name: string
  value: number
  time?: Date
  tags?: Tags
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
  tags: Tags
  token: string
  endpoint?: string
}

export default ({
  measurements = [],
  tags,
  token,
  endpoint = defaultEndpoint,
}: Options) => fetch(endpoint, {
  method: 'POST',
  body: JSON.stringify({
    ...(Object.keys(tags).length ? { tags } : {}),
    measurements,
  }),
  headers: {
    Authorization: 'Basic ' + Buffer.from(`${token}:`).toString('base64'),
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'appoptics-node',
  },
}).then(r => {
  console.log(JSON.stringify({
    ...(tags.length ? { tags } : {}),
    measurements,
  }))
  return r.json()
})
