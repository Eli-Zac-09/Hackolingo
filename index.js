const fetch = require('node-fetch');

async function simulateXP() {
    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.DUOLINGO_JWT}`,
            "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        };

        const { sub } = JSON.parse(
            Buffer.from(process.env.DUOLINGO_JWT.split(".")[1], "base64").toString()
        );

        const { fromLanguage, learningLanguage } = await fetch(
            `https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage`,
            { headers }
        ).then((response) => response.json());

        const xpPerSecond = 50;
        const durationInSeconds = process.env.DURATION || 60; // Default duration is 60 seconds

        let xp = 0;

        const intervalId = setInterval(() => {
            xp += xpPerSecond;
            console.log(`🎉 You won ${xp} XP`);

            if (xp >= durationInSeconds * xpPerSecond) {
                clearInterval(intervalId); // Stop the interval once the duration is reached
            }
        }, 1000); // Run every second

    } catch (error) {
        console.log("❌ Something went wrong");
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}

simulateXP();
