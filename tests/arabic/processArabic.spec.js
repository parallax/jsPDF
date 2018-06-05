'use strict'
/* global describe, it, expect, jsPDF, comparePdf */

describe('processArabic', () => {
  it('ف', () => {

    expect(jsPDF.API.processArabic("ف").charCodeAt(0)).equals(65235);
    expect(jsPDF.API.processArabic("دف").charCodeAt(1)).equals(65235);
      
    expect(jsPDF.API.processArabic("فا").charCodeAt(0)).equals(65235);
    expect(jsPDF.API.processArabic("فا").charCodeAt(1)).equals(65166);
    
    expect(jsPDF.API.processArabic("دفا").charCodeAt(1)).equals(65235);
    expect(jsPDF.API.processArabic("دفا").charCodeAt(2)).equals(65166);
    
    expect(jsPDF.API.processArabic("فف").charCodeAt(0)).equals(65235);
    expect(jsPDF.API.processArabic("فف").charCodeAt(1)).equals(65234);
    
    
    expect(jsPDF.API.processArabic("ففف").charCodeAt(0)).equals(65235);
    expect(jsPDF.API.processArabic("ففف").charCodeAt(1)).equals(65236);
    expect(jsPDF.API.processArabic("ففف").charCodeAt(2)).equals(65234);
    
    expect(jsPDF.API.processArabic("فففف").charCodeAt(0)).equals(65235);
    expect(jsPDF.API.processArabic("فففف").charCodeAt(1)).equals(65236);
    expect(jsPDF.API.processArabic("فففف").charCodeAt(2)).equals(65236);
    expect(jsPDF.API.processArabic("فففف").charCodeAt(2)).equals(65234);

  })
  
  it('د', () => {

    expect(jsPDF.API.processArabic("د").charCodeAt(0)).equals(65193);  
    
    expect(jsPDF.API.processArabic("دف").charCodeAt(0)).equals(65193);
    
    expect(jsPDF.API.processArabic("ددف").charCodeAt(1)).equals(65193);
    expect(jsPDF.API.processArabic("ددف").charCodeAt(0)).equals(65193);
    
    expect(jsPDF.API.processArabic("دا").charCodeAt(0)).equals(65193);
    expect(jsPDF.API.processArabic("اد").charCodeAt(1)).equals(65193);
    
    expect(jsPDF.API.processArabic("فد").charCodeAt(1)).equals(65194);
    
    expect(jsPDF.API.processArabic("فدد").charCodeAt(1)).equals(65194);
    expect(jsPDF.API.processArabic("فدد").charCodeAt(2)).equals(65193);
    
    
    expect(jsPDF.API.processArabic("ددد").charCodeAt(0)).equals(65193);
    expect(jsPDF.API.processArabic("ددد").charCodeAt(1)).equals(65193);
    expect(jsPDF.API.processArabic("ددد").charCodeAt(2)).equals(65193);
  })
  
  it('ل ا', () => {
    
    expect(jsPDF.API.processArabic("لا").charCodeAt(0)).equals(65275);
    
    expect(jsPDF.API.processArabic("لاا").charCodeAt(0)).equals(65275);
    expect(jsPDF.API.processArabic("لاا").charCodeAt(1)).equals(65165);
    
    expect(jsPDF.API.processArabic("للا").charCodeAt(0)).equals(65247);
    expect(jsPDF.API.processArabic("للا").charCodeAt(1)).equals(65276);
    
    expect(jsPDF.API.processArabic("للات").charCodeAt(0)).equals(65247);
    expect(jsPDF.API.processArabic("للات").charCodeAt(1)).equals(65276);
    expect(jsPDF.API.processArabic("للات").charCodeAt(2)).equals(65276);
    
    
    expect(jsPDF.API.processArabic("دلاا").charCodeAt(0)).equals(65193);
    expect(jsPDF.API.processArabic("دلاا").charCodeAt(1)).equals(65275);
    expect(jsPDF.API.processArabic("دلاا").charCodeAt(2)).equals(65165);
  })
  
  
  xit('ligatures', () => {
    expect(jsPDF.API.processArabic("الله").charCodeAt(0)).equals(65010);
  })
})
