/*
  --- Day 1: Inverse Captcha ---

  The night before Christmas, one of Santa's Elves calls you in a panic. "The printer's broken! We can't print the Naughty or Nice List!" By the time you make it to sub-basement 17, there are only a few minutes until midnight. "We have a big problem," she says; "there must be almost fifty bugs in this system, but nothing else can print The List. Stand in this square, quick! There's no time to explain; if you can convince them to pay you in stars, you'll be able to--" She pulls a lever and the world goes blurry.

  When your eyes can focus again, everything seems a lot more pixelated than before. She must have sent you inside the computer! You check the system clock: 25 milliseconds until midnight. With that much time, you should be able to collect all fifty stars by December 25th.

  Collect stars by solving puzzles. Two puzzles will be made available on each day millisecond in the advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

  You're standing in a room with "digitization quarantine" written in LEDs along one wall. The only door is locked, but it includes a small interface. "Restricted Area - Strictly No Digitized Users Allowed."

  It goes on to explain that you may only leave by solving a captcha to prove you're not a human. Apparently, you only get one millisecond to solve the captcha: too fast for a normal human, but it feels like hours to you.

  The captcha requires you to review a sequence of digits (your puzzle input) and find the sum of all digits that match the next digit in the list. The list is circular, so the digit after the last digit is the first digit in the list.

  For example:

  1122 produces a sum of 3 (1 + 2) because the first digit (1) matches the second digit and the third digit (2) matches the fourth digit.
  1111 produces 4 because each digit (all 1) matches the next.
  1234 produces 0 because no digit matches the next.
  91212129 produces 9 because the only digit that matches the next one is the last digit, 9.

  What is the solution to your captcha?

  --- Part Two ---

  You notice a progress bar that jumps to 50% completion. Apparently, the door isn't yet satisfied, but it did emit a star as encouragement. The instructions change:

  Now, instead of considering the next digit, it wants you to consider the digit halfway around the circular list. That is, if your list contains 10 items, only include a digit in your sum if the digit 10/2 = 5 steps forward matches it. Fortunately, your list has an even number of elements.

  For example:

  1212 produces 6: the list contains 4 items, and all four digits match the digit 2 items ahead.
  1221 produces 0, because every comparison is between a 1 and a 2.
  123425 produces 4, because both 2s match each other, but no other digit has a match.
  123123 produces 12.
  12131415 produces 4.

  What is the solution to your new captcha?
 */

class ReverseCaptcha {
  constructor(nums) {
    this.nums = nums
  }

  sum() {
    const hash = []

    for (let i = 0; i < this.nums.length; ++i) {
      let j = i+1
      if (j === this.nums.length ) j = 0
      if (this.nums[i] === this.nums[j]) {
        hash[i] = 1
      } else {
        hash[i] = 0
      }
    }
    // console.log(hash)
    let sum = 0
    for (let i = 0; i < this.nums.length; ++i) {
      if (hash[i] === 1) { sum += parseInt(this.nums[i]) }
    }
    return sum
  }
  halfway_around() {
    const hash = []
    const fullway = this.nums.length
    // TODO: assert fullway is even
    const halfway = fullway / 2

    for (let i = 0; i < halfway; ++i) {
      let j = i + halfway
      if (this.nums[i] === this.nums[j]) {
        hash[i] = 1
      } else {
        hash[i] = 0
      }
    }
    // console.log(hash)
    let sum = 0
    for (let i = 0; i < hash.length; ++i) {
      if (hash[i] === 1) { sum += parseInt(this.nums[i]) }
    }
    return sum * 2
  }
}

module.exports = {
  ReverseCaptcha
}

const assert = require('assert')

if (require.main === module) {

  let reverseCaptcha = new ReverseCaptcha('1122')
  let sum = reverseCaptcha.sum()
  // console.log(sum)
  assert.equal(sum, 3)

  reverseCaptcha = new ReverseCaptcha('1111')
  sum = reverseCaptcha.sum()
  // console.log(sum)
  assert.equal(sum, 4)

  reverseCaptcha = new ReverseCaptcha('1234')
  // console.log(reverseCaptcha.sum())
  sum = reverseCaptcha.sum()
  // console.log(sum)
  assert.equal(sum, 0)

  reverseCaptcha = new ReverseCaptcha('91212129')
  // console.log(reverseCaptcha.sum())
  sum = reverseCaptcha.sum()
  // console.log(sum)
  assert.equal(sum, 9)

  reverseCaptcha = new ReverseCaptcha('494751136895345894732582362629576539599184296195318162664695189393364372585778868512194863927652788149779748657989318645936221887731542718562643272683862627537378624843614831337441659741281289638765171452576466381314558821636595394981788588673443769343597851883955668818165723174939893841654914556681324133667446412138511724424292394454166623639872425168644336248217213826339741267546823779383343362789527461579565822966859349777937921933694912369552152772735167832762563719664315456987186713541153781499646178238762644186484381142249926194743713139262596264878458636595896487362658672224346241358667234115974528626523648311919886566497837217169673923935143386823757293148719377821517314629812886912412829924484513493885672343964151252433622341141661523814465991516961684511941471572895453711624986269342398786175846925783918686856442684489873327497698963658862856336682422797551251489126661954848572297228765445646745256499679451426358865477844467458533962981852292513358871483321161973583245698763531598395467675529181496911117769834127516441369261275244225978893617456524385518493112272169767775861256649728253754964675812534546226295535939697352141217337346738553495616832783757866928174519145357234834584788253893618549484385733283627199445369658339175644484859385884574943219267922729967571943843794565736975716174727852348441254492886794362934343868643337828637454277582276962353246357835493338372219824371517526474283541714897994127864461433627894831268659336264234436872715374727211764167739169341999573855627775114848275268739159272518673316753672995297888734844388928439859359992475637439771269232916542385876779616695129412366735112593669719335783511355773814685491876721452994714318863716542473187246351548626157775143333161422867924437526253865859969947366972895674966845993244925218766937543487875485647329995285821739359369998935331986126873726737672159265827566443794515755939813676194755474477224152139987944419463371386499841415227734673733555261543871359797796529847861748979527579985757964742667473767269248335229836818297477665453189662485548925521497365877771665365728224394427883312135322325169141784')
  // console.log(reverseCaptcha.sum())
  sum = reverseCaptcha.sum()
  // console.log(sum)
  assert.equal(sum, 1150)

  // === part two
  reverseCaptcha = new ReverseCaptcha('1212')
  sum = reverseCaptcha.halfway_around()
  // console.log(sum)
  assert.equal(sum, 6)

  reverseCaptcha = new ReverseCaptcha('1221')
  sum = reverseCaptcha.halfway_around()
  // console.log(sum)
  assert.equal(sum, 0)

  reverseCaptcha = new ReverseCaptcha('123425')
  sum = reverseCaptcha.halfway_around()
  // console.log(sum)
  assert.equal(sum, 4)

  reverseCaptcha = new ReverseCaptcha('123123')
  sum = reverseCaptcha.halfway_around()
  // console.log(sum)
  assert.equal(sum, 12)

  reverseCaptcha = new ReverseCaptcha('12131415')
  sum = reverseCaptcha.halfway_around()
  // console.log(sum)
  assert.equal(sum, 4)

  reverseCaptcha = new ReverseCaptcha('494751136895345894732582362629576539599184296195318162664695189393364372585778868512194863927652788149779748657989318645936221887731542718562643272683862627537378624843614831337441659741281289638765171452576466381314558821636595394981788588673443769343597851883955668818165723174939893841654914556681324133667446412138511724424292394454166623639872425168644336248217213826339741267546823779383343362789527461579565822966859349777937921933694912369552152772735167832762563719664315456987186713541153781499646178238762644186484381142249926194743713139262596264878458636595896487362658672224346241358667234115974528626523648311919886566497837217169673923935143386823757293148719377821517314629812886912412829924484513493885672343964151252433622341141661523814465991516961684511941471572895453711624986269342398786175846925783918686856442684489873327497698963658862856336682422797551251489126661954848572297228765445646745256499679451426358865477844467458533962981852292513358871483321161973583245698763531598395467675529181496911117769834127516441369261275244225978893617456524385518493112272169767775861256649728253754964675812534546226295535939697352141217337346738553495616832783757866928174519145357234834584788253893618549484385733283627199445369658339175644484859385884574943219267922729967571943843794565736975716174727852348441254492886794362934343868643337828637454277582276962353246357835493338372219824371517526474283541714897994127864461433627894831268659336264234436872715374727211764167739169341999573855627775114848275268739159272518673316753672995297888734844388928439859359992475637439771269232916542385876779616695129412366735112593669719335783511355773814685491876721452994714318863716542473187246351548626157775143333161422867924437526253865859969947366972895674966845993244925218766937543487875485647329995285821739359369998935331986126873726737672159265827566443794515755939813676194755474477224152139987944419463371386499841415227734673733555261543871359797796529847861748979527579985757964742667473767269248335229836818297477665453189662485548925521497365877771665365728224394427883312135322325169141784')
  sum = reverseCaptcha.halfway_around()
  // console.log(sum)
  assert.equal(sum, 1064)
}
