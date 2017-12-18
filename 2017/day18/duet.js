/*
  --- Day 18: Duet ---

  You discover a tablet containing some strange assembly code labeled simply "Duet". Rather than bother the sound card with it, you decide to run the code yourself. Unfortunately, you don't see any documentation, so you're left to figure out what the instructions mean on your own.

  It seems like the assembly is meant to operate on a set of registers that are each named with a single letter and that can each hold a single integer. You suppose each register should start with a value of 0.

  There aren't that many instructions, so it shouldn't be hard to figure out what they do. Here's what you determine:

  snd X plays a sound with a frequency equal to the value of X.
  set X Y sets register X to the value of Y.
  add X Y increases register X by the value of Y.
  mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
  mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
  rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
  jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
  Many of the instructions can take either a register (a single letter) or a number. The value of a register is the integer it contains; the value of a number is that number.

  After each jump instruction, the program continues with the instruction to which the jump jumped. After any other instruction, the program continues with the next instruction. Continuing (or jumping) off either end of the program terminates it.

  For example:

  set a 1
  add a 2
  mul a a
  mod a 5
  snd a
  set a 0
  rcv a
  jgz a -1
  set a 1
  jgz a -2
  The first four instructions set a to 1, add 2 to it, square it, and then set it to itself modulo 5, resulting in a value of 4.
  Then, a sound with frequency 4 (the value of a) is played.
  After that, a is set to 0, causing the subsequent rcv and jgz instructions to both be skipped (rcv because a is 0, and jgz because a is not greater than 0).
  Finally, a is set to 1, causing the next jgz instruction to activate, jumping back two instructions to another jump, which jumps again to the rcv, which ultimately triggers the recover operation.
  At the time the recover operation is executed, the frequency of the last sound played is 4.

  What is the value of the recovered frequency (the value of the most recently played sound) the first time a rcv instruction is executed with a non-zero value?

  Your puzzle answer was 3423.

  --- Part Two ---

  As you congratulate yourself for a job well done, you notice that the documentation has been on the back of the tablet this entire time. While you actually got most of the instructions correct, there are a few key differences. This assembly code isn't about sound at all - it's meant to be run twice at the same time.

  Each running copy of the program has its own set of registers and follows the code independently - in fact, the programs don't even necessarily run at the same speed. To coordinate, they use the send (snd) and receive (rcv) instructions:

  snd X sends the value of X to the other program. These values wait in a queue until that program is ready to receive them. Each program has its own message queue, so a program can never receive a message it sent.
  rcv X receives the next value and stores it in register X. If no values are in the queue, the program waits for a value to be sent to it. Programs do not continue to the next instruction until they have received a value. Values are received in the order they are sent.
  Each program also has its own program ID (one 0 and the other 1); the register p should begin with this value.

  For example:

  snd 1
  snd 2
  snd p
  rcv a
  rcv b
  rcv c
  rcv d
  Both programs begin by sending three values to the other. Program 0 sends 1, 2, 0; program 1 sends 1, 2, 1. Then, each program receives a value (both 1) and stores it in a, receives another value (both 2) and stores it in b, and then each receives the program ID of the other program (program 0 receives 1; program 1 receives 0) and stores it in c. Each program now sees a different value in its own copy of register c.

  Finally, both programs try to rcv a fourth time, but no data is waiting for either of them, and they reach a deadlock. When this happens, both programs terminate.

  It should be noted that it would be equally valid for the programs to run at different speeds; for example, program 0 might have sent all three values and then stopped at the first rcv before program 1 executed even its first instruction.

  Once both of your programs have terminated (regardless of what caused them to do so), how many times did program 1 send a value?

 */

const assert = require('assert')

class Duet {
  constructor() {}
  vm(input) {
    // parse each line, set into an array
    // set to Set with initial value: 0
    //
    const instructions = [], registers = new Map()

    const lines = input.split(/\n/).map( l => l.trim() )
    for (let i = 0; i < lines.length; ++i) {
      instructions[i] = lines[i].split(/ /).map(l => l.trim())
    }

    // console.log(instructions)
    let pc = 0, count = 200
    while(true ) {
      pc = this.run(instructions, pc, registers)
      // console.log('registers:', registers)
      // console.log('pc:', pc)
      if (pc === null) return registers.get('fr')
      count--
    }
  }
  run(instrs, pc, registers) {
    // console.log(instrs[pc])
    switch(instrs[pc][0]) {
      case 'snd':
        // console.log('play sound with frequency:', instrs[pc][1])
        if (registers.has(instrs[pc][1])) {
          registers.set('fr', registers.get(instrs[pc][1]))
        } else {
          registers.set('fr', parseInt(instrs[pc][1]))
        }

        break
      case 'set':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], parseInt(instrs[pc][2]))
        }
        break
      case 'add':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) + registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) + parseInt(instrs[pc][2]))
        }
        break
      case 'mul':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) * registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) * parseInt(instrs[pc][2]))
        }
        break
      case 'mod':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) % registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) % parseInt(instrs[pc][2]))
        }
        break
      case 'rcv':
        if (registers.has(instrs[pc][1])) {
          if (registers.get(instrs[pc][1]) !== 0) {
            // console.log('recover to play sound with frequency:', registers.get('fr'))
            return null
          }
        } else {
          if (parseInt(instrs[pc][1]) !== 0)
            // console.log('recover to play sound with frequency:', registers.get('fr'))
            return null
        }
        break
      case 'jgz':
        if (registers.has(instrs[pc][1])) {
          if (registers.get(instrs[pc][1]) > 0) {
            pc += parseInt(instrs[pc][2])
            return pc
          }
        } else {
          if (parseInt(instrs[pc][1]) > 0) {
            pc += parseInt(instrs[pc][2])
            return pc
          }
        }
        break
      default:
        console.error('ERROR instr')
    }
    return ++pc
  }

  pipe(input) {
    // parse each line, set into an array
    // set to Map with initial value: 0
    //
    const instructions = []

    const lines = input.split(/\n/).map( l => l.trim() )
    for (let i = 0; i < lines.length; ++i) {
      instructions[i] = lines[i].split(/ /).map(l => l.trim())
    }

    // console.log(instructions)
    const registers_0 = new Map(), registers_1= new Map(), queue_0 = [], queue_1 = []
    let pc_0 = 0, pc_1 = 0, count = 100, count_sent_0 = 0, count_sent_1 = 0
    // let count = 100
    registers_0.set('p', 0)
    registers_1.set('p', 1)

    let done_0 = false, done_1 = false

    // TODO: should be refactor here
    while(true ) {
      if (done_0 === false) {
        let [ pc_0_o, count_sent_0_o ] = this.run_2(instructions, pc_0, registers_0, queue_0, queue_1, 0, count_sent_0)
        // console.log('registers_0:', registers_0)
        pc_0 = pc_0_o; count_sent_0 = count_sent_0_o
        // console.log('pc_0:', pc_0)
      }
      if (pc_0 < 0 || pc_0 > instructions.length - 1 || (instructions[pc_0][0] === 'rcv' && queue_1.length === 0)) {
        done_0 = true
      }
      if (done_0 === true && queue_1.length > 0) {
        done_0 = false
      }

      if (done_1 === false) {
        let [ pc_1_o, count_sent_1_o ] = this.run_2(instructions, pc_1, registers_1, queue_1, queue_0, 1, count_sent_1)
        // console.log('registers_1:', registers_1)
        pc_1 = pc_1_o; count_sent_1 = count_sent_1_o
        // console.log('pc_1:', pc_1)
      }
      if (pc_1 < 0 || pc_1 > instructions.length - 1 || (instructions[pc_1][0] === 'rcv' && queue_0.length === 0)) {
        done_1 = true
      }
      if (done_1 === true && queue_0.length > 0) {
        done_1 = false
      }

      // console.log('queue_0', queue_0)
      // console.log('queue_1', queue_1)

      if (done_0 === true && done_1 === true) {
        return count_sent_1
      }
      // count--
    }
  }

  run_2(instrs, pc, registers, queue_send, queue_recv, program_id, count_sent) {
    // console.log(instrs[pc])
    switch(instrs[pc][0]) {
      case 'snd':
        if (registers.has(instrs[pc][1])) {
          queue_send.push(registers.get(instrs[pc][1]))
        } else {
          queue_send.push(parseInt(instrs[pc][1]))
        }
        count_sent++
        break
      case 'set':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], parseInt(instrs[pc][2]))
        }
        break
      case 'add':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) + registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) + parseInt(instrs[pc][2]))
        }
        break
      case 'mul':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) * registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) * parseInt(instrs[pc][2]))
        }
        break
      case 'mod':
        if (!registers.has(instrs[pc][1])) {
          registers.set(instrs[pc][1], 0)
        }
        if (registers.has(instrs[pc][2])) {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) % registers.get(instrs[pc][2]))
        } else {
          registers.set(instrs[pc][1], registers.get(instrs[pc][1]) % parseInt(instrs[pc][2]))
        }
        break
      case 'rcv':
        if (queue_recv.length > 0) {
          registers.set(instrs[pc][1], queue_recv.shift())
        } else {
          return [ pc, count_sent ]
        }
        break
      case 'jgz':
        if (registers.has(instrs[pc][1])) {
          if (registers.get(instrs[pc][1]) > 0) {
            if (registers.has(instrs[pc][2])) {
              pc += registers.get(instrs[pc][2])
            } else {
              pc += parseInt(instrs[pc][2])
            }
            return [ pc, count_sent ]
          }
        } else {
          if (parseInt(instrs[pc][1]) > 0) {
            pc += parseInt(instrs[pc][2])
            return [ pc, count_sent ]
          }
        }
        break
      default:
        console.error('ERROR instr')
    }
    return [ ++pc, count_sent ]
  }
}

module.exports = {
  Duet
}

if (require.main === module) {
  const duet = new Duet()

  let input = `set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`
  let output = duet.vm(input)
  console.log(output)
  assert.equal(output, 4)

  input = `snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d`
  output = duet.pipe(input)
  console.log(output)
  assert.equal(output, 3)

  console.log('======')
  input=`set i 31
set a 1
mul p 17
jgz p p
mul a 2
add i -1
jgz i -2
add a -1
set i 127
set p 618
mul p 8505
mod p a
mul p 129749
add p 12345
mod p a
set b p
mod b 10000
snd b
add i -1
jgz i -9
jgz a 3
rcv b
jgz b -1
set f 0
set i 126
rcv a
rcv b
set p a
mul p -1
add p b
jgz p 4
snd a
set a b
jgz 1 3
snd b
set f 1
add i -1
jgz i -11
snd a
jgz f -16
jgz a -19`
  output = duet.vm(input)
  console.log(output)
  assert.equal(output, 3423)

  output = duet.pipe(input)
  console.log(output)
  assert.equal(output, 7493)
}