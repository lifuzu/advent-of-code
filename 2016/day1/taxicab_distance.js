/*
  --- Day 1: No Time for a Taxicab ---

  Santa's sleigh uses a very high-precision clock to guide its movements, and the clock's oscillator is regulated by stars. Unfortunately, the stars have been stolen... by the Easter Bunny. To save Christmas, Santa needs you to retrieve all fifty stars by December 25th.

  Collect stars by solving puzzles. Two puzzles will be made available on each day in the advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

  You're airdropped near Easter Bunny Headquarters in a city somewhere. "Near", unfortunately, is as close as you can get - the instructions on the Easter Bunny Recruiting Document the Elves intercepted start here, and nobody had time to work them out further.

  The Document indicates that you should start at the given coordinates (where you just landed) and face North. Then, follow the provided sequence: either turn left (L) or right (R) 90 degrees, then walk forward the given number of blocks, ending at a new intersection.

  There's no time to follow such ridiculous instructions on foot, though, so you take a moment and work out the destination. Given that you can only walk on the street grid of the city, how far is the shortest path to the destination?

  For example:

  Following R2, L3 leaves you 2 blocks East and 3 blocks North, or 5 blocks away.
  R2, R2, R2 leaves you 2 blocks due South of your starting position, which is 2 blocks away.
  R5, L5, R5, R3 leaves you 12 blocks away.

  How many blocks away is Easter Bunny HQ?

  --- Part Two ---

  Then, you notice the instructions continue on the back of the Recruiting Document. Easter Bunny HQ is actually at the first location you visit twice.

  For example, if your instructions are R8, R4, R4, R8, the first location you visit twice is 4 blocks away, due East.

  How many blocks away is the first location you visit twice?
 */

const assert = require('assert')

class TaxicabDistance {
  count_distance(blocks) {
    // 1. parse the blocks 'R2, R3' to steps, like ['R2', 'R3']
    // 2. if current direction is 'N', then R means increase x dimension, L means decrease x;
    //    if current direction is 'E', R means decrease y dimentsion, L means increase y;
    //    if current direction is 'S', R means decrease x dimentsion, L means increase x;
    //    if current direction is 'W', R means increase y dimentsion, L means decrease y;
    // 3. return |x| + |y|

    // Step 1.
    const steps = blocks.split(/, +/)
    // console.log(steps)

    // Step 2.
    let [x, y] = [0, 0]
    let direction = 'N' // 'E', 'S', 'W'
    for (let i = 0; i < steps.length; ++i) {
      // console.log('i=', i)
      if (direction === 'N') {
        if (steps[i][0] === 'R') {
          x += parseInt(steps[i].slice(1))
          direction = 'E'
        } else {
          // assert the first charactor is L
          x -= parseInt(steps[i].slice(1))
          direction = 'W'
        }
      } else if (direction === 'E') {
        if (steps[i][0] === 'R') {
          y -= parseInt(steps[i].slice(1))
          direction = 'S'
        } else {
          // assert the first charactor is L
          y += parseInt(steps[i].slice(1))
          direction = 'N'
        }
      } else if (direction === 'S') {
        if (steps[i][0] === 'R') {
          x -= parseInt(steps[i].slice(1))
          direction = 'W'
        } else {
          // assert the first charactor is L
          x += parseInt(steps[i].slice(1))
          direction = 'E'
        }
      } else {
        // assert direction is 'W'
        if (steps[i][0] === 'R') {
          y += parseInt(steps[i].slice(1))
          direction = 'N'
        } else {
          // assert the first charactor is L
          y -= parseInt(steps[i].slice(1))
          direction = 'S'
        }
      }
      // console.log('x=', x, 'y=', y)
    }

    return Math.abs(x) + Math.abs(y)
  }

  count_distance_away_the_first_location_visit_twice(blocks) {
    // 1. parse the blocks 'R2, R3' to steps, like ['R2', 'R3']
    // 2. if current direction is 'N', then R means increase x dimension, L means decrease x;
    //    if current direction is 'E', R means decrease y dimentsion, L means increase y;
    //    if current direction is 'S', R means decrease x dimentsion, L means increase x;
    //    if current direction is 'W', R means increase y dimentsion, L means decrease y;
    // 3. new matrix [x][y] = 1 to record the block passed;
    //    once detect [x][y] = 1, set first_meet_location = [x, y]
    // 4. return |x - first_meet_location.x| + |y - first_meet_location.y| <- wrong here
    // 4. CORRECTION: return |first_meet_location.x| + |first_meet_location.y|

    // Step 1.
    const steps = blocks.split(/, +/)
    console.log(steps)

    // Step 2.
    let [x, y] = [0, 0]
    let block_passed = {'0,0':1}
    let first_meet_location = {}
    let first_meet_done = false
    let direction = 'N' // 'E', 'S', 'W'
    for (let i = 0; i < steps.length; ++i) {
      // console.log('direction=', direction)
      // console.log('steps['+i+']=', steps[i])
      if (direction === 'N') {
        if (steps[i][0] === 'R') {
          direction = 'E'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_x_inc(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          x += steps_num
        } else {
          // assert the first charactor is L
          direction = 'W'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_x_dec(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          x -= steps_num
        }
      } else if (direction === 'E') {
        if (steps[i][0] === 'R') {
          direction = 'S'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_y_dec(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          y -= steps_num
        } else {
          // assert the first charactor is L
          direction = 'N'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_y_inc(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          y += steps_num
        }
      } else if (direction === 'S') {
        if (steps[i][0] === 'R') {
          direction = 'W'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_x_dec(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          x -= steps_num
        } else {
          // assert the first charactor is L
          direction = 'E'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_x_inc(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          x += steps_num
        }
      } else {
        // assert direction is 'W'
        assert.equal(direction, 'W')
        if (steps[i][0] === 'R') {
          direction = 'N'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_y_inc(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          y += steps_num
        } else {
          // assert the first charactor is L
          direction = 'S'
          const steps_num = parseInt(steps[i].slice(1))
          if (first_meet_done === false) {
            const first_meet_location_tmp = this.visit_y_dec(x, y, steps_num, block_passed)
            if (first_meet_location_tmp !== null) {
              first_meet_done = true
              first_meet_location = first_meet_location_tmp
            }
          }
          y -= steps_num
        }
      }

      // console.log('first_meet_location:', first_meet_location)
      // console.log('x=', x, 'y=', y)
    }
    // return Math.abs(x - first_meet_location.x) + Math.abs(y - first_meet_location.y)
    return Math.abs(first_meet_location.x) + Math.abs(first_meet_location.y)
  }

  visit_x_inc(x, y, steps_num, block_passed) {
    // console.log('x, y, steps_num, block_passed = ', x, y, steps_num, block_passed)
    let first_meet_location = null
    for (let i = x+1; i <= x + steps_num; ++i) {
      if (block_passed.hasOwnProperty(i+','+y)) {
        first_meet_location = {x: i, y: y}
      } else {
        block_passed[i+','+y] = 1
      }
    }
    // console.log('first_meet_location:', first_meet_location)
    return first_meet_location
  }
  visit_x_dec(x, y, steps_num, block_passed) {
    // console.log('x, y, steps_num, block_passed = ', x, y, steps_num, block_passed)
    let first_meet_location = null
    for (let i = x-1; i >= x - steps_num; --i) {
      if (block_passed.hasOwnProperty(i+','+y)) {
        first_meet_location = {x: i, y: y}
      } else {
        block_passed[i+','+y] = 1
      }
    }
    // console.log('first_meet_location:', first_meet_location)
    return first_meet_location
  }
  visit_y_inc(x, y, steps_num, block_passed) {
    // console.log('x, y, steps_num, block_passed = ', x, y, steps_num, block_passed)
    let first_meet_location = null
    for (let i = y+1; i <= y + steps_num; ++i) {
      if (block_passed.hasOwnProperty(x+','+i)) {
        first_meet_location = {x: x, y: i}
      } else {
        block_passed[x+','+i] = 1
      }
    }
    // console.log('first_meet_location:', first_meet_location)
    return first_meet_location
  }
  visit_y_dec(x, y, steps_num, block_passed) {
    // console.log('x, y, steps_num, block_passed = ', x, y, steps_num, block_passed)
    let first_meet_location = null
    for (let i = y-1; i >= y - steps_num; --i) {
      if (block_passed.hasOwnProperty(x+','+i)) {
        first_meet_location = {x: x, y: i}
      } else {
        block_passed[x+','+i] = 1
      }
    }
    // console.log('first_meet_location:', first_meet_location)
    return first_meet_location
  }
}

if (require.main === module) {

  const taxicab = new TaxicabDistance()

  let steps = 'R2, L3'
  let distance = taxicab.count_distance(steps)
  // console.log(distance)
  assert.equal(distance, 5)

  steps = 'R2, R2, R2'
  distance = taxicab.count_distance(steps)
  // console.log(distance)
  assert.equal(distance, 2)

  steps = 'R5, L5, R5, R3'
  distance = taxicab.count_distance(steps)
  // console.log(distance)
  assert.equal(distance, 12)

  steps = 'L4, L1, R4, R1, R1, L3, R5, L5, L2, L3, R2, R1, L4, R5, R4, L2, R1, R3, L5, R1, L3, L2, R5, L4, L5, R1, R2, L1, R5, L3, R2, R2, L1, R5, R2, L1, L1, R2, L1, R1, L2, L2, R4, R3, R2, L3, L188, L3, R2, R54, R1, R1, L2, L4, L3, L2, R3, L1, L1, R3, R5, L1, R5, L1, L1, R2, R4, R4, L5, L4, L1, R2, R4, R5, L2, L3, R5, L5, R1, R5, L2, R4, L2, L1, R4, R3, R4, L4, R3, L4, R78, R2, L3, R188, R2, R3, L2, R2, R3, R1, R5, R1, L1, L1, R4, R2, R1, R5, L1, R4, L4, R2, R5, L2, L5, R4, L3, L2, R1, R1, L5, L4, R1, L5, L1, L5, L1, L4, L3, L5, R4, R5, R2, L5, R5, R5, R4, R2, L1, L2, R3, R5, R5, R5, L2, L1, R4, R3, R1, L4, L2, L3, R2, L3, L5, L2, L2, L1, L2, R5, L2, L2, L3, L1, R1, L4, R2, L4, R3, R5, R3, R4, R1, R5, L3, L5, L5, L3, L2, L1, R3, L4, R3, R2, L1, R3, R1, L2, R4, L3, L3, L3, L1, L2'
  distance = taxicab.count_distance(steps)
  // console.log(distance)
  assert.equal(distance, 279)


  steps = 'R8, R4, R4, R8'
  distance = taxicab.count_distance_away_the_first_location_visit_twice(steps)
  // console.log(distance)
  assert.equal(distance, 4)

  steps = 'L4, L1, R4, R1, R1, L3, R5, L5, L2, L3, R2, R1, L4, R5, R4, L2, R1, R3, L5, R1, L3, L2, R5, L4, L5, R1, R2, L1, R5, L3, R2, R2, L1, R5, R2, L1, L1, R2, L1, R1, L2, L2, R4, R3, R2, L3, L188, L3, R2, R54, R1, R1, L2, L4, L3, L2, R3, L1, L1, R3, R5, L1, R5, L1, L1, R2, R4, R4, L5, L4, L1, R2, R4, R5, L2, L3, R5, L5, R1, R5, L2, R4, L2, L1, R4, R3, R4, L4, R3, L4, R78, R2, L3, R188, R2, R3, L2, R2, R3, R1, R5, R1, L1, L1, R4, R2, R1, R5, L1, R4, L4, R2, R5, L2, L5, R4, L3, L2, R1, R1, L5, L4, R1, L5, L1, L5, L1, L4, L3, L5, R4, R5, R2, L5, R5, R5, R4, R2, L1, L2, R3, R5, R5, R5, L2, L1, R4, R3, R1, L4, L2, L3, R2, L3, L5, L2, L2, L1, L2, R5, L2, L2, L3, L1, R1, L4, R2, L4, R3, R5, R3, R4, R1, R5, L3, L5, L5, L3, L2, L1, R3, L4, R3, R2, L1, R3, R1, L2, R4, L3, L3, L3, L1, L2'
  distance = taxicab.count_distance_away_the_first_location_visit_twice(steps)
  // console.log(distance)
  assert.equal(distance, 163)
}