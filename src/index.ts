type Point = {
  x: number,
  y: number,
};

type GridParams = {
  x: { min: number, max: number },
  y: { min: number, max: number },
  step: number,
}

type Grid = {
  grid: (number | null)[][],
  max: number
}

export function mandelbrot(point: Point, iterations: number): [Point] {
  var set: [Point] = [point];
  for (var i: number = 1; i <= iterations; i++) {
    set[i] = {
      x: set[i - 1].x * set[i - 1].x - set[i - 1].y * set[i - 1].y + point.x,
      y: 2 * set[i - 1].x * set[i - 1].y + point.y
    }
  }
  return set;
}

export function isBound(point: Point, maxIterations: number): number | null {
  var last: Point = point;
  var current: Point | undefined;

  for (var i: number = 0; i < maxIterations; i++) {
    if (Math.abs(last.x) >= 2 || Math.abs(last.y) >= 2) {
      return i;
    }
    current = {
      x: last.x * last.x - last.y * last.y + point.x,
      y: 2 * last.x * last.y + point.y
    }
    last = current;
  }
  return null
}

export function genrateGrid(grid: GridParams, maxIterations: number): Grid {
  var result: Grid = {
    grid: [],
    max: 0,
  };

  var xSteps = (grid.x.max - grid.x.min) / grid.step;
  var ySteps = (grid.y.max - grid.y.min) / grid.step;

  for (var i = 0; i < xSteps; i++) {
    result.grid[i] = [];
    for (var j = 0; j < ySteps; j++) {
      result.grid[i][j] = isBound({
        x: (i * grid.step) + grid.x.min,
        y: (j * grid.step) + grid.y.min,
      }, maxIterations);
      if (result.grid[i][j] != null && result.grid[i][j] as number > result.max) {
        result.max = result.grid[i][j] as number;
      }
    }
  }

  return result;
}

export function createColors(grid: Grid) {
  for (var i = 0; i < grid.grid.length; i++) {
    for (var j = 0; j < grid.grid[i].length; j++) {
      if (grid.grid[i][j] == null){
        grid.grid[i][j] = 0;
        continue;
      }
      var offset = grid.grid[i][j] as number;
      grid.grid[i][j] = getColor(offset / grid.max);
    }
  }
}

export function getColor(x:number): number {
  return (Math.round(0xff * (1 - 2.5*(Math.pow(x, 1/3)-x))) << 16) // red
    + (Math.round(0xff * (1 - Math.pow(x,.25))) << 8) // green
    + Math.round(0xff * (1 - 1.8 * (x - Math.pow(x, 5)))); // blue
}
