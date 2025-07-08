import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const generateOtp = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

export const uploadFile = async (file, destination, extensions = []) => {
  if (!file || !file.name || !destination) {
    throw new Error("Invalid input: file and destination are required.");
  }

  const ext = path.extname(file.name).toLowerCase();

  if (extensions.length > 0 && !extensions.includes(ext)) {
    throw new Error(`File type not allowed: ${ext}`);
  }

  const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
  const uploadDir = path.join(__dirname, "../../public/", destination);
  const uploadPath = path.join(uploadDir, uniqueName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });

    await fs.writeFile(uploadPath, await fs.readFile(file.tempFilePath));

    return uniqueName;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }
};

export const deleteFile = (name = "", dir) => {
  if (name == "") return;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imagePath = path.join(__dirname, "../../public", dir, name);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting image file:", err);
    } else {
      console.log("Image file deleted:", imagePath);
    }
  });
};

export const createFileUrl = (dir, name = null) => {
  if (name == undefined || name == null || name == "") return null;

  return `${process.env.APP_URL + dir}/${name}`;
};

export const paginationQuery = (totaldata, page = 1, limit = 10) => {
  const totalPages = Math.ceil(totaldata / limit);
  const hasMorePages = page < totalPages;
  const previousPageUrl = page > 1 ? `?page=${page - 1}&limit=${limit}` : null;

  return {
    lastPage: totalPages,
    currentPage: page,
    total: totaldata,
    perPage: limit,
    hasMorePages,
    previousPageUrl,
  };
};

export const enrichUser = async (userId) => {
  try {
    const user = await User.findById(userId).populate({
      path: "roles",
      populate: { path: "permissions" },
    });

    if (!user) return null;

    const roles = user.roles.map((role) => role.name);
    const permissions = user.roles.flatMap((role) =>
      role.permissions.map((p) => p.name)
    );

    return {
      ...user.toObject(),
      roles,
      permissions,
    };
  } catch (err) {
    console.error("Error in enrichUser:", err);
    return null;
  }
};

export const multipleFileUpload = async (
  files,
  destination,
  extensions = [],
  res = null
) => {
  if (!files || !destination) {
    throw new Error("Files and destination must be provided");
  }

  const uploadDir = path.join(__dirname, "../../public/", destination);

  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const fileArray = Array.isArray(files) ? files : [files];

    const uploadedFiles = await Promise.all(
      fileArray.map(async (file) => {
        const ext = path.extname(file.name).toLowerCase();

        if (extensions.length > 0 && !extensions.includes(ext)) {
          if (res)
            return ResponseBuilder.error(
              `Invalid file type: ${file.name}`,
              400
            ).build(res);
          throw new Error(`Invalid file type: ${file.name}`);
        }

        const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
        const uploadPath = path.join(uploadDir, uniqueName);

        await fs.writeFile(uploadPath, await fs.readFile(file.tempFilePath));
        return uniqueName;
      })
    );

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading files:", error.message);
    return null;
  }
};

export const loadHtmlTemplate = async (filePath, replacements) => {
  let template = await fs.readFile(filePath, { encoding: "utf-8" });

  for (const key in replacements) {
    template = template.replace(
      new RegExp(`{{${key}}}`, "g"),
      replacements[key]
    );
  }

  return template;
};
