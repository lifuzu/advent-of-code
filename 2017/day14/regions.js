/*
  --- Day 14: Disk Defragmentation ---

  Suddenly, a scheduled job activates the system's disk defragmenter. Were the situation different, you might sit and watch it for a while, but today, you just don't have that kind of time. It's soaking up valuable system resources that are needed elsewhere, and so the only option is to help it finish its task as soon as possible.

  The disk in question consists of a 128x128 grid; each square of the grid is either free or used. On this disk, the state of the grid is tracked by the bits in a sequence of knot hashes.

  A total of 128 knot hashes are calculated, each corresponding to a single row in the grid; each hash contains 128 bits which correspond to individual grid squares. Each bit of a hash indicates whether that square is free (0) or used (1).

  The hash inputs are a key string (your puzzle input), a dash, and a number from 0 to 127 corresponding to the row. For example, if your key string were flqrgnkx, then the first row would be given by the bits of the knot hash of flqrgnkx-0, the second row from the bits of the knot hash of flqrgnkx-1, and so on until the last row, flqrgnkx-127.

  The output of a knot hash is traditionally represented by 32 hexadecimal digits; each of these digits correspond to 4 bits, for a total of 4 * 32 = 128 bits. To convert to bits, turn each hexadecimal digit to its equivalent binary value, high-bit first: 0 becomes 0000, 1 becomes 0001, e becomes 1110, f becomes 1111, and so on; a hash that begins with a0c2017... in hexadecimal would begin with 10100000110000100000000101110000... in binary.

  Continuing this process, the first 8 rows and columns for key flqrgnkx appear as follows, using # to denote used squares, and . to denote free ones:

  ##.#.#..-->
  .#.#.#.#
  ....#.#.
  #.#.##.#
  .##.#...
  ##..#..#
  .#...#..
  ##.#.##.-->
  |      |
  V      V
  In this example, 8108 squares are used across the entire 128x128 grid.

  Given your actual key string, how many squares are used?

  Your puzzle answer was 8194.

  --- Part Two ---

  Now, all the defragmenter needs to know is the number of regions. A region is a group of used squares that are all adjacent, not including diagonals. Every used square is in exactly one region: lone used squares form their own isolated regions, while several adjacent squares all count as a single region.

  In the example above, the following nine regions are visible, each marked with a distinct digit:

  11.2.3..-->
  .1.2.3.4
  ....5.6.
  7.8.55.9
  .88.5...
  88..5..8
  .8...8..
  88.8.88.-->
  |      |
  V      V
  Of particular interest is the region marked 8; while it does not appear contiguous in this small view, all of the squares marked 8 are connected when considering the whole 128x128 grid. In total, in this example, 1242 regions are present.

  How many regions are present given your key string?

 */
const assert = require('assert')

const { KnotHash } = require('../day10/knot_hash')

class DiskDefragmentation {
  constructor() {}
  squares_used(input) {
    // create 128 key string for each line, like `flqrgnkx-0`, `flqrgnkx-1`, ... `flqrgnkx-127`
    // create each hash string for key string
    // transform to hexadecimal
    // count 1 in the hexadecimal
    const knot = new KnotHash()

    let sum_used = 0
    for (let i = 0; i < 128; ++i) {
      const hash_string = knot.hash_string(256, input + '-' + i)
      for (let j = 0; j < 32; ++j) {
        sum_used += this.count_1(hash_string[j])
      }
    }

    return sum_used
  }

  // count 1 in `char`
  count_1(char) {
    let c = parseInt(char, 16)
    let count = 0
    while (c) {
      if ( c & 0x1) {
        count++
      }
      c >>= 1
    }
    return count
  }

  // transform `char` to binary
  to_bin(char) {
    const str = '0000' + parseInt(char, 16).toString(2)
    return str.substr(str.length - 4)
  }

  adjacent_region(input) {
    // create 128 key string for each line, like `flqrgnkx-0`, `flqrgnkx-1`, ... `flqrgnkx-127`
    // create each hash string for key string
    // transform to hexadecimal
    // depth/breadth first search regions
    const knot = new KnotHash()

    const strings = []
    for (let i = 0; i < 128; ++i) {
      const hash_string = knot.hash_string(256, input + '-' + i)
      let str = ''
      for (let j = 0; j < 32; ++j) {
        str = str + this.to_bin(hash_string[j])
      }
      strings[i] = str
    }

    return this.dfs(strings)
  }

  dfs(strings) {
    // prepare visited, since js array - strings can't be changed
    const visited = []
    for (let l = 0; l < 128; ++l) {
      visited.push(Array(128).fill(0))
    }

    const direction = [ [-1, 0], [0, -1], [1, 0], [0, 1] ]

    const stack = []
    let sum_region = 0

    for (let i = 0; i < 128; ++i) {
      for (let j = 0; j < 128; ++j) {
        if (strings[i][j] === '1' && visited[i][j] !== 1) {
          sum_region++
          // set it visited
          visited[i][j] = 1
          stack.push([i, j])

          while(stack.length > 0) {
            const [i, j] = stack.pop()

            // traversal 4 directions
            for (let d = 0; d < direction.length; ++d) {
              const [x, y] = [i + direction[d][0], j + direction[d][1]]
              if (x >= 0 && x < 128 && y >= 0 && y < 128
                && strings[x][y] === '1'
                && visited[x][y] !==1 ){
                stack.push([x, y])
                visited[x][y] = 1
              }
            }
          }
        }
      }
    }

    return sum_region
  }
}

module.exports = {
  DiskDefragmentation
}

if (require.main === module) {
  const disk = new DiskDefragmentation()

  let input = `flqrgnkx`
  let output = disk.squares_used(input)
  console.log(output)
  assert.equal(output, 8108)

  output = disk.adjacent_region(input)
  console.log(output)
  assert.equal(output, 1242)

  console.log('======')
  input = `uugsqrei`
  output = disk.squares_used(input)
  console.log(output)
  assert.equal(output, 8194)

  output = disk.adjacent_region(input)
  console.log(output)
  assert.equal(output, 1141)
}