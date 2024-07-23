import { multiplicateValues } from "../app/Dummy";

describe('set of math test', () => {
  
    test('it is pair', () => {
      expect(6 % 2).toEqual(0);
    });
  
    test('it is not pair', () => {
      expect(7 % 2).not.toEqual(0);
    });
    
    test('multiplicateValues same positive number should be equal to apply the square exponent to it', () => {
      const randomNumber = Math.floor(Math.random() * 10 + 1);
      expect(multiplicateValues(randomNumber,randomNumber)).toEqual(randomNumber**2);
    });
    
  });