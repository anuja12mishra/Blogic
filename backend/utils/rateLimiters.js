
const userLastRequestMap = new Map();

const rateLimitGenerateContent = (req, res, next) => {
    const userId = req.user.id; 

    const now = Date.now();
    const fourHours = 4 * 60 * 60 * 1000;

    const lastRequestTime = userLastRequestMap.get(userId);

    if (lastRequestTime && (now - lastRequestTime) < fourHours) {
        const remainingTime = Math.ceil((fourHours - (now - lastRequestTime)) / (60 * 1000)/60);
        return res.status(429).json({
            message: `AI usage limit exceeded. Try again in ${remainingTime} hours.`,
        });
    }

    userLastRequestMap.set(userId, now);
    next();
};

export default rateLimitGenerateContent;
