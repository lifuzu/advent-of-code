/*
  --- Day 2: Bathroom Security ---

  You arrive at Easter Bunny Headquarters under cover of darkness. However, you left in such a rush that you forgot to use the bathroom! Fancy office buildings like this one usually have keypad locks on their bathrooms, so you search the front desk for the code.

  "In order to improve security," the document you find says, "bathroom codes will no longer be written down. Instead, please memorize and follow the procedure below to access the bathrooms."

  The document goes on to explain that each button to be pressed can be found by starting on the previous button and moving to adjacent buttons on the keypad: U moves up, D moves down, L moves left, and R moves right. Each line of instructions corresponds to one button, starting at the previous button (or, for the first line, the "5" button); press whatever button you're on at the end of each line. If a move doesn't lead to a button, ignore it.

  You can't hold it much longer, so you decide to figure out the code as you walk to the bathroom. You picture a keypad like this:

  1 2 3
  4 5 6
  7 8 9
  Suppose your instructions are:

  ULL
  RRDDD
  LURDL
  UUUUD
  You start at "5" and move up (to "2"), left (to "1"), and left (you can't, and stay on "1"), so the first button is 1.
  Starting from the previous button ("1"), you move right twice (to "3") and then down three times (stopping at "9" after two moves and ignoring the third), ending up with 9.
  Continuing from "9", you move left, up, right, down, and left, ending with 8.
  Finally, you move up four times (stopping at "2"), then down once, ending with 5.
  So, in this example, the bathroom code is 1985.

  Your puzzle input is the instructions from the document you found at the front desk. What is the bathroom code?


  --- Part Two ---

  You finally arrive at the bathroom (it's a several minute walk from the lobby so visitors can behold the many fancy conference rooms and water coolers on this floor) and go to punch in the code. Much to your bladder's dismay, the keypad is not at all like you imagined it. Instead, you are confronted with the result of hundreds of man-hours of bathroom-keypad-design meetings:

      1
    2 3 4
  5 6 7 8 9
    A B C
      D
  You still start at "5" and stop when you're at an edge, but given the same instructions as above, the outcome is very different:

  You start at "5" and don't move at all (up and left are both edges), ending at 5.
  Continuing from "5", you move right twice and down three times (through "6", "7", "B", "D", "D"), ending at D.
  Then, from "D", you move five more times (through "D", "B", "C", "C", "B"), ending at B.
  Finally, after five more moves, you end at 3.
  So, given the actual keypad layout, the code would be 5DB3.

  Using the same instructions in your puzzle input, what is the correct bathroom code?
 */
const assert = require('assert')

class BathroomSecurity {
  constructor() {
    this.keypad = [[1,2,3],[4,5,6],[7,8,9]]
    this.keypad2 = [[0, 0, 1, 0, 0], [0, 2, 3, 4, 0], [5, 6, 7, 8, 9], [0, 'A', 'B', 'C', 0], [0, 0, 'D', 0, 0]]
  }
  get_code(input) {
    // 1. split to lines
    // 2. move the step according to the instructions
    // 3. put the button to an array for each line
    //

    const lines = input.split(/\n/).map(line => line.trim())
    // console.log(lines)

    // Step 2.
    let [i, j] = [1, 1]
    const ret_arr = []

    // console.log(this.keypad[i][j])
    for (let line of lines) {
      for (let k of line) {
        // console.log(k)
        switch(k) {
          case 'U':
            i--
            if (i < 0) i = 0
            break
          case 'D':
            i++
            if (i > this.keypad.length - 1) i = this.keypad.length - 1
            break
          case 'L':
            j--
            if (j < 0) j = 0
            break
          case 'R':
            j++
            if (j > this.keypad.length - 1) j = this.keypad.length - 1
            break
        }
      }
      ret_arr.push(this.keypad[i][j])
    }

    return ret_arr.join('')
  }

  get_code2(input) {
    // 1. split to lines
    // 2. move the step according to the instructions
    // 3. put the button to an array for each line
    //

    const lines = input.split(/\n/).map(line => line.trim())
    // console.log(lines)

    // Step 2.
    let [i, j] = [2, 0]
    // console.log(this.keypad2[i][j])

    const ret_arr = []

    for (let line of lines) {
      for (let k of line) {
        // console.log(k)
        switch(k) {
          case 'U':
            i--
            if (i < 0) i = 0
            else if (this.keypad2[i][j] === 0) i++
            break
          case 'D':
            i++
            if (i > this.keypad2.length - 1) i = this.keypad2.length - 1
            else if (this.keypad2[i][j] === 0) i--
            break
          case 'L':
            j--
            if (j < 0) j = 0
            else if (this.keypad2[i][j] === 0) j++
            break
          case 'R':
            j++
            if (j > this.keypad2.length - 1) j = this.keypad2.length - 1
            else if (this.keypad2[i][j] === 0) j--
            break
        }
      }
      ret_arr.push(this.keypad2[i][j])
    }

    return ret_arr.join('')
  }
}

module.exports = {
  BathroomSecurity
}

if (require.main === module) {
  const security = new BathroomSecurity()

  let input = `ULL
  RRDDD
  LURDL
  UUUUD`
  let output = security.get_code(input)
  console.log(output)
  assert.equal(output, '1985')

  output = security.get_code2(input)
  console.log(output)
  assert.equal(output, '5DB3')

  input = `LURLDDLDULRURDUDLRULRDLLRURDUDRLLRLRURDRULDLRLRRDDULUDULURULLURLURRRLLDURURLLUURDLLDUUDRRDLDLLRUUDURURRULURUURLDLLLUDDUUDRULLRUDURRLRLLDRRUDULLDUUUDLDLRLLRLULDLRLUDLRRULDDDURLUULRDLRULRDURDURUUUDDRRDRRUDULDUUULLLLURRDDUULDRDRLULRRRUUDUURDULDDRLDRDLLDDLRDLDULUDDLULUDRLULRRRRUUUDULULDLUDUUUUDURLUDRDLLDDRULUURDRRRDRLDLLURLULDULRUDRDDUDDLRLRRDUDDRULRULULRDDDDRDLLLRURDDDDRDRUDUDUUDRUDLDULRUULLRRLURRRRUUDRDLDUDDLUDRRURLRDDLUUDUDUUDRLUURURRURDRRRURULUUDUUDURUUURDDDURUDLRLLULRULRDURLLDDULLDULULDDDRUDDDUUDDUDDRRRURRUURRRRURUDRRDLRDUUULLRRRUDD
DLDUDULDLRDLUDDLLRLUUULLDURRUDLLDUDDRDRLRDDUUUURDULDULLRDRURDLULRUURRDLULUDRURDULLDRURUULLDLLUDRLUDRUDRURURUULRDLLDDDLRUDUDLUDURLDDLRRUUURDDDRLUDDDUDDLDUDDUUUUUULLRDRRUDRUDDDLLLDRDUULRLDURLLDURUDDLLURDDLULLDDDRLUDRDDLDLDLRLURRDURRRUDRRDUUDDRLLUDLDRLRDUDLDLRDRUDUUULULUDRRULUDRDRRLLDDRDDDLULURUURULLRRRRRDDRDDRRRDLRDURURRRDDULLUULRULURURDRRUDURDDUURDUURUURUULURUUDULURRDLRRUUDRLLDLDRRRULDRLLRLDUDULRRLDUDDUUURDUDLDDDUDL
RURDRUDUUUUULLLUULDULLLDRUULURLDULULRDDLRLLRURULLLLLLRULLURRDLULLUULRRDURRURLUDLULDLRRULRDLDULLDDRRDLLRURRDULULDRRDDULDURRRUUURUDDURULUUDURUULUDLUURRLDLRDDUUUUURULDRDUDDULULRDRUUURRRDRLURRLUUULRUDRRLUDRDLDUDDRDRRUULLLLDUUUULDULRRRLLRLRLRULDLRURRLRLDLRRDRDRLDRUDDDUUDRLLUUURLRLULURLDRRULRULUDRUUURRUDLDDRRDDURUUULLDDLLDDRUDDDUULUDRDDLULDDDDRULDDDDUUUURRLDUURULRDDRDLLLRRDDURUDRRLDUDULRULDDLDDLDUUUULDLLULUUDDULUUDLRDRUDLURDULUDDRDRDRDDURDLURLULRUURDUDULDDLDDRUULLRDRLRRUURRDDRDUDDLRRLLDRDLUUDRRDDDUUUDLRRLDDDUDRURRDDUULUDLLLRUDDRULRLLLRDLUDUUUUURLRRUDUDDDDLRLLULLUDRDURDDULULRDRDLUDDRLURRLRRULRL
LDUURLLULRUURRDLDRUULRDRDDDRULDLURDDRURULLRUURRLRRLDRURRDRLUDRUUUULLDRLURDRLRUDDRDDDUURRDRRURULLLDRDRDLDUURLDRUULLDRDDRRDRDUUDLURUDDLLUUDDULDDULRDDUUDDDLRLLLULLDLUDRRLDUUDRUUDUDUURULDRRLRRDLRLURDRURURRDURDURRUDLRURURUUDURURUDRURULLLLLUDRUDUDULRLLLRDRLLRLRLRRDULRUUULURLRRLDRRRDRULRUDUURRRRULDDLRULDRRRDLDRLUDLLUDDRURLURURRLRUDLRLLRDLLDRDDLDUDRDLDDRULDDULUDDLLDURDULLDURRURRULLDRLUURURLLUDDRLRRUUDULRRLLRUDRDUURLDDLLURRDLRUURLLDRDLRUULUDURRDULUULDDLUUUDDLRRDRDUDLRUULDDDLDDRUDDD
DRRDRRURURUDDDRULRUDLDLDULRLDURURUUURURLURURDDDDRULUDLDDRDDUDULRUUULRDUDULURLRULRDDLDUDLDLULRULDRRLUDLLLLURUDUDLLDLDRLRUUULRDDLUURDRRDLUDUDRULRRDDRRLDUDLLDLURLRDLRUUDLDULURDDUUDDLRDLUURLDLRLRDLLRUDRDUURDDLDDLURRDDRDRURULURRLRLDURLRRUUUDDUUDRDRULRDLURLDDDRURUDRULDURUUUUDULURUDDDDUURULULDRURRDRDURUUURURLLDRDLDLRDDULDRLLDUDUDDLRLLRLRUUDLUDDULRLDLLRLUUDLLLUUDULRDULDLRRLDDDDUDDRRRDDRDDUDRLLLDLLDLLRDLDRDLUDRRRLDDRLUDLRLDRUURUDURDLRDDULRLDUUUDRLLDRLDLLDLDRRRLLULLUDDDLRUDULDDDLDRRLLRDDLDUULRDLRRLRLLRUUULLRDUDLRURRRUULLULLLRRURLRDULLLRLDUUUDDRLRLUURRLUUUDURLRDURRDUDDUDDRDDRUD`
  output = security.get_code(input)
  console.log(output)
  assert.equal(output, 97289)

  output = security.get_code2(input)
  console.log(output)
  assert.equal(output, '9A7DC')
}