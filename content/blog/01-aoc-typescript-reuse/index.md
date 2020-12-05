---
title: Advent of Code, Typescript and Making Your Code Reusable
date: "2020-12-05"
description: "Building a generic Typescript class to reuse across the Advent of Code"
---

Like many developers, I awoke on the 1st of December as if it was Christmas morning, eager to rush to my laptop and see what ~~Santa~~ [Eric Wastl](http://was.tl/) had brought for me this year. That's right, its time for this year's [Advent of Code](https://adventofcode.com/)!

If you have never heard of it, the Advent of Code is an annual advent calendar of coding challenge in the form of a story broken up into 25 2-stage instalments. This year is particularly poignant as it is set on vacation on a tropical island (nice one Covid) however previous instalments have taken us to Outer Space and through the time stream. Each challenge is revealed at midnight EST and consists of that day's part of the story that leads to two problems, the second unlocking once you complete the first. You can write your solutions in any language, I highly recommend checking the AoC subreddit to see some of the mindblowing things people do (the Unity visualisations are a particular highlight for me).
For the last couple of years, I have tried to follow along although time/festive commitments/general burnout over the Christmas crunch has always led to me dropping off. This year, with the extra time afforded by my new remote job and distinct lack of social engagements (again, nice one Covid) I'm determined to get through it. I am writing my solutions in Typescript and also following some TDD principles as I am always looking to improve my chops in these areas.

My initial approach to AoC challenges was to tackle each one in isolation, however last year I noticed some days reused concepts from previous challenges, in particular the fiendish Intcode machine which kept cropping up. As a result, this year I am going to ensure that wherever possible I refactor my solutions into easily reusable classes/modules, just in case!
So far, this hasn't happened, however, if it does, I'll be ready!
Let's take Day 4 as an example of my process…

The problem requires us to validate passport inputs against a series of increasingly complex conditions. We are given the inputs as a text file and some examples. The first problem asks us to check for the presence of several required fields and count how many valid passports there were. I quickly sketched out a solution that involved converting each input to an object and checking for the presence of each of these keys:

```typescript
const passports = parseInput('input.txt');
const requiredFields = [...];

const validCount = passports.reduce((count, passport) => {
   // Check passport fields and increment count if all valid
}, 0);

console.log(`Valid passports: ${validCount}`);
```

This is perfectly valid and gave me the correct answer, however, part 2 delivered a much stricter set of requirements for each field. Obviously, I could just power through with my initial approach but my programmer's instinct told me that validating inputs against a set of requirements is something that could come up again in future. Time for a refactor!

---

## Creating a Validator

Let's consider what we want a validator to do. Essentially we want to validate inputs against a number of rules and return a boolean.

```typescript
type Rule<T> = (input: T) => boolean;

interface iValidator<T> {
    rules: Rule<T>[];
    validate: (input: T) => boolean;
}
```

Note we define the generic type T, meaning we can define exactly what types of data we want to validate.

Now, let's be good developers and write tests for our expected behaviour. I like to use Jest as my test runner but there are many other alternatives out there. Note that here we specify string validation, although in theory if our tests pass for one type they should pass for all (due to the magic of Typescript!)

```typescript
//Validator.spec.ts
describe("Validator", () => {
    const minLengthRule: Rule<string> = input => input.length > 5;
    const maxLengthRule: Rule<string> = input => input.length < 10;

    const validator = new Validator<string>([minLengthRule, maxLengthRule]);

    describe("validate", () => {
        it("returns true when all rules pass", () => {
            expect(validator.validate("abcdef")).toBeTruthy();
        });

        it("returns false when any rule is broken", () => {
            expect(validator.validate("abc")).toBeFalsy();
            expect(validator.validate("abcdefghijk")).toBeFalsy();
        });
    });
});
```

Obviously, at the moment our tests fail because we have written no code! Let's rectify that.

```typescript
class Validator<T> implements iValidator<T> {
    constructor(public rules: Rule<T>[]) {}

    validate(input: T): boolean {
        return this.rules.every(rule => rule(input));
    }
}
```

Et voila, all our tests should be green. We can now write as many rules as we like, pass them to a validator and check that our inputs pass. For this particular challenge, I wrote a Passport class to represent individual inputs (see my Github repo for reference)

```typescript
const passports: Passport[] = parseInput();
const requiredKeys: Rule<Passport> = (input) => {...}
const ruleX: Rule<Passport> = (input) => {...}
const ruleY: Rule<Passport> = (input) => {...}
//...Other rules

const validator1 = new Validator<Passport>([requiredKeys]);
const validator2 = new Validator<Passport>([
   requiredKeys,
   ruleX,
   ruleY,
   ...
]);

const part1 = passports.reduce((count, passport) =>{
   if(validator1.validate(passport)) {
      count += 1;
   }
   return count;
}, 0);

const part2 = passports.reduce((count, passport) =>{
   if(validator2.validate(passport)) {
      count += 1;
   }
return count;
}, 0);
```

We could leave it here, our Validator class is giving the correct answers, we have our 2 gold stars and we can move on to the next day…but my spidey sense is still tingling. Those 2 Array.reduce() functions are bothering me, they look pretty much identical, and getting an array of valid inputs seems like a pretty useful thing to do. Let's write some tests!

```typescript
// Validator.spec.ts
describe('Validator', () => {
   const minLengthRule: Rule<string> = input => input.length > 5;
   const maxLengthRule: Rule<string> = input => input.length < 10;
   const validator = new Validator<string>([
      minLengthRule,
      maxLengthRule,
   ]);

...

describe('Filtering', () => {
      it('filters out invalid inputs', () => {
         expect(validator.filterInvalid([
            'abc',
            'abcdef',
            'abcdefghijk',
         ])).toEqual(['abcdef']);
      })
   });
});
```

And now let's make it pass…

```typescript
class Validator<T> implements iValidator<T> {
    constructor(public rules: Rule<T>[]) {}

    validate(input: T): boolean {
        return this.rules.every(rule => rule(input));
    }

    filterInvalid(input: T[]): T[] {
        return input.filter(el => this.validate(el));
    }
}
```

Sweet, all our tests are green and our solution code now looks like this

```typescript
...
const part1 = validator1.filterInvalid(passports).length;
const part2 = validator2.filterInvalid(passports).length;
```

---

So there we have it, we have gone from a solution that solves day 4 of the Advent of Code and that day only, to a Validator class that can be used whenever we need to validate some data. We have also written tests so that next time we know that we can just reach for our Validator and get our solution with confidence and maybe, just maybe, get our name onto that hallowed leaderboard (spoiler, it's really hard).

You may also see that I have not actually included any solution to the challenge because where would the fun be in that! If you want to see my solutions and attempts at previous years I have [a Gihub Repo](https://github.com/andomain/advent-of-code) but have a go yourself first.

I hope you found this useful whether you are doing AoC or not but if you are good luck!
