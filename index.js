try {
	process.env.LESSONS = process.env.LESSONS ?? 1; // Set the number of lessons to 1 if not already set

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.DUOLINGO_JWT}`, // Authorization header with JWT token
		"user-agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
	};

	const { sub } = JSON.parse(
		Buffer.from(process.env.DUOLINGO_JWT.split(".")[1], "base64").toString(), // Decode the JWT to get the user ID
	);

	const { fromLanguage, learningLanguage } = await fetch(
		`https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage`,
		{
			headers,
		},
	).then((response) => response.json()); // Fetch user's fromLanguage and learningLanguage

	let xp = 0; // Initialize XP counter
	for (let i = 0; i < process.env.LESSONS; i++) {
		const session = await fetch(
			"https://www.duolingo.com/2017-06-30/sessions",
			{
				body: JSON.stringify({
					challengeTypes: [
						// List of challenge types
						"assist",
						"characterIntro",
						"characterMatch",
						"characterPuzzle",
						"characterSelect",
						"characterTrace",
						"characterWrite",
						"completeReverseTranslation",
						"definition",
						"dialogue",
						"extendedMatch",
						"extendedListenMatch",
						"form",
						"freeResponse",
						"gapFill",
						"judge",
						"listen",
						"listenComplete",
						"listenMatch",
						"match",
						"name",
						"listenComprehension",
						"listenIsolation",
						"listenSpeak",
						"listenTap",
						"orderTapComplete",
						"partialListen",
						"partialReverseTranslate",
						"patternTapComplete",
						"radioBinary",
						"radioImageSelect",
						"radioListenMatch",
						"radioListenRecognize",
						"radioSelect",
						"readComprehension",
						"reverseAssist",
						"sameDifferent",
						"select",
						"selectPronunciation",
						"selectTranscription",
						"svgPuzzle",
						"syllableTap",
						"syllableListenTap",
						"speak",
						"tapCloze",
						"tapClozeTable",
						"tapComplete",
						"tapCompleteTable",
						"tapDescribe",
						"translate",
						"transliterate",
						"transliterationAssist",
						"typeCloze",
						"typeClozeTable",
						"typeComplete",
						"typeCompleteTable",
						"writeComprehension",
					],
					fromLanguage,
					isFinalLevel: false,
					isV2: true,
					juicy: true,
					learningLanguage,
					smartTipsVersion: 2,
					type: "GLOBAL_PRACTICE",
				}),
				headers,
				method: "POST", // Create a new session
			},
		).then((response) => response.json());

		const response = await fetch(
			`https://www.duolingo.com/2017-06-30/sessions/${session.id}`,
			{
				body: JSON.stringify({
					...session,
					heartsLeft: 0,
					startTime: (+new Date() - 6000) / 1000, // Set start time to 6 seconds ago (10x faster)
					enableBonusPoints: false,
					endTime: +new Date() / 1000, // Set end time to now
					failed: false,
					maxInLessonStreak: 9,
					shouldLearnThings: true,
				}),
				headers,
				method: "PUT", // Complete the session
			},
		).then((response) => response.json());

		xp += response.xpGain; // Accumulate XP
	}

	console.log(`🎉 You won ${xp} XP`); // Log total XP
} catch (error) {
	console.log("❌ Something went wrong"); // Generic error message
	if (error instanceof Error) {
		console.log(error.message); // Log specific error message
	}
}
