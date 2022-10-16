export async function errorCaptured(asyncFunc) {
  try {
    let res = await asyncFunc();
    return [null, res];
  } catch (err) {
    return [err, null];
  }
}

export function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child);
    const foundChilds = findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}

export class eventEmitter {
  constructor() {
    this.subs = {};
  }

  on(event, cb) {
    (this.subs[event] || (this.subs[event] = [])).push(cb);
  }

  trigger(event, ...args) {
    this.subs[event] &&
      this.subs[event].forEach(cb => {
        cb(...args);
      });
  }

  once(event, onceCb) {
    const cb = (...args) => {
      onceCb(...args);
      this.off(event, cb);
    };
    this.on(event, cb);
  }

  off(event, offCb) {
    if (event) {
      if (offCb) {
        let index = this.subs[event].findIndex(cb => cb === offCb);
        this.subs[event].splice(index, 1);
        if (!this.subs[event].length) Reflect.deleteProperty(this.subs, event);
      } else {
        Reflect.deleteProperty(this.subs, event);
      }
    } else {
      this.subs = {};
    }
  }
}
