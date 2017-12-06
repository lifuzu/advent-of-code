/*
  --- Day 6: Memory Reallocation ---

  A debugger program here is having an issue: it is trying to repair a memory reallocation routine, but it keeps getting stuck in an infinite loop.

  In this area, there are sixteen memory banks; each memory bank can hold any number of blocks. The goal of the reallocation routine is to balance the blocks between the memory banks.

  The reallocation routine operates in cycles. In each cycle, it finds the memory bank with the most blocks (ties won by the lowest-numbered memory bank) and redistributes those blocks among the banks. To do this, it removes all of the blocks from the selected bank, then moves to the next-highest-indexed memory bank and inserts one of the blocks. It continues doing this until it runs out of blocks; if it reaches the last memory bank, it wraps around to the first one.

  The debugger would like to know how many redistributions can be done before a blocks-in-banks configuration is produced that has been seen before.

  For example, imagine a scenario with only four memory banks:

  The banks start with 0, 2, 7, and 0 blocks. The third bank has the most blocks, so it is chosen for redistribution.
  Starting with the next bank (the fourth bank) and then continuing to the first bank, the second bank, and so on, the 7 blocks are spread out over the memory banks. The fourth, first, and second banks get two blocks each, and the third bank gets one back. The final result looks like this: 2 4 1 2.
  Next, the second bank is chosen because it contains the most blocks (four). Because there are four memory banks, each gets one block. The result is: 3 1 2 3.
  Now, there is a tie between the first and fourth memory banks, both of which have three blocks. The first bank wins the tie, and its three blocks are distributed evenly over the other three banks, leaving it with none: 0 2 3 4.
  The fourth bank is chosen, and its four blocks are distributed such that each of the four banks receives one: 1 3 4 1.
  The third bank is chosen, and the same thing happens: 2 4 1 2.
  At this point, we've reached a state we've seen before: 2 4 1 2 was already seen. The infinite loop is detected after the fifth block redistribution cycle, and so the answer in this example is 5.

  Given the initial block counts in your puzzle input, how many redistribution cycles must be completed before a configuration is produced that has been seen before?

  --- Part Two ---

  Out of curiosity, the debugger would also like to know the size of the loop: starting from a state that has already been seen, how many block redistribution cycles must be performed before that same state is seen again?

  In the example above, 2 4 1 2 is seen again after four cycles, and so the answer in that example would be 4.

  How many cycles are in the infinite loop that arises from the configuration in your puzzle input?

 */
const assert = require('assert')

class MemoryReallocation {
  constructor() {}
  cycles(input) {
    // 1. split to array
    // 2. transform to string, put to hash
    // 3. pick up the biggest one, redistribute to next index, and loop until 0;
    //    if there are two numbers are same, pick up the first one from index 0;
    // 4. check the hash if exists same one,
    // 4.1. if exist, save to pre_steps, then to +1 to the hash value
    // 4.2. check the hash if the value is 2, which means meet again, record to steps, break
    // 5. return the steps

    const array = input.split(/ +/).map( n => parseInt(n.trim()))
    const array_len = array.length
    // console.log(array)
    // console.log(array_len)

    let steps = 0, pre_steps = 0
    let key = array.toString()  // DON'T use array.join(''), instead of array.join(',') or toString()
    const hash = {}
    hash[key] = 1
    // console.log(hash)

    while(true) {
      // console.log('before array=', array)
      let max_i = this.find_max_index(array, array_len)
      // console.log(max_i)

      let max_value = array[max_i]
      array[max_i] = 0
      let i = max_i
      while (max_value > 0) {
        if (++i > array_len - 1) i = 0
        max_value--
        array[i]++
      }
      steps++
      // console.log(steps)
      // console.log('after array=', array)
      let key = array.toString()
      if (hash.hasOwnProperty(key)) {
        if (pre_steps === 0) pre_steps = steps
        if (hash[key] === 2) {
          break
        }
        hash[key]++
      } else {
        // console.log(hash)
        hash[key] = 1
      }
    }

    // return the steps first meet, and then steps to meet again
    return [pre_steps, steps - pre_steps]
  }

  find_max_index(array, array_len) {
    // console.log(array)
    let index = 0
    for (let i = 1; i <= array_len - 1; ++i) {
      if (array[index] < array[i]) {
        index = i
      }
    }
    // console.log('index=', index)
    return index
  }
}

module.exports = {
  MemoryReallocation
}

if (require.main === module) {
  const reallocation = new MemoryReallocation()

  let input = '0 2 7 0'
  let output = reallocation.cycles(input)
  console.log(output)
  assert.deepEqual(output, [5, 4])

  input = '4  10  4 1 8 4 9 14  5 1 14  15  0 15  3 5'
  output = reallocation.cycles(input)
  console.log(output)
  assert.deepEqual(output, [ 12841, 8038 ])
}