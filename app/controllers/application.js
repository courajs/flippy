import Controller from '@ember/controller';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';

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

  constructor({ width, height, cells }) {
    this.width = width;
    this.height = height;
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
  }

  serialize() {
    return {
      width: this.width,
      height: this.height,
      cells: this.cells.map(c=>c.on),
    };
  }
}

export default class extends Controller {
  @tracked board = Board.random(5, 5);

  @action randomize() {
    this.board = Board.random(5, 5);
  }
  @action blank() {
    this.board = Board.blank(5, 5);
  }
}
