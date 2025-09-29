import ImageKit from "imagekit";
import config from "../config";

export const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export const uploadFile = async (file: Express.Multer.File, fileName:string) => {
  const result = await imagekit.upload({
    folder: "reelato_be",
    file: file.buffer,
    fileName,
  });
  return result.url;
};
