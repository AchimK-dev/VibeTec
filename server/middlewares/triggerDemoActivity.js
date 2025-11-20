import { simulateRandomActivity } from '../utils/demoDataGenerator.js';

let lastActivityTimestamp = Date.now();

const triggerDemoActivity = async (req, res, next) => {
  try {
    const now = Date.now();
    const minutesSinceLastActivity = (now - lastActivityTimestamp) / (1000 * 60);

    next();

    if (minutesSinceLastActivity >= 10) {
      lastActivityTimestamp = now;

      setImmediate(async () => {
        try {
          const updatesCount = Math.min(Math.floor(minutesSinceLastActivity / 10), 3);

          for (let i = 0; i < updatesCount; i++) {
            await simulateRandomActivity();
          }
        } catch (error) {}
      });
    }
  } catch (error) {}
};

export default triggerDemoActivity;
