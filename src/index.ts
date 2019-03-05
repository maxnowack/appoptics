import send, { Measurement, Tags, defaultEndpoint } from './send'
export { default as send, Measurement, Tags } from './send'

export interface Options {
  email?: string
  token: string
  endpoint?: string
  interval?: number
  tags?: Tags
}

export default class Appoptics {
  private options: Options
  private measurements: Measurement[] = []
  private intervalId: NodeJS.Timeout | null = null
  private started = false

  constructor({
    email,
    token,
    endpoint = defaultEndpoint,
    interval,
    tags,
  }: Options) {
    this.options = { email, token, endpoint, interval, tags }
  }

  public measure(measurement: Measurement) {
    if (!this.started) this.start()
    this.measurements.push({
      time: new Date(),
      ...measurement,
    })
  }

  public start() {
    this.stop()
    this.intervalId = setInterval(() => this.flush(), this.options.interval || 10000)
    this.started = true
  }
  public stop() {
    if (this.intervalId) clearInterval(this.intervalId)
    this.started = false
  }
  public async flush() {
    const measurements = this.measurements
    this.measurements = []
    if (measurements.length <= 0) return

    return send({
      measurements,
      tags: this.options.tags || {},
      ...(this.options.email ? { email: this.options.email } : {}),
      token: this.options.token,
      endpoint: this.options.endpoint,
    })
      .catch(err => {
        measurements.forEach(m => this.measurements.push(m))
        console.log('Appoptics', err)
      })
  }
}
