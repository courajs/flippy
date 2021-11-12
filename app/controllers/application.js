import Controller from '@ember/controller';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';

class Cell {
  @tracked on = false;

  @action toggle() {
    this.on = !this.on;
  }
}

class Board {
  @tracked cells;
  rows;
  cols;


  constructor(width, height) {
    let len = width*height;
    this.cells = new Array(len);
    this.rows = new Array(height);
    this.cols = new Array(width);
    for (let i = 0; i<len; i++) {
      this.cells[i] = new Cell();
    }
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
}

export default class extends Controller {
  @tracked board = new Board(5, 5);
}
