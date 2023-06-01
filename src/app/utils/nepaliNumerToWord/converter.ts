import { NP_MINUS, NP_UPTO_HUNDREDS, NP_TENS, NP_POINT, MAX_SUPPORTED_NUMBER, NP_RUPEES, NP_PAISA, WORD_FORMAT } from './mapping';

/**
 * Class that converts Nepali number to words
 */
export class Converter {

  /**
 * Array of converted words
 */
  private words: string[] = [];

  /**
   * Array for non-fractional part of number
   */
  private nonFractionalWords: string[] = [];

  /**
   * Array for fractional part of number
  */
  private fractionalWords: string[] = [];

  /**
   * Number for conversion
   */
  private num !: number | string;

  /**
   * Format for converted words
   * Possible formats are text, money
   * `text` returns the equivalent nepali converted word as text
   * `money` returns the equivalent nepali money text
  */
  private format !: string;

  /**
   * Default constructor
   * @param num
   * @param format
   */
  constructor(num: number | string, format: string = 'text') {
    /**
    * Check for number validity
    */
    if (!num || isNaN(+num)) {
      console.log(`${num} is not a valid number`);
      return;
    }

    //To number
    num = num;
    if (Number(num) > MAX_SUPPORTED_NUMBER) {
      console.log(`${num} is not suppoted by library. Maximum supported number is:${MAX_SUPPORTED_NUMBER}`);
      return;
    }
    //Current Number
    this.num = num;
    //Words format
    this.format = format;
    this.toWords();
  }

  /**
 * Function that converts provided number into corresponding words in nepali
 * @param num
 */
  private toWords() {
    /**
     * Check for negative
     */
    if (Number(this.num) < 0) {
      this.words = [NP_MINUS];
    }
    this.num = Math.abs(+this.num);
    /**
     * Check for decimal part
     */
    const decimalMatch = this.num.toString().match(/\.\d+/);
    if (decimalMatch) {
      //Decimal part with .
      const decimalPart = decimalMatch[0];
      //Convert decimal/fractional part to word
      this.convertDecimalWords(decimalPart);
    }

    //Conversion for non-fractional part
    const value = Math.floor(this.num);
    this.convertToWords(value);
    //Merge operator, non-fractional & fractional part for final words
    this.words = [...this.words, ...this.nonFractionalWords, ...this.fractionalWords];
  }

  /**
   * Function that converts non-fractional part of number into words
   * @param num
   */
  private convertToWords(num: number | string) {
    //Find length of current number
    num = +num;
    const numLength: number = num.toString().length;
    //If length is less then or equal to 2 then return mapped nepalstring from hundred mapping
    if (numLength <= 2) {
      this.nonFractionalWords = [...this.nonFractionalWords, NP_UPTO_HUNDREDS[num]];

      //Add Rupees add end of decimal part if format is `money`
      if (this.format === WORD_FORMAT.MONEY)
        this.nonFractionalWords.push(NP_RUPEES);

    } else {
      //Evaluate tenth dividend if length is 3(number belongs to 100 to 999) dividend is 10**2 i.e 100
      //Eg. num is 1123 then tenthDividend is 10**2 i.e 1000
      let tenthDividend: number = 10 ** (numLength - 1);
      //Search dividend in NP_TENS Object. for both thousand and ten thousand dividend is 10**3
      while (!NP_TENS[tenthDividend]) {
        tenthDividend /= 10;
      }
      //Calculate quotient
      //quotient = 1123/1000 = 1
      const quotient: number = Math.floor(num / tenthDividend);
      //Calculate remainder
      //remainder = 1123%1000 = 23
      const remainder: number = Math.floor(num % tenthDividend);
      //Prepare word
      //NP_UPTO_HUNDREDS[1] i.e एक, NP_TENS[1000] i.e हजार so word is एक हजार
      const word: string = `${NP_UPTO_HUNDREDS[quotient]} ${NP_TENS[tenthDividend]}`;
      this.nonFractionalWords = [...this.nonFractionalWords, word];
      //Perform same operation for remainder if it is not zero which is 23
      if (remainder !== 0)
        this.convertToWords(remainder);
    }
  }

  /**
   * Convert decimal part of provided number into words
   * @param num
   */
  private convertDecimalWords(num: number | string) {
    this.fractionalWords = num.toString().split('').map(n => {
      if (n === '.') {
        return this.format !== WORD_FORMAT.MONEY ? NP_POINT : '';
      }
      return NP_UPTO_HUNDREDS[n];
    });
    //Add Paisa add end of decimal part if format is `money`
    if (this.format === WORD_FORMAT.MONEY) {
      alert(this.fractionalWords);
      this.fractionalWords.push(NP_PAISA);

    }
  }

  /**
   * Function that returns words string
   */
  public returnWords(): string {
    //Return joining words array by space
    return this.words.join(' ');
  }
}
