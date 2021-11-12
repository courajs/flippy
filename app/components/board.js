import Component from '@glimmer/component';
import {action} from '@ember/object';

export default class extends Component {
  @action toggle(x, y) {
    if (this.interactive) {
      this.args.board.toggle(x, y);
    }
  }

  get interactive() {
    if ('interactive' in this.args) {
      return !!this.args.interactive;
    } else {
      return true;
    }
  }
}
