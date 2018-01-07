



class Duet {
  constructor() {}

  init(input) {
    const lines = input.split(/\n/)

    const instructions = []

    for (let line of lines) {
      const instruction = line.split(/\ /)
      instructions.push(instruction)
    }

    return instructions
  }
  run(input) {
    const instructions = this.init(input)

    let pc = 0
    // registers
    let registers = new Map()

    while (true) {
      pc = this.program(instructions, pc, registers)
      // console.log(pc)
      if (pc === null) return registers.get('fr')
    }

  }
  program(instructions, pc, registers) {
    const components = instructions[pc]

    let instruct = components[0]
    let register = components[1]

    // console.log(instruct, register, components)

    switch(instruct) {
      case 'set':
        registers.set(register, parseInt(components[2]))
        pc++
        break
      case 'add':
        if (registers.has(register) && registers.has(components[2])) {
          registers.set(register, registers.get(register) + registers.get(components[2]))
        } else if (registers.has(register)) {
          registers.set(register, registers.get(register) + parseInt(components[2]))
        }
        pc++
        break
      case 'mul':
        if (registers.has(register) && registers.has(components[2])) {
          registers.set(register, registers.get(register) * registers.get(components[2]))
        } else {
          registers.set(register, registers.get(register) * parseInt(components[2]))
        }
        pc++
        break
      case 'mod':
        if (registers.has(register) && registers.has(components[2])) {
          registers.set(register, Math.floor(registers.get(register) % registers.get(components[2])))
        } else {
          registers.set(register, Math.floor(registers.get(register) % parseInt(components[2])))
        }
        pc++
        break
      case 'jgz':
        if (registers.has(register) && registers.get(register) > 0) {
          pc += parseInt(components[2])
        } else pc++
        break
      case 'snd':
        if (registers.has(register)) {
          registers.set('fr', registers.get(register))
        }
        pc++
        break
      case 'rcv':
        if (registers.has(register) && registers.get(register) !== 0) {
          return null
        }
        pc++
        break
      default:
        console.error('UNSUPPORT yet!')
    }
    // console.log(registers)
    return pc
  }
}

if (require.main === module) {
  const duet = new Duet()

  const input = `set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`

  let output = duet.run(input)
  console.log(output)
}