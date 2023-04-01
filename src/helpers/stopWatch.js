export class StopWatch {
  startTime = 0;
  stopTime = 0;
  duration = 0;
  start = () => {
    this.startTime = new Date().getTime();
  };
  stop = () => {
    const stopTime = new Date().getTime();
    this.duration = stopTime - this.startTime;
    this.stopTime = stopTime;
  };
  getStopTimestamp = () => {
    return this.stopTime;
  };
  getDuration = (durationInterval) => {
    switch (durationInterval) {
      case "s":
        return +(this.duration / 1000).toFixed(2);
        break;
      case "m":
        return +(this.duration / 1000 / 60).toFixed(2);
        break;
      case "h":
        return +(this.duration / 1000 / 60 / 60).toFixed(2);
        break;
      default:
        return 0;
        break;
    }
  };
  durationToString = (durationInterval, message) => {
    return `${new Date().toISOString()} | ${`${message}`.padEnd(
      20
    )} Time: ${this.getDuration(durationInterval)}${durationInterval}`;
  };
}
