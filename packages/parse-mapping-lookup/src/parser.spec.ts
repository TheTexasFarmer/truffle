import { parse } from "@truffle/parse-mapping-lookup/parser";

import {
  expression,
  indexAccess,
  memberLookup,
  identifier,
  pointer,
  numberLiteral,
  stringLiteral,
  booleanLiteral,
  hexLiteral
} from "@truffle/parse-mapping-lookup/ast";

const testCases = [
  {
    expression: `m[0]`,
    result: expression({
      root: identifier({ name: "m" }),
      pointer: pointer({
        path: [indexAccess({ index: numberLiteral({ value: "0" }) })]
      })
    })
  },
  {
    expression: `m[0][1]`,
    result: expression({
      root: identifier({ name: "m" }),
      pointer: pointer({
        path: [
          indexAccess({ index: numberLiteral({ value: "0" }) }),
          indexAccess({ index: numberLiteral({ value: "1" }) })
        ]
      })
    })
  },
  {
    expression: `m["hello"]`,
    result: expression({
      root: identifier({ name: "m" }),
      pointer: pointer({
        path: [indexAccess({ index: stringLiteral({ value: "hello" }) })]
      })
    })
  },
  {
    expression: `m["\\""]`,
    result: expression({
      root: identifier({ name: "m" }),
      pointer: pointer({
        path: [indexAccess({ index: stringLiteral({ value: '"' }) })]
      })
    })
  },
  {
    expression: `s.m[0]`,
    result: expression({
      root: identifier({ name: "s" }),
      pointer: pointer({
        path: [
          memberLookup({ property: identifier({ name: "m" }) }),
          indexAccess({ index: numberLiteral({ value: "0" }) })
        ]
      })
    })
  },
  {
    expression: `m$[false]._k[true]`,
    result: expression({
      root: identifier({ name: "m$" }),
      pointer: pointer({
        path: [
          indexAccess({ index: booleanLiteral({ value: false }) }),
          memberLookup({ property: identifier({ name: "_k" }) }),
          indexAccess({ index: booleanLiteral({ value: true }) })
        ]
      })
    })
  },
  {
    expression: `m["\\x41"]`,
    result: expression({
      root: identifier({ name: "m" }),
      pointer: pointer({
        path: [
          indexAccess({ index: stringLiteral({ value: "A" }) })
        ]
      })
    })
  },
  {
    expression: `m[`,
    errors: true
  },
  {
    expression: `m[hex"deadbeef"]`,
    result: expression({
      root: identifier({ name: "m" }),
      pointer: pointer({
        path: [
          indexAccess({ index: hexLiteral({ value: "0xdeadbeef" }) })
        ]
      })
    })
  },
  {
    expression: `m[hex"deadbee"]`,
    errors: true
  }
];

describe("@truffle/parse-mapping-lookup", () => {
  for (const { expression, errors = false, result: expected } of testCases) {
    it(`parses: ${expression}`, () => {
      let result;
      try {
        result = parse(expression);
      } catch (error) {
        expect(errors).toEqual(true);
        return;
      }

      expect(result).toEqual(expected);
    });
  }
});
