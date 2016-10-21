class DeviceRepository {
  constructor() {
    this.devices = new Map();
  }

  getDevice(name) {
    return this.devices.get(name);
  }

  get allDevices() {
    return this.devices.keys();
  }
}


var repository = new DeviceRepository();


class Device {
  constructor(model, id, instruments=[]) {
    this.model = model;
    this.id = id;
    this.instruments = new Map();
    for (let instrument of instruments) {
      this.addInstrument(...instrument);
    }
    repository.devices.set(this.path, this);
  }

  addInstrument(...data) {
    let instance = new Instrument(this, ...data);
    this.instruments.set(instance.name, instance);
  }

  get allSignals() {
    let all = [];
    for (let instrument of this.instruments.values()) {
      for (let signal of instrument.signals.values()) {
        all.push(`${instrument.name}.${signal.name}`);
      }
    }
    return all;
  }

  getSignal(path) {
    let [instrument, signal] = path.split('.');
    return this.instruments.get(instrument).signals.get(signal);
  }

  get path() {
    return `${this.model}.${this.id}`;
  }
}

class Instrument {
  constructor(device, name, signals=[]) {
    this.device = device;
    this.name = name;
    this.signals = new Map();
    for (let signal of signals) {
      this.addSignal(...signal);
    }
  }

  addSignal(...data) {
    let signal = new Signal(this, ...data);
    this.signals.set(signal.name, signal);
  }

  get path() {
    return `${this.device.path}.${this.name}`;
  }
}

class Signal {
  constructor(instrument, name, type) {
    this.instrument = instrument;
    this.name = name;
    this.type = type;
  }

  get path() {
    return `${this.instrument.path}.${this.name}`;
  }
}

module.exports = {
  Device,
  Instrument,
  Signal,
  repository
}
