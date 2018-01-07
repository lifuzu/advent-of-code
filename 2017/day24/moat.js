/*
  --- Day 24: Electromagnetic Moat ---
  The CPU itself is a large, black building surrounded by a bottomless pit. Enormous metal tubes extend outward from the side of the building at regular intervals and descend down into the void. There's no way to cross, but you need to get inside.

  No way, of course, other than building a bridge out of the magnetic components strewn about nearby.

  Each component has two ports, one on each end. The ports come in all different types, and only matching types can be connected. You take an inventory of the components by their port types (your puzzle input). Each port is identified by the number of pins it uses; more pins mean a stronger connection for your bridge. A 3/7 component, for example, has a type-3 port on one side, and a type-7 port on the other.

  Your side of the pit is metallic; a perfect surface to connect a magnetic, zero-pin port. Because of this, the first port you use must be of type 0. It doesn't matter what type of port you end with; your goal is just to make the bridge as strong as possible.

  The strength of a bridge is the sum of the port types in each component. For example, if your bridge is made of components 0/3, 3/7, and 7/4, your bridge has a strength of 0+3 + 3+7 + 7+4 = 24.

  For example, suppose you had the following components:

  0/2
  2/2
  2/3
  3/4
  3/5
  0/1
  10/1
  9/10
  With them, you could make the following valid bridges:

  0/1
  0/1--10/1
  0/1--10/1--9/10
  0/2
  0/2--2/3
  0/2--2/3--3/4
  0/2--2/3--3/5
  0/2--2/2
  0/2--2/2--2/3
  0/2--2/2--2/3--3/4
  0/2--2/2--2/3--3/5
  (Note how, as shown by 10/1, order of ports within a component doesn't matter. However, you may only use each port on a component once.)

  Of these bridges, the strongest one is 0/1--10/1--9/10; it has a strength of 0+1 + 1+10 + 10+9 = 31.

  What is the strength of the strongest bridge you can make with the components you have available?

  --- Part Two ---
  The bridge you've built isn't long enough; you can't jump the rest of the way.

  In the example above, there are two longest bridges:

  0/2--2/2--2/3--3/4
  0/2--2/2--2/3--3/5
  Of them, the one which uses the 3/5 component is stronger; its strength is 0+2 + 2+2 + 2+3 + 3+5 = 19.

  What is the strength of the longest bridge you can make? If you can make multiple bridges of the longest length, pick the strongest one.

  Your puzzle answer was 1824.

 */

const assert = require('assert')

class ElectromagneticMoat {
  constructor() {}

  traversal_order_list(input) {
    // parse the input to hash map
    const pairs = input.split(/\n/).map( l => l.split(/\//) )

    const start_pairs = pairs.filter( pair => pair[0] === '0' || pair[1] === '0')

    let traversal_order_list = []

    for (let pair of start_pairs) {
      const pair_value = parseInt(pair[0]) + parseInt(pair[1])
      const visited_pairs = new Set()
      const traversal_order = []
      const stack = []

      visited_pairs.add(pair.toString())
      traversal_order.push(pair)

      let search_point = pair[0] === '0' ? pair[1] : pair[0]

      stack.push([ traversal_order, search_point, pair_value, visited_pairs ])

      while (stack.length > 0) {
        let [ traversal_order, search_point, pair_value, visited_pairs ] = stack.pop()

        const pair = traversal_order[traversal_order.length - 1]

        const matcheds = pairs.filter( pair => !visited_pairs.has(pair.toString()) && ( pair[0] === search_point || pair[1] === search_point ) )

        if (matcheds.length > 0) {
          for( let matched of matcheds) {

            const new_visited_pairs = new Set(visited_pairs)
            const new_traversal_order = traversal_order.slice()

            new_visited_pairs.add(matched.toString())
            new_traversal_order.push(matched)
            const new_pair_value = pair_value + parseInt(matched[0]) + parseInt(matched[1])
            const new_search_point = search_point === matched[0] ? matched[1] : matched[0]

            stack.push([new_traversal_order, new_search_point, new_pair_value, new_visited_pairs])
          }
        } else {
          traversal_order_list.push(traversal_order)
        }
      }
    }
    return traversal_order_list
  }

  strengthest_bridge(input) {
    const traversal_order_list = this.traversal_order_list(input)

    const strength_of_pairs = traversal_order_list.map(pairs => pairs.reduce((acc, val) => acc + parseInt(val[0]) + parseInt(val[1]), 0))

    // find the strengthest
    let strengthest_value = 0
    for (let pair_strength of strength_of_pairs) {
      if (strengthest_value < pair_strength) {
        strengthest_value = pair_strength
      }
    }

    return strengthest_value
  }

  strength_of_longest_bridge(input) {

    const traversal_order_list = this.traversal_order_list(input)

    let longest_length_of_pairs = 0
    let longest_array_of_pairs = []

    // find the longest array if multiple
    for (let pairs of traversal_order_list) {
      const pairs_length = pairs.length
      if (longest_length_of_pairs < pairs_length) {
        longest_length_of_pairs = pairs_length
        longest_array_of_pairs = []
        longest_array_of_pairs.push(pairs)
      } else if (longest_length_of_pairs === pairs_length) {
        longest_array_of_pairs.push(pairs)
      }
    }

    return Math.max(...longest_array_of_pairs.map(pairs => pairs.reduce((acc, val) => acc + parseInt(val[0]) + parseInt(val[1]), 0)))
  }
}

if (!Array.prototype.peek) {
  Array.prototype.peek = function () {
    return this[this.length - 1]
  }
}

module.exports = {
  ElectromagneticMoat
}

if (require.main === module) {
  const moat = new ElectromagneticMoat()

  let input = `0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10`
  let output = moat.strengthest_bridge(input)
  console.log(output)
  assert.equal(output, 31)

  output = moat.strength_of_longest_bridge(input)
  console.log(output)
  assert.equal(output, 19)

  input = `0/1
1/2
1/3
2/4
3/5`
  output = moat.strengthest_bridge(input)
  console.log(output)
  assert.equal(output, 13)

  output = moat.strength_of_longest_bridge(input)
  console.log(output)
  assert.equal(output, 13)

  input = `0/1
1/2
1/3
2/4
3/5
4/6
5/6
6/6
5/5`
  output = moat.strengthest_bridge(input)
  console.log(output)
  assert.equal(output, 65)

  output = moat.strength_of_longest_bridge(input)
  console.log(output)
  assert.equal(output, 65)

  console.log('======')

  input = `31/13
34/4
49/49
23/37
47/45
32/4
12/35
37/30
41/48
0/47
32/30
12/5
37/31
7/41
10/28
35/4
28/35
20/29
32/20
31/43
48/14
10/11
27/6
9/24
8/28
45/48
8/1
16/19
45/45
0/4
29/33
2/5
33/9
11/7
32/10
44/1
40/32
2/45
16/16
1/18
38/36
34/24
39/44
32/37
26/46
25/33
9/10
0/29
38/8
33/33
49/19
18/20
49/39
18/39
26/13
19/32`
  output = moat.strengthest_bridge(input)
  console.log(output)
  assert.equal(output, 1906)

  output = moat.strength_of_longest_bridge(input)
  console.log(output)
  assert.equal(output, 1824)
}