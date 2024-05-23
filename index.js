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

    const lessonDuration = 2 * 1000; // 2 seconds in milliseconds
    const xpPerInterval = 50; // XP gained per interval

    let elapsedTime = 0;
    let xp = 0;

    while (elapsedTime < process.env.LESSONS * lessonDuration) {
        await new Promise((resolve) => setTimeout(resolve, lessonDuration)); // Wait for 2 seconds

        xp += xpPerInterval;
        elapsedTime += lessonDuration;

        console.log(`🎉 You won ${xp} XP`); // Log total XP
    }
} catch (error) {
    console.log("❌ Something went wrong"); // Generic error message
    if (error instanceof Error) {
        console.log(error.message); // Log specific error message
    }
}
