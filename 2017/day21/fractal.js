/*
  --- Day 21: Fractal Art ---
  You find a program trying to generate some art. It uses a strange process that involves repeatedly enhancing the detail of an image through a set of rules.

  The image consists of a two-dimensional square grid of pixels that are either on (#) or off (.). The program always begins with this pattern:

  .#.
  ..#
  ###
  Because the pattern is both 3 pixels wide and 3 pixels tall, it is said to have a size of 3.

  Then, the program repeats the following process:

  If the size is evenly divisible by 2, break the pixels up into 2x2 squares, and convert each 2x2 square into a 3x3 square by following the corresponding enhancement rule.
  Otherwise, the size is evenly divisible by 3; break the pixels up into 3x3 squares, and convert each 3x3 square into a 4x4 square by following the corresponding enhancement rule.
  Because each square of pixels is replaced by a larger one, the image gains pixels and so its size increases.

  The artist's book of enhancement rules is nearby (your puzzle input); however, it seems to be missing rules. The artist explains that sometimes, one must rotate or flip the input pattern to find a match. (Never rotate or flip the output pattern, though.) Each pattern is written concisely: rows are listed as single units, ordered top-down, and separated by slashes. For example, the following rules correspond to the adjacent patterns:

  ../.#  =  ..
            .#

                  .#.
  .#./..#/###  =  ..#
                  ###

                          #..#
  #..#/..../#..#/.##.  =  ....
                          #..#
                          .##.
  When searching for a rule to use, rotate and flip the pattern as necessary. For example, all of the following patterns match the same rule:

  .#.   .#.   #..   ###
  ..#   #..   #.#   ..#
  ###   ###   ##.   .#.
  Suppose the book contained the following two rules:

  ../.# => ##./#../...
  .#./..#/### => #..#/..../..../#..#
  As before, the program begins with this pattern:

  .#.
  ..#
  ###
  The size of the grid (3) is not divisible by 2, but it is divisible by 3. It divides evenly into a single square; the square matches the second rule, which produces:

  #..#
  ....
  ....
  #..#
  The size of this enhanced grid (4) is evenly divisible by 2, so that rule is used. It divides evenly into four squares:

  #.|.#
  ..|..
  --+--
  ..|..
  #.|.#
  Each of these squares matches the same rule (../.# => ##./#../...), three of which require some flipping and rotation to line up with the rule. The output for the rule is the same in all four cases:

  ##.|##.
  #..|#..
  ...|...
  ---+---
  ##.|##.
  #..|#..
  ...|...
  Finally, the squares are joined into a new grid:

  ##.##.
  #..#..
  ......
  ##.##.
  #..#..
  ......
  Thus, after 2 iterations, the grid contains 12 pixels that are on.

  How many pixels stay on after 5 iterations?

  Your puzzle answer was 164.

  --- Part Two ---
  How many pixels stay on after 18 iterations?

 */
const assert = require('assert')

class FractalArt {
  constructor(input_initial, input_patterns) {
    // parse initial input to a string
    // parse patterns to a hash
    this.initial = input_initial.replace(/\n/g, '/')
    let ininial_patterns = input_patterns.split(/\n/).map( line => line.split(/ => /))

    // create more hash_patterns with rotate and flip
    this.hash_patterns = this.enhance(ininial_patterns)
  }
  draw(times) {
    let image = this.initial
    let images = image.split(/\//)

    for (let n = 0; n < times; ++n) {
      // console.log(image)
      let images_divided = this.divide(images), images_matched = []

      for (let i = 0; i < images_divided.length; ++i) {
        // if match
        images_matched[i] = this.match(images_divided[i], this.hash_patterns, images_divided[i].length)
      }
      // merge images to image
      images = this.merge(images_matched)
    }

    // calc # number, then return
    return this.count_sign(images, '#')
  }
  count_sign(arr, sign) {
    const re = new RegExp(sign, 'g')
    return arr.reduce( (acc, curr) => acc + ( curr.match(re) ? curr.match(re).length : 0 ), 0)
  }
  match(image, patterns, length) {
    for (let pattern of patterns) {
      if ( image === pattern[0]) return pattern[1]
    }
    // should not be here!
    console.error('DON"T found')
    return null
  }
  merge(array) {
    let str_arr = []
    // array.length should be 1, 4, 9, 16, sqrt it
    const pieces = Math.sqrt(array.length)
    for (let i = 0; i < array.length; i += pieces) {
      for (let j = 0; j < array[i].match(/\//g).length + 1; ++j) {
        let str_tmp = ''
        for (let k = 0; k < pieces; ++k) {
          str_tmp += array[i + k].split(/\//)[j]
        }
        str_arr.push(str_tmp)
      }
    }
    return str_arr
  }
  split(string, size) {
    let re = new RegExp('.{1,' + size + '}', 'g')
    return string.match(re)
  }
  rotate(string) {
    const strs = []
    let str_arr = string.split(/\//)

    for (let r = 0; r < 4; ++r) {
      let tmp_arr = []
      for (let i = 0; i < str_arr.length; ++i) {
        let tmp_str = ''
        for (let j = str_arr[i].length - 1; j >= 0; --j) {
          tmp_str += str_arr[j][i]
        }
        tmp_arr.push(tmp_str)
      }
      str_arr = tmp_arr.slice()
      strs.push(tmp_arr.join('/'))
    }
    return strs
  }
  flip(string) {
    const strs = []
    let str_arr = string.split(/\//)
    // console.log(str_arr)
    strs.push(str_arr.reverse().join('/'))
    strs.push(str_arr.map(s => s.split('').reverse().join('')).join('/'))
    return strs
  }

  enhance(patterns) {
    const patterns_enhanced = patterns.slice()

    // create more hash_patterns with rotate and flip
    for (let pattern of patterns) {
      const pattern_head = pattern[0]
      const pattern_tail = pattern[1]

      let pattern_head_enhancements = this.morph_all(pattern_head)
      for (let pattern_head of pattern_head_enhancements) {
        patterns_enhanced.push([pattern_head, pattern_tail])
      }
    }
    return patterns_enhanced
  }
  // flip: 0,1; rotate: 0,1,2,3
  morph(arr_str, rotate, flip) {
    let str_arr = arr_str.split(/\//)

    // flip
    if (flip) str_arr = str_arr.reverse()

    // rotate
    for (let r = 0; r < rotate; ++r) {
      let tmp_arr = []
      for (let i = 0; i < str_arr.length; ++i) {
        let tmp_str = ''
        for (let j = str_arr[i].length - 1; j >= 0 ; --j) {
          tmp_str += str_arr[j][i]
        }
        tmp_arr.push(tmp_str)
      }
      str_arr = tmp_arr
    }

    return str_arr.join('/')
  }
  morph_all(arr) {
    const strs = new Set()
    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < 4; ++j) {
        strs.add(this.morph(arr, j, i))
      }
    }

    return Array.from(strs)
  }
  divide(images) {
    const part_len = images.length % 2 === 0 ? 2 : 3

    const subs = []
    for (let i = 0; i < images.length; i += part_len) {
      for (let j = 0; j < images[i].length; j += part_len) {
        let tmp_str = ''
        for (let k = 0; k < part_len; ++k) {
          tmp_str += images[i+k].substring(j, j+part_len) + '/'
        }
        subs.push(tmp_str.substr(0, tmp_str.length-1))
      }
    }
    return subs
  }
}

module.exports = {
  FractalArt
}

if (require.main === module) {


  let input_initial = `.#.
..#
###`, input_patterns = `../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#`
  let fractal = new FractalArt(input_initial, input_patterns)
  let times = 2
  let output = fractal.draw(times)
  console.log(output)
  assert.equal(output, 12)

  console.log('======')
  input_patterns = `../.. => .../.../..#
#./.. => #.#/..#/...
##/.. => #.#/..#/#.#
.#/#. => #../.../.##
##/#. => ###/#.#/..#
##/## => #.#/.../#..
.../.../... => #..#/..../.##./....
#../.../... => ..../.##./#.../.##.
.#./.../... => .#../####/..##/#...
##./.../... => ##.#/..#./####/...#
#.#/.../... => ##.#/##../#.#./.#..
###/.../... => #..#/#..#/##../##.#
.#./#../... => #.##/##../.#.#/..##
##./#../... => #.#./..../.###/.#.#
..#/#../... => ..##/####/..##/....
#.#/#../... => ..##/###./..##/#...
.##/#../... => #.../####/#..#/##..
###/#../... => ...#/..../..##/#...
.../.#./... => ##../##../..##/....
#../.#./... => #.../.#.#/.##./#..#
.#./.#./... => ..##/#.../...#/###.
##./.#./... => ####/.#.#/..##/####
#.#/.#./... => ####/.#../#.##/#..#
###/.#./... => ..#./#..#/.#.#/###.
.#./##./... => ##../.#.#/#..#/#..#
##./##./... => .###/####/#..#/..##
..#/##./... => ###./.#../..#./#.##
#.#/##./... => ##../#.#./#.../.#.#
.##/##./... => #.../#.../.#.#/####
###/##./... => .#../####/#.../#.#.
.../#.#/... => .#../..../##../.###
#../#.#/... => .##./...#/.###/...#
.#./#.#/... => ...#/#.../...#/####
##./#.#/... => #.##/..#./#..#/.#.#
#.#/#.#/... => #..#/..../..##/..#.
###/#.#/... => .#.#/#.#./##.#/#.#.
.../###/... => ##../.##./###./###.
#../###/... => ###./..##/.#../##.#
.#./###/... => .#../##../..../..##
##./###/... => #.#./...#/...#/##..
#.#/###/... => ..../.#../#.../.#..
###/###/... => ..#./.###/..../##.#
..#/.../#.. => #.#./.#../...#/##.#
#.#/.../#.. => ...#/##.#/#.#./#...
.##/.../#.. => ...#/..##/#.##/##.#
###/.../#.. => #..#/.#.#/.##./..#.
.##/#../#.. => ##../..#./#.##/##..
###/#../#.. => ..../###./#.#./##..
..#/.#./#.. => #.#./.##./.##./#...
#.#/.#./#.. => .#../#..#/#.#./#...
.##/.#./#.. => .#.#/#..#/..#./....
###/.#./#.. => #.##/####/#.../..#.
.##/##./#.. => #.##/.#.#/..../.#..
###/##./#.. => #.##/####/.###/##..
#../..#/#.. => ###./#.##/..#./..##
.#./..#/#.. => ##../.#../..#./..##
##./..#/#.. => #..#/.#../..../##.#
#.#/..#/#.. => .###/.##./..#./#.#.
.##/..#/#.. => .#.#/..../####/.#..
###/..#/#.. => .##./##../...#/.#..
#../#.#/#.. => #.#./#.##/..../.###
.#./#.#/#.. => ####/#.#./.#../#.##
##./#.#/#.. => ..##/.###/###./..#.
..#/#.#/#.. => .##./..#./..../#.#.
#.#/#.#/#.. => .###/..../..../##..
.##/#.#/#.. => #.#./#.../####/.###
###/#.#/#.. => #.../..##/###./#..#
#../.##/#.. => ..../#.#./..##/.#.#
.#./.##/#.. => ..##/..##/#..#/###.
##./.##/#.. => #.../.#../#.#./#.##
#.#/.##/#.. => ...#/#.../...#/###.
.##/.##/#.. => ###./..../..##/#..#
###/.##/#.. => #.#./##.#/####/#.#.
#../###/#.. => ##../##../###./#..#
.#./###/#.. => #.##/###./####/..##
##./###/#.. => ..../.###/###./.#..
..#/###/#.. => .###/..../..#./....
#.#/###/#.. => ####/#..#/.#.#/..##
.##/###/#.. => ..../##.#/####/##.#
###/###/#.. => #..#/.#.#/###./.##.
.#./#.#/.#. => #.##/...#/###./....
##./#.#/.#. => #..#/.#../..../#.#.
#.#/#.#/.#. => .#.#/####/..../.#.#
###/#.#/.#. => #.#./#.##/##.#/##..
.#./###/.#. => ..#./..../##../####
##./###/.#. => #.##/##.#/#.##/.#..
#.#/###/.#. => .#.#/..##/##.#/####
###/###/.#. => .#../...#/#..#/#.#.
#.#/..#/##. => .##./..#./...#/##.#
###/..#/##. => ..#./##.#/#..#/#..#
.##/#.#/##. => ##.#/#.../#..#/...#
###/#.#/##. => ##../.#../..../.##.
#.#/.##/##. => #.##/##.#/.#../.###
###/.##/##. => ..../#.#./##../##.#
.##/###/##. => ###./.#.#/.##./.###
###/###/##. => #..#/.###/#.../#...
#.#/.../#.# => .###/#.##/.#.#/#.#.
###/.../#.# => ...#/##../...#/##.#
###/#../#.# => ..../..#./..#./####
#.#/.#./#.# => ##../#.##/...#/#...
###/.#./#.# => #.#./...#/.#../#...
###/##./#.# => .#../..#./...#/##..
#.#/#.#/#.# => ####/#.##/.#../##..
###/#.#/#.# => #.../#.../###./.#..
#.#/###/#.# => ####/.#.#/.##./.#.#
###/###/#.# => #.##/.#.#/##.#/..##
###/#.#/### => .###/#.##/..../..#.
###/###/### => .###/#..#/##../.##.`
  fractal = new FractalArt(input_initial, input_patterns)
  times = 5
  output = fractal.draw(times)
  console.log(output)
  assert.equal(output, 164)

  times = 18
  output = fractal.draw(times)
  console.log(output)
  assert.equal(output, 2355110)
}