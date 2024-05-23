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

	const XP_PER_LESSON = 10; // Assuming 10 XP per lesson
	const TARGET_XP_RATE_PER_SECOND = 80; // Target XP rate per second

	const lessonsNeeded = Math.ceil(TARGET_XP_RATE_PER_SECOND / XP_PER_LESSON);

	let xp = 0; // Initialize XP counter
	for (let i = 0; i < lessonsNeeded; i++) {
		const startTime = +new Date(); // Start time of the lesson

		const session = await fetch(
			"https://www.duolingo.com/2017-06-30/sessions",
			{
				body: JSON.stringify({
					challengeTypes: [
						// List of challenge types
						"assist",
						// ... (other challenge types)
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

		const endTime = +new Date(); // End time of the lesson

		const timeElapsedInSeconds = (endTime - startTime) / 1000; // Calculate time elapsed in seconds
		const xpGained = XP_PER_LESSON * (timeElapsedInSeconds > 0 ? 1 : 0); // Calculate XP gained based on time elapsed

		xp += xpGained; // Accumulate XP

		// Wait for the remaining time to achieve the target rate
		const timeToWaitInSeconds = Math.max(0, 1 - timeElapsedInSeconds);
		await new Promise((resolve) => setTimeout(resolve, timeToWaitInSeconds * 1000));
	}

	console.log(`🎉 You won ${xp} XP`); // Log total XP
} catch (error) {
	console.log("❌ Something went wrong"); // Generic error message
	if (error instanceof Error) {
		console.log(error.message); // Log specific error message
	}
}
