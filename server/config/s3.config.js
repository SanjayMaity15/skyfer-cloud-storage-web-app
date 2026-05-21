import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

export const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
});



export const getObject = async (key, download = false, filename = "file") => {
	try {
		const command = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,

			// THIS controls preview vs download
			ResponseContentDisposition: download
				? `attachment; filename="${encodeURIComponent(filename)}"`
				: "inline",
		});

		const url = await getSignedUrl(s3, command, {
			expiresIn: 3600,
		});

		return url;
	} catch (error) {
		console.log(error);
	}
};