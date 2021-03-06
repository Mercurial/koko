let ipc = _require('ipc');

export = {
  on(eventName: string, handler: IJsonCallback) {
    ipc.on(eventName, function (arg: string) {
      handler(JSON.parse(arg));
    });
  },

  send(eventName: string, dataObj: any) {
    ipc.send(eventName, JSON.stringify(dataObj));
  },
};
