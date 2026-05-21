import { getSignedUrl } from "@aws-sdk/cloudfront-signer";


const cloudfrontDistributionDomain = process.env.CLOUDFRONT_DIST_DOMAIN;
const privateKey = process.env.CLOUDFRONT_DIST_PRIVATE_KEY;
const keyPairId = process.env.CLOUDFRONT_DIST_KEY_PAIR_ID;
const dateLessThan = new Date(Date.now() + 60 * 60 * 1000).toISOString()

export const createCloudFrontGetObjectSignedUrl = (key) => {

    const url = `${cloudfrontDistributionDomain}/${key}`

    const signedUrl = getSignedUrl({
		url,
		keyPairId,
		dateLessThan,
		privateKey,
    });
    
    return signedUrl
}
