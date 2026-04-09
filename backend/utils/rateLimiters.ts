import { Request, Response, NextFunction } from 'express';

const userLastRequestMap = new Map<string, number>();

const rateLimitGenerateContent = (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id || (req as any).user?._id; 

    if (!userId) {
        return res.status(401).json({ message: "Authentication required: user ID not found" });
    }

    const now = Date.now();
    const fourHours = 4 * 60 * 60 * 1000;

    const lastRequestTime = userLastRequestMap.get(userId);

    if (lastRequestTime && (now - lastRequestTime) < fourHours) {
        const remainingTime = Math.ceil((fourHours - (now - lastRequestTime)) / (60 * 1000) / 60);
        return res.status(429).json({
            message: `AI usage limit exceeded. Try again in ${remainingTime} hours.`,
        });
    }

    userLastRequestMap.set(userId, now);
    next();
};

export default rateLimitGenerateContent;
