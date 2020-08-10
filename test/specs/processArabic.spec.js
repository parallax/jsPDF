/* global describe, it, expect, jsPDF */
describe("Module: ArabicParser", function() {
  beforeAll(loadGlobals);
  it("isArabicLetter", function() {
    expect(jsPDF.API.__arabicParser__.isArabicLetter("ف")).toEqual(true);
    expect(jsPDF.API.__arabicParser__.isArabicLetter("a")).toEqual(false);
  });

  it("isArabicEndLetter", function() {
    expect(jsPDF.API.__arabicParser__.isArabicEndLetter("د")).toEqual(true);
    expect(jsPDF.API.__arabicParser__.isArabicEndLetter("ف")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicEndLetter("a")).toEqual(false);
  });

  it("isArabicAlfLetter", function() {
    expect(jsPDF.API.__arabicParser__.isArabicAlfLetter("ا")).toEqual(true);
    expect(jsPDF.API.__arabicParser__.isArabicAlfLetter("د")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicAlfLetter("ف")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicAlfLetter("a")).toEqual(false);
  });

  it("arabicLetterHasIsolatedForm", function() {
    expect(jsPDF.API.__arabicParser__.arabicLetterHasIsolatedForm("ا")).toEqual(
      true
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasIsolatedForm("د")).toEqual(
      true
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasIsolatedForm("ف")).toEqual(
      true
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasIsolatedForm("a")).toEqual(
      false
    );
  });

  it("arabicLetterHasFinalForm", function() {
    expect(jsPDF.API.__arabicParser__.arabicLetterHasFinalForm("ا")).toEqual(
      true
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasFinalForm("د")).toEqual(
      true
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasFinalForm("ف")).toEqual(
      true
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasFinalForm("a")).toEqual(
      false
    );
  });

  it("arabicLetterHasInitialForm", function() {
    expect(jsPDF.API.__arabicParser__.arabicLetterHasInitialForm("ا")).toEqual(
      false
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasInitialForm("د")).toEqual(
      false
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasInitialForm("ف")).toEqual(
      true
    );
    //expect(jsPDF.API.__arabicParser__.arabicLetterHasInitialForm("ٌ")).toEqual(true);
    expect(jsPDF.API.__arabicParser__.arabicLetterHasInitialForm("a")).toEqual(
      false
    );
  });

  it("arabicLetterHasMedialForm", function() {
    expect(jsPDF.API.__arabicParser__.arabicLetterHasMedialForm("ا")).toEqual(
      false
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasMedialForm("د")).toEqual(
      false
    );
    expect(jsPDF.API.__arabicParser__.arabicLetterHasMedialForm("ف")).toEqual(
      true
    );
    //expect(jsPDF.API.__arabicParser__.arabicLetterHasMedialForm("ٌ")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.arabicLetterHasMedialForm("a")).toEqual(
      false
    );
  });

  it("isArabicDiacritic", function() {
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("ا")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("د")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("ف")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("ٌ")).toEqual(true);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("a")).toEqual(false);
  });

  it("getCorrectForm", function() {
    expect(jsPDF.API.__arabicParser__.getCorrectForm("a", "", "")).toEqual(-1);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("د")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("ف")).toEqual(false);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("ٌ")).toEqual(true);
    expect(jsPDF.API.__arabicParser__.isArabicDiacritic("a")).toEqual(false);
  });

  it("feh", function() {
    expect(jsPDF.API.processArabic("ف").charCodeAt(0)).toEqual(65233);
    expect(jsPDF.API.processArabic("دف").charCodeAt(1)).toEqual(65233);

    expect(jsPDF.API.processArabic("فا").charCodeAt(0)).toEqual(65235);
    expect(jsPDF.API.processArabic("فا").charCodeAt(1)).toEqual(65166);

    expect(jsPDF.API.processArabic("دفا").charCodeAt(1)).toEqual(65235);
    expect(jsPDF.API.processArabic("دفا").charCodeAt(2)).toEqual(65166);

    expect(jsPDF.API.processArabic("فف").charCodeAt(0)).toEqual(65235);
    expect(jsPDF.API.processArabic("فف").charCodeAt(1)).toEqual(65234);

    expect(jsPDF.API.processArabic("ففف").charCodeAt(0)).toEqual(65235);
    expect(jsPDF.API.processArabic("ففف").charCodeAt(1)).toEqual(65236);
    expect(jsPDF.API.processArabic("ففف").charCodeAt(2)).toEqual(65234);

    expect(jsPDF.API.processArabic("فففف").charCodeAt(0)).toEqual(65235);
    expect(jsPDF.API.processArabic("فففف").charCodeAt(1)).toEqual(65236);
    expect(jsPDF.API.processArabic("فففف").charCodeAt(2)).toEqual(65236);
    expect(jsPDF.API.processArabic("فففف").charCodeAt(3)).toEqual(65234);
  });

  it("dal", function() {
    expect(jsPDF.API.processArabic("د").charCodeAt(0)).toEqual(65193);

    expect(jsPDF.API.processArabic("دف").charCodeAt(0)).toEqual(65193);

    expect(jsPDF.API.processArabic("ددف").charCodeAt(1)).toEqual(65193);
    expect(jsPDF.API.processArabic("ددف").charCodeAt(0)).toEqual(65193);

    expect(jsPDF.API.processArabic("دا").charCodeAt(0)).toEqual(65193);
    expect(jsPDF.API.processArabic("اد").charCodeAt(1)).toEqual(65193);

    expect(jsPDF.API.processArabic("فد").charCodeAt(1)).toEqual(65194);

    expect(jsPDF.API.processArabic("فدد").charCodeAt(1)).toEqual(65194);
    expect(jsPDF.API.processArabic("فدد").charCodeAt(2)).toEqual(65193);

    expect(jsPDF.API.processArabic("ددد").charCodeAt(0)).toEqual(65193);
    expect(jsPDF.API.processArabic("ددد").charCodeAt(1)).toEqual(65193);
    expect(jsPDF.API.processArabic("ددد").charCodeAt(2)).toEqual(65193);
  });

  it("resolveLigatures", function() {
    expect(
      jsPDF.API.__arabicParser__.resolveLigatures("ﻟﺎ").charCodeAt(0)
    ).toEqual(65275);
    expect(
      jsPDF.API.__arabicParser__.resolveLigatures("كاﻟﺎ").charCodeAt(2)
    ).toEqual(65275);
  });

  it("lam alif", function() {
    expect(jsPDF.API.processArabic("لا").charCodeAt(0)).toEqual(65275);

    expect(jsPDF.API.processArabic("لاا").charCodeAt(0)).toEqual(65275);
    expect(jsPDF.API.processArabic("لاا").charCodeAt(1)).toEqual(65165);

    expect(jsPDF.API.processArabic("للا").charCodeAt(0)).toEqual(65247);
    expect(jsPDF.API.processArabic("للا").charCodeAt(1)).toEqual(65276);

    expect(jsPDF.API.processArabic("للات").charCodeAt(0)).toEqual(65247);
    expect(jsPDF.API.processArabic("للات").charCodeAt(1)).toEqual(65276);
    expect(jsPDF.API.processArabic("للات").charCodeAt(2)).toEqual(65173);

    expect(jsPDF.API.processArabic("دلاا").charCodeAt(0)).toEqual(65193);
    expect(jsPDF.API.processArabic("دلاا").charCodeAt(1)).toEqual(65275);
    expect(jsPDF.API.processArabic("دلاا").charCodeAt(2)).toEqual(65165);
  });

  it("alif", function() {
    expect(jsPDF.API.processArabic("اَ").charCodeAt(0)).toEqual(65165);
  });

  it("ligatures", function() {
    expect(jsPDF.API.processArabic("الله").charCodeAt(0)).toEqual(65010);
  });

  it("position array passthrough", function() {
    expect(
      jsPDF.API.processArabic({ text: [["الله", 0, 0]] }).text[0][0].charCodeAt(
        0
      )
    ).toEqual(65010);
  });
});
