import Service from '@ember/service';
import {tracked} from '@glimmer/tracking';

class Proxyish {
  key;
  @tracked value;

  constructor(key, value) {
    this.key = key;
    this.value = value;

    window.addEventListener('storage', (e) => {
      if (
        e.storageArea === localStorage
        && e.key === this.key
      ) {
        if (e.newValue) {
          this.value = JSON.parse(e.newValue);
        } else {
          this.value = null;
        }
      }
    });
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.value));
  }
  clear() {
    localStorage.removeItem(this.key);
  }
}

export default class extends Service {
  slot(key) {
    let val = localStorage.getItem(key);
    if (val) {
      return new Proxyish(key, JSON.parse(val));
    } else {
      return new Proxyish(key);
    }
  }
}

