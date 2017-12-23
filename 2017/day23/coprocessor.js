/*
  --- Day 23: Coprocessor Conflagration ---

  You decide to head directly to the CPU and fix the printer from there. As you get close, you find an experimental coprocessor doing so much work that the local programs are afraid it will halt and catch fire. This would cause serious issues for the rest of the computer, so you head in and see what you can do.

  The code it's running seems to be a variant of the kind you saw recently on that tablet. The general functionality seems very similar, but some of the instructions are different:

  set X Y sets register X to the value of Y.
  sub X Y decreases register X by the value of Y.
  mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
  jnz X Y jumps with an offset of the value of Y, but only if the value of X is not zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
  Only the instructions listed above are used. The eight registers here, named a through h, all start at 0.

  The coprocessor is currently set to some kind of debug mode, which allows for testing, but prevents it from doing any meaningful work.

  If you run the program (your puzzle input), how many times is the mul instruction invoked?

  Your puzzle answer was 9409.

  The first half of this puzzle is complete! It provides one gold star: *

  --- Part Two ---
  Now, it's time to fix the problem.

  The debug mode switch is wired directly to register a. You flip the switch, which makes register a now start at 1 when the program is executed.

  Immediately, the coprocessor begins to overheat. Whoever wrote this program obviously didn't choose a very efficient implementation. You'll need to optimize the program if it has any hope of completing before Santa needs that printer working.

  The coprocessor's ultimate goal is to determine the final value left in register h once the program completes. Technically, if it had that... it wouldn't even need to run the program.

  After setting register a to 1, if the program were to run to completion, what value would be left in register h?

 */
const assert = require('assert')

class CoprocessorConflagration {
  constructor() {}
  program(input) {
    const instructions = [], registers = new Map()

    registers.set('a', 0)
    registers.set('b', 0)
    registers.set('c', 0)
    registers.set('d', 0)
    registers.set('e', 0)
    registers.set('f', 0)
    registers.set('g', 0)
    registers.set('h', 0)

    const lines = input.split(/\n/).map( l => l.trim() )
    for (let i = 0; i < lines.length; ++i) {
      instructions[i] = lines[i].split(/ /).map(l => l.trim())
    }

    let pc = 0, mul_count = 0
    while(true) {
      [ pc, mul_count ] = this.run(instructions, pc, registers, mul_count)
      if (pc < 0 || pc >= instructions.length) break
    }
    return mul_count
  }
  run(instrs, pc, registers, mul_count) {

    switch(instrs[pc][0]) {

      case 'set':
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], parseInt(instrs[pc][2]))
        }
        break
      case 'sub':
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) - registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) - parseInt(instrs[pc][2]))
        }
        break
      case 'mul':
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) * registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) * parseInt(instrs[pc][2]))
        }
        mul_count++
        break
      case 'jnz':
        if (registers.has(instrs[pc][1])) {
          if (registers.get(instrs[pc][1]) !== 0) {
            pc += parseInt(instrs[pc][2])
            return [ pc, mul_count ]
          }
        } else {
          if (parseInt(instrs[pc][1]) !== 0) {
            pc += parseInt(instrs[pc][2])
            return [ pc, mul_count ]
          }
        }
        break
      default:
        console.error('ERROR instr')
    }
    return [ ++pc, mul_count ]
  }
  func() {
    let a = 1, b = 109900, c = 126900, h = 0

    while (true) {

      let f = 1, d = 2

      while( ++d !== b) {
        if ( b % d === 0) {
          f = 0
        }
      }

      if (f === 0) { h++ }

      if ( b !== c ) {
        b += 17
      } else break
    }
    return h
  }

}

module.exports = {
  CoprocessorConflagration
}

if (require.main === module) {
  const coprocessor = new CoprocessorConflagration()

  console.log('======')

  let input = `set b 99
set c b
jnz a 2
jnz 1 5
mul b 100
sub b -100000
set c b
sub c -17000
set f 1
set d 2
set e 2
set g d
mul g e
sub g b
jnz g 2
set f 0
sub e -1
set g e
sub g b
jnz g -8
sub d -1
set g d
sub g b
jnz g -13
jnz f 2
sub h -1
set g b
sub g c
jnz g 2
jnz 1 3
sub b -17
jnz 1 -23`
  let output = coprocessor.program(input)
  console.log(output)
  assert.equal(output, 9409)

  // 418
  output = coprocessor.func()
  console.log(output)
  assert.equal(output, 913)
}