const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.DUOLINGO_JWT}`,
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
};

const SESSION_PAYLOAD = {"challengeTypes":["assist","characterIntro","characterMatch","characterPuzzle","characterSelect","characterTrace","completeReverseTranslation","definition","dialogue","form","freeResponse","gapFill","judge","listen","listenComplete","listenMatch","match","name","listenComprehension","listenIsolation","listenTap","partialListen","partialReverseTranslate","patternTapComplete","readComprehension","select","selectPronunciation","selectTranscription","syllableTap","syllableListenTap","speak","tapCloze","tapClozeTable","tapComplete","tapCompleteTable","tapDescribe","translate","transliterate","typeCloze","typeClozeTable","typeCompleteTable","writeComprehension"],"fromLanguage":"en","isFinalLevel":false,"isV2":true,"juicy":true,"learningLanguage":"ja","smartTipsVersion":2,"isCustomIntroSkill":false,"isGrammarSkill":false,"levelIndex":0,"showGrammarSkillSplash":false,"skillId":"060ce4633b12e01d03c5baa22fddd7ab","type":"LESSON","levelSessionIndex":0};

(async () => {
  for (let i = 0; i < process.env.LESSONS; i++) {
    // Random Sleep
    await new Promise(r => setTimeout(r, Math.random() * 0.5))
    
    //Start of Script
    const session = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
      body: JSON.stringify(SESSION_PAYLOAD),
      headers,
      method: 'POST',
    }).then(response => response.json())

    // Set a specific XP gain for each lesson
    const xpGainPerLesson = 300; // Change this value to the desired XP gain

    const response = await fetch(
      `https://www.duolingo.com/2017-06-30/sessions/${session.id}`,
      {
        body: JSON.stringify({
          ...session,
          heartsLeft: 0,
          startTime: (+new Date() - 60000) / 1000,
          enableBonusPoints: false,
          endTime: +new Date() / 1000,
          failed: false,
          maxInLessonStreak: 9,
          shouldLearnThings: true,
          xpGain: xpGainPerLesson, // Set the XP gain for this session
        }),
        headers,
        method: 'PUT',
      },
    ).then(response => response.json())

    console.log({ xp: xpGainPerLesson }); // Log the set XP gain
  }
})();
