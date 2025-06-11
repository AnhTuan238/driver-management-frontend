export const runWithMinDelay = async (taskFn, minDelay = 500) => {
    const start = Date.now();
    try {
        const result = await taskFn();
        const timeLeft = minDelay - (Date.now() - start);
        if (timeLeft > 0) await new Promise((r) => setTimeout(r, timeLeft));
        return result;
    } catch (err) {
        const timeLeft = minDelay - (Date.now() - start);
        if (timeLeft > 0) await new Promise((r) => setTimeout(r, timeLeft));
        throw err;
    }
};
