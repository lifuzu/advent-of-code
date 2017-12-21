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
  constructor() {}
  draw(input_initial, input_patterns, times) {
    // parse initial input to string array
    // parse patterns to a hash
    const initial = input_initial.replace(/\n/g, '/')
    const hash_patterns = input_patterns.split(/\n/).map( line => line.split(/ => /))

    // console.log(initial)
    // console.log(hash_patterns)

    // create more hash_patterns with rotate and flip
    for (let p = 0; p < hash_patterns.length; ++p) {
      const pattern_head = hash_patterns[p][0]
      const pattern_tail = hash_patterns[p][1]
      let patterns_enhance = this.rotate(pattern_head, pattern_head.match(/\//g).length + 1)
      // console.log(patterns_enhance)
      for (let pattern of patterns_enhance) {
        let pattern_heads = hash_patterns.map( p => p[0])
        if (!pattern_heads.includes(pattern)) {
          if (pattern.length !== pattern_head.length) {
            console.error("ERROR")
          }
          hash_patterns.push([pattern, pattern_tail])
        }
      }
      patterns_enhance = this.flip(pattern_head, pattern_head.match(/\//g).length + 1)
      // console.log(patterns_enhance)
      for (let pattern of patterns_enhance) {
        let pattern_heads = hash_patterns.map( p => p[0])
        if (!pattern_heads.includes(pattern)) {
          if (pattern.length !== pattern_head.length) {
            console.error("ERROR")
          }
          hash_patterns.push([pattern, pattern_tail])
        }
      }
    }
    // console.log(JSON.stringify(hash_patterns))

    let image = initial

    for (let n = 0; n < times; ++n) {
      // console.log(image)
      let image_dimension = image.match(/\//g).length + 1
      // console.log('dimension:', image_dimension)
      let images = []

      if (image_dimension % 2 === 0) {
        const div = image_dimension / 2
        if (div === 1) {
          images = [ image ]
        } else {
          // get rid of '/', then split to each 2,
          // combine 0, div, then i, div + i,
          // until complete to images
          image = image.replace(/\//g, '')
          // console.log('image without "/"', image)
          let images_tmp = this.split(image, 2)
          // console.log(images_tmp)
          for (let j = 0; j < div; ++j) {
            for (let i = 0; i < div; ++i) {
              // console.log('pair:', i + j * image_dimension, i + j * image_dimension + div)
              images.push(images_tmp[i + j * image_dimension].concat('/').concat(images_tmp[i + j * image_dimension + div]) )
            }
          }
          // console.log('images:', images)
        }
      } else if (image_dimension % 3 === 0) {
        const div = image_dimension / 3
        if (div === 1) {
          images = [ image ]
        } else {
          // get rid of '/', then split to each 3,
          image = image.replace(/\//g, '')
          let images_tmp = this.split(image, 3)
          for (let j = 0; j < div; ++j) {
            for (let i = 0; i < div; ++i) {
              // console.log('pair:', i + j * image_dimension, i + j * image_dimension + div)
              images.push(images_tmp[i + j * image_dimension].concat('/').concat(images_tmp[i + j * image_dimension + div]).concat('/').concat(images_tmp[i + j * image_dimension + div * 2]) )
            }
          }
        }
      }

      for (let i = 0; i < images.length; ++i) {
        // if match
        // console.log('before match:', images[i])
        images[i] = this.match(images[i], hash_patterns, images[i].length)
        // console.log('after match:', images[i])
      }
      // merge images to image
      // console.log('images:',images)
      // image = images.join('/')
      image = this.merge(images)
      // console.log('image', image)
    }
    // console.log(image.split(''))
    // calc # number, then return the number
    return image.split('').reduce((acc, curr, i, arr) => arr[i] === '#' ? ++acc : acc, 0)
  }
  match(image, patterns, length) {
    let found = false
    let image_tmp = ''
    for (let pattern of patterns) {
      if ( image === pattern[0] && pattern[0].length === length) {
        // console.log(pattern)
        found = true
        image_tmp = pattern[1]
      }
    }
    if (found === false) {
      // rotate or flip
      console.error('DON"T found')
    }
    return image_tmp
  }
  merge(array) {
    // array.length should be 1, 4, 9, 16, sqrt it
    const length = array.length
    if (length === 1) return array.join('')

    const items = []
    let strings = []
    for (let i = 0; i < length; ++i) {
      items[i] = array[i].split(/\//)
      // console.log('items:', items)
    }

    const d = Math.sqrt(items.length)
    const d_i = items[0].length
    for (let k = 0; k < d; ++k) {
      for (let i = 0; i < d_i; ++i) {
        for (let j = 0; j < d; ++j) {
          strings.push(items[j + k * d][i])
        }
        strings.push('/')
      }
    }

    strings = strings.slice(0, strings.length - 1)
    // console.log(strings.join(''))
    return strings.join('')
  }
  split(string, size) {
    let re = new RegExp('.{1,' + size + '}', 'g')
    return string.match(re)
  }
  rotate(string, dimension) {
    let str = string.replace(/\//g, '')
    let strings = []
    if (dimension === 2) {
      let str_tmp = str[2]+str[0]+'/'+str[3]+str[1]
      strings.push(str_tmp)
      str_tmp = str[3]+str[2]+'/'+str[1]+str[0]
      strings.push(str_tmp)
      str_tmp = str[1]+str[3]+'/'+str[0]+str[2]
      strings.push(str_tmp)
    } else if (dimension === 3) {
      // let str_tmp = str[3]+str[0]+str[1]+'/'+str[6]+str[4]+str[2]+'/'+str[7]+str[8]+str[5]
      // strings.push(str_tmp)
      let str_tmp = str[6]+str[3]+str[0]+'/'+str[7]+str[4]+str[1]+'/'+str[8]+str[5]+str[2]
      strings.push(str_tmp)
      // str_tmp = str[7]+str[6]+str[3]+'/'+str[8]+str[4]+str[0]+'/'+str[5]+str[2]+str[1]
      // strings.push(str_tmp)
      str_tmp = str[8]+str[7]+str[6]+'/'+str[5]+str[4]+str[3]+'/'+str[2]+str[1]+str[0]
      strings.push(str_tmp)
      // str_tmp = str[5]+str[8]+str[7]+'/'+str[2]+str[4]+str[6]+'/'+str[1]+str[0]+str[3]
      // strings.push(str_tmp)
      str_tmp = str[2]+str[5]+str[8]+'/'+str[1]+str[4]+str[7]+'/'+str[0]+str[3]+str[6]
      strings.push(str_tmp)
      // str_tmp = str[1]+str[2]+str[5]+'/'+str[0]+str[4]+str[8]+'/'+str[3]+str[6]+str[7]
      // strings.push(str_tmp)
    }
    return strings
  }
  flip(string, dimension) {
    let str = string.replace(/\//g, '')
    let strings = []
    if (dimension === 2) {
      let str_tmp = str[2]+str[3]+'/'+str[0]+str[1]
      strings.push(str_tmp)
      str_tmp = str[3]+str[2]+'/'+str[1]+str[0]
      strings.push(str_tmp)
      str_tmp = str[1]+str[0]+'/'+str[3]+str[2]
      strings.push(str_tmp)
    } else if (dimension === 3) {
      let str_tmp = str[2]+str[1]+str[0]+'/'+str[5]+str[4]+str[3]+'/'+str[8]+str[7]+str[6]
      strings.push(str_tmp)
      str_tmp = str[6]+str[7]+str[8]+'/'+str[3]+str[4]+str[5]+'/'+str[0]+str[1]+str[2]
      strings.push(str_tmp)
      str_tmp = str[8]+str[7]+str[6]+'/'+str[5]+str[4]+str[3]+'/'+str[2]+str[1]+str[0]
      strings.push(str_tmp)
    }
    return strings
  }
}

module.exports = {
  FractalArt
}

if (require.main === module) {
  const fractal = new FractalArt()

  let input_initial = `.#.
..#
###`, input_patterns = `../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#`, times = 2
  let output = fractal.draw(input_initial, input_patterns, times)
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
###/###/### => .###/#..#/##../.##.`, times = 5
  output = fractal.draw(input_initial, input_patterns, times)
  console.log(output)
  assert.equal(output, 164)
  //
  times = 18
  output = fractal.draw(input_initial, input_patterns, times)
  console.log(output)
  assert.equal(output, 2355110)
}