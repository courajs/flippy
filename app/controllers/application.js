import Controller from '@ember/controller';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

class Cell {
  @tracked on;

  constructor(on = false) {
    this.on = on;
  }

  @action toggle() {
    this.on = !this.on;
  }
}

class Board {
  @tracked cells;
  width;
  height;
  rows;
  cols;
  storage_slot;

  constructor({ width, height, cells }, storage_slot = null) {
    this.width = width;
    this.height = height;
    this.storage_slot = storage_slot;

    let len = width*height;
    this.cells = cells.map(on => new Cell(on));

    this.rows = new Array(height);
    this.cols = new Array(width);
    for (let i = 0; i<this.rows.length; i++) {
      this.rows[i] = new Array(width);
    }
    for (let i = 0; i<this.cols.length; i++) {
      this.cols[i] = new Array(height);
    }
    for (let row = 0; row<height; row++) {
      for (let col = 0; col<width; col++) {
        let cell = this.cells[row*width + col];
        this.cols[col][row] = cell;
        this.rows[row][col] = cell;
      }
    }
  }

  static blank(width, height) {
    let len = width*height;
    let cells = new Array(width*height).fill(false);
    return new Board({width, height, cells});
  }
  static random(width, height) {
    let len = width*height;
    let cells = new Array(len);
    for (let i=0; i<len; i++) {
      cells[i] = Math.random() > 0.5;
    }
    return new Board({width, height, cells});
  }

  static from_slot(slot) {
    if (slot.value) {
      return new Board(slot.value, slot);
    } else {
      let b = Board.blank(5, 5);
      slot.value = b.serialize();
      slot.save();
      return b;
    }
  }

  cell(x, y) {
    return this.cells[x + y*this.width];
  }

  @action
  toggle(x, y) {
    let cells = [[x,y], [x+1,y], [x-1,y], [x,y+1], [x,y-1]];
    cells = cells.filter(([x,y]) => {
      return x >= 0 && x < this.width && y >= 0 && y < this.height;
    });
    for (let [_x, _y] of cells) {
      this.cell(_x, _y)?.toggle();
    }
    if (this.storage_slot) {
      this.storage_slot.value = this.serialize();
      this.storage_slot.save();
    }
  }

  serialize() {
    return {
      width: this.width,
      height: this.height,
      cells: this.cells.map(c=>c.on),
    };
  }
}
function default_board_state() {
  return {
    height: 5,
    width: 5,
    cells: new Array(25).fill(false),
  };
}
function random_board_state() {
  const width = 5;
  const height = 5;
  const len =width*height;
  let cells = new Array(len);
  for (let i=0; i<len; i++) {
    cells[i] = Math.random() > 0.5;
  }
  return {
    width,
    height,
    cells,
  };
}

export default class extends Controller {
  @service localStorage;

  board_slot = this.localStorage.slot('board', default_board_state());

  constructor(...args) {
    super(...args);
  }

  get board() {
    return Board.from_slot(this.board_slot);
  }

  @action setNumber(n) {
    this.slot.value = n;
    this.slot.save();
  }
  @action dec() {
    this.slot.value--;
    this.slot.save();
  }
  @action inc() {
    this.slot.value++;
    this.slot.save();
  }

  @action randomize() {
    this.board_slot.value = random_board_state();
    this.board_slot.save();
  }
  @action blank() {
    this.board_slot.value = default_board_state();
    this.board_slot.save();
  }
}
