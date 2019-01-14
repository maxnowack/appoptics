import send, { Measurement, defaultEndpoint } from './send'
export { default as send, Measurement } from './send'

export interface Options {
  email?: string
  token: string
  endpoint: string
  interval: number
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
    interval = 10000,
  }: Options) {
    this.options = { email, token, endpoint, interval }
  }

  public measure(measurement: Measurement) {
    if (!this.started) this.start()
    this.measurements.push({
      time: new Date(),
      ...measurement,
    })
  }

  public start() {
    this.intervalId = setInterval(() => this.flush(), this.options.interval)
    this.started = true
  }
  public stop() {
    if (this.intervalId) clearInterval(this.intervalId)
    this.started = false
  }
  public flush() {
    const measurements = this.measurements
    if (measurements.length <= 0) return
    this.measurements = []
    return send({
      measurements,
      ...(this.options.email ? { email: this.options.email } : {}),
      token: this.options.token,
      endpoint: this.options.endpoint,
    })
  }
}
