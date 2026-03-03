import { z } from "zod";

export const directorySchema = z.object({
	dirName: z.string().min(2),
	owner: z.string().length(24),
	parentDirId: z.string().length(24),
});
