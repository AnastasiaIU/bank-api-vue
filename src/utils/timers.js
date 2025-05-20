export async function enforceMinimumDelay(startTime, minDuration = 1000) {
    const elapsed = Date.now() - startTime;
    const remaining = minDuration - elapsed;

    if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
    }
}
