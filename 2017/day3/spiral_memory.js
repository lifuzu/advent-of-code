/*
  --- Day 3: Spiral Memory ---

  You come across an experimental new kind of memory stored on an infinite two-dimensional grid.

  Each square on the grid is allocated in a spiral pattern starting at a location marked 1 and then counting up while spiraling outward. For example, the first few squares are allocated like this:

  17  16  15  14  13
  18   5   4   3  12
  19   6   1   2  11
  20   7   8   9  10
  21  22  23---> ...

  While this is very space-efficient (no squares are skipped), requested data must be carried back to square 1 (the location of the only access port for this memory system) by programs that can only move up, down, left, or right. They always take the shortest path: the Manhattan Distance between the location of the data and square 1.

  For example:

  Data from square 1 is carried 0 steps, since it's at the access port.
  Data from square 12 is carried 3 steps, such as: down, left, left.
  Data from square 23 is carried only 2 steps: up twice.
  Data from square 1024 must be carried 31 steps.
  How many steps are required to carry the data from the square identified in your puzzle input all the way to the access port?

  Your puzzle answer was 371.

  --- Part Two ---

  As a stress test on the system, the programs here clear the grid and then store the value 1 in square 1. Then, in the same allocation order as shown above, they store the sum of the values in all adjacent squares, including diagonals.

  So, the first few squares' values are chosen as follows:

  Square 1 starts with the value 1.
  Square 2 has only one adjacent filled square (with value 1), so it also stores 1.
  Square 3 has both of the above squares as neighbors and stores the sum of their values, 2.
  Square 4 has all three of the aforementioned squares as neighbors and stores the sum of their values, 4.
  Square 5 only has the first and fourth squares as neighbors, so it gets the value 5.
  Once a square is written, its value does not change. Therefore, the first few squares would receive the following values:

  147  142  133  122   59
  304    5    4    2   57
  330   10    1    1   54
  351   11   23   25   26
  362  747  806--->   ...

  What is the first value written that is larger than your puzzle input?
 */

class SpiralMemory {
  constructor() {}
  count_to_1(n) {
    // 1. get i which (i-1)^2 < n < i^2
    //
    // 2. create assistant matrix for steps with i * i 2 dimensions
    // likes: [
    //          [1, 2],
    //          [0, 1]
    //        ]
    // recursively;
    //
    // 3. get the dimensions for the n (i^2 - (i-1)^2), i.e.
    // (i-1)^2 + 1, .... (i^2)
    // [0, 0], [1, 0], .... [i-1, 0], [i-1, 1], ..., [i-1, i-1] - for odd i
    // [i-1, i], [i-2, i], ..., [0, i], [0, i-1], ..., [0, 0]   - for even i
    // (2*i-1) numbers

    // Step 1.
    const i = Math.ceil(Math.sqrt(n))
    // console.log(i)

    // Step 2.
    const step_matrix = this.create_assistant_matrix(i)
    // console.log('step_matrix=', step_matrix)

    // Step 3.
    let x, y
    // if i is odd
    if ( i % 2 ) {
      x = 0, y = 0
      for (let j = Math.pow(i-1, 2)+1; j < n; ++j) {
        if (x < i-1) x++
        else y++
      }
    }
    // else - i is even
    else {
      x = i - 1, y = i - 1
      for (let j = Math.pow(i-1, 2)+1; j < n; ++j) {
        if (x > 0) x--
        else y--
      }
    }
    // console.log('x=', x, 'y=', y)
    return step_matrix[x][y]
  }
  create_assistant_matrix(i) {
    if (i === 1) return [[0]]
    else if (i === 2) return [[1, 2], [0, 1]]
    else if (i === 3) return [[2, 1, 2], [1, 0, 1], [2, 1, 2]]
    else {
      const arr = this.create_assistant_matrix(i-1).slice()
      // console.log('arr=', arr)
      // console.log('i=', i)
      if (i % 2) {
        // 1. Add a new column at #0, which length should be i-1
        for (let k = 0; k < i-1; ++k) {
          arr[k].unshift(arr[k][0] + 1)
        }
        // console.log('i is odd, add a new col, arr=', arr)
        // 2. Add a new row at #i-1
        const arr_line = []
        for (let k = 0; k < i; ++k) {
          // console.log(i-1, k)
          arr_line[k] = arr[i-2][k] + 1
        }
        arr.push(arr_line)
        // console.log('i is odd, add a new row, arr=', arr)
      } else {
        // 1. Add a new line #0, which length should be i-1
        const arr_line = []
        for (let k = 0; k < i-1; ++k) {
          arr_line[k] = arr[0][k] + 1
        }
        // arr_line[length_line] = arr_line[length_line - 1] + 1
        arr.unshift(arr_line)
        // console.log('i is even, add a new row, arr=', arr)
        // 2. Add a new column #i-1
        for (let k = 0; k < i; ++k) {
          arr[k][i-1] = arr[k][i-2] + 1
        }
        // console.log('i is even, add a new col, arr=', arr)
      }
      return arr
    }
  }

  first_larger(n) {
    // 1. create sum matrix, until the value bigger than n

    const larger_arr = this.create_sum_array_incrementally(n)
    // console.log('first_larger=', first_larger)
    let i = 0
    for (let k = 0; k < larger_arr.length; ++k) {
      if (n < larger_arr[k]) {
        i = k
        break
      }
    }
    return larger_arr[i]
  }

  create_sum_array_incrementally(n) {

    let i = 1
    while(true) {
      // console.log('i=', i)
      const arr = this.create_sum_matrix(i)
      const res_arr = []

      if (i % 2) {
        // if i is odd, right bottom is largest one
        if (arr[i-1][i-1] > n) {
          // if the largest one is bigger than goal, return the new created arr
          // in order to pick the first larger one
          for(let k = 0; k < i; ++k) {
            res_arr.push(arr[k][0])
          }
          for (let k = 1; k < i; ++k) {
            res_arr.push(arr[i-1][k])
          }
          return res_arr
        }
      } else {
        // if i is even, left top is largest one
        if (arr[0][0] > n) {
          for(let k = i-1; k >= 0; --k) {
            res_arr.push(arr[k][i-1])
          }
          for (let k = i-2; k >= 0; --k) {
            res_arr.push(arr[0][k])
          }
          return res_arr
        }
      }

      // otherwise, try a bigger one
      i++
    }
  }

  create_sum_matrix(i) {
    // 1. create sum matrix, until the value bigger than n
    if (i === 1) return [[1]]
    else if (i === 2) return [[4, 2], [1, 1]]
    else if (i === 3) return [[5, 4, 2], [10, 1, 1], [11, 23, 25]]
    else {
      const arr = this.create_sum_matrix(i-1).slice()
      // console.log('arr=', arr)
      let tmp = 0
      // console.log('i=', i)
      if (i % 2) {
        // 1. Add a new column at #0, which length should be i-1
        arr[0].unshift(arr[0][0] + arr[1][0])
        for (let k = 1; k < i-1; ++k) {
          if (k+1<i-1) {
            // console.log('k=', k, 'i=', i)
            // console.log('arr[k-1][0]', arr[k-1][0])
            // console.log('arr[k-1][1]', arr[k-1][1])
            // console.log('arr[k][1]', arr[k][1])
            // console.log('arr[k+1][1]', arr[k+1][1])
            // console.log('arr[k-1][0] + arr[k-1][1] + arr[k][1] + arr[k+1][1] =', arr[k-1][0] + arr[k-1][1] + arr[k][1] + arr[k+1][1])
            tmp = arr[k-1][0] + arr[k-1][1] + arr[k][0] + arr[k+1][0]
            arr[k].unshift(tmp)
          } else {
            tmp = arr[k-1][0] + arr[k-1][1] + arr[k][0]
            arr[k].unshift(tmp)
          }
        }
        // console.log('i is odd, add a new col, arr=', arr)
        // 2. Add a new row at #i-1
        const arr_line = []
        arr_line[0] = arr[i-2][0] + arr[i-2][1]
        for (let k = 1; k < i; ++k) {
          // console.log(i-1, k)
          if (k+1<i) {
            arr_line[k] = arr[i-2][k] + arr[i-2][k-1] + arr[i-2][k+1] + arr_line[k-1]
          } else {
            arr_line[k] = arr[i-2][k] + arr[i-2][k-1] + arr_line[k-1]
          }
        }
        arr.push(arr_line)
        // console.log('i is odd, add a new row, arr=', arr)
      } else {
        // 1. Add a new column #i-1
        arr[i-2][i-1] = arr[i-2][i-2] + arr[i-3][i-2]
        for (let k = i-3; k >= 0; --k) {
          // console.log('k=', k, 'i=', i)
          if (k-1>=0) {
            arr[k][i-1] = arr[k][i-2] + arr[k+1][i-2] + arr[k+1][i-1] + arr[k-1][i-2]
          } else {
            arr[k][i-1] = arr[k][i-2] + arr[k+1][i-2] + arr[k+1][i-1]
          }
        }
        // console.log('i is even, add a new col, arr=', arr)

        // 2. Add a new line #0, which length should be i-1
        const arr_line = []
        arr_line[i-1] = arr[0][i-1] + arr[0][i-2]
        for (let k = i-2; k >= 0; --k) {
          if (k-1>=0) {
            arr_line[k] = arr[0][k] + arr[0][k+1] + arr_line[k+1] + arr[0][k-1]
          } else {
            arr_line[k] = arr[0][k] + arr[0][k+1] + arr_line[k+1]
          }
        }
        // arr_line[length_line] = arr_line[length_line - 1] + 1
        arr.unshift(arr_line)
        // console.log('i is even, add a new row, arr=', arr)
      }
      return arr
    }
  }
}

module.exports = {
  SpiralMemory
}

const assert = require('assert')

if (require.main === module) {
  distance = new SpiralMemory()

  let d = distance.count_to_1(1)
  // console.log('d=', d)
  // assert.equal(d, 0)

  d = distance.count_to_1(12)
  // console.log('d=', d)
  assert.equal(d, 3)

  d = distance.count_to_1(23)
  // console.log('d=', d)
  assert.equal(d, 2)

  d = distance.count_to_1(1024)
  // console.log('d=', d)
  assert.equal(d, 31)

  d = distance.count_to_1(368078)
  // console.log(d)
  assert.equal(d, 371)
  //
  //
  d = distance.first_larger(747)
  // console.log(d)
  assert.equal(d, 806)

  d = distance.first_larger(368078)
  // console.log(d)
  assert.equal(d, 369601)
}