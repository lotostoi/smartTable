const { Router } = require("express");
const Project = require("../models/project");
const router = Router();
const multer = require("multer");
const path = require("path");
const createHash = require("hash-generator");
const fs = require("fs");

const pathToContent = path.join(__dirname, "./../../files");

const getFirstFrame = (video, linkToFile) =>
  new Promise((res, rej) => {
    const process = new ffmpeg(video);
    process.then(
      function (vid) {
        vid.addCommand("-ss", "00:03:30");
        vid.addCommand("-vframes", "1");
        vid.save(path.join(__dirname, "./../../files/test.jpg"), function (error, file) {
          if (!error) res(console.log("Video file: " + file));
 
        });
      },
      function (err) {
        rej(console.log("Error: " + err));
      }
    );
  });

const ffmpeg = require("ffmpeg");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathToContent);
  },
  filename: function (req, file, cb) {
    const { id, projectId } = req.params;
    const item = req.body;
    req.fileName =
      projectId + "_" + id + "_hash_" + createHash(4) + path.extname(file.originalname);
    req.item = item;
    cb(null, req.fileName);
  },
});

let upload = multer({ storage: storage });

router.post("/api/add-item/:projectId/:id", upload.single("item"), async (req, res) => {
  try {
    const { id, projectId } = req.params;
    const { type, name } = req.body;
    const { fileName } = req;

    const file = path.join(pathToContent, fileName);

    console.log(file);

    if (type === "video") {
      await getFirstFrame(file, "./test.jpg");
    }

    const project = Project.findById(projectId);

    res.status(200).end();
  } catch (e) {
    console.log(e);
    console.log(e);
  }
});

//router.use(multer().array());

router.post("/api/create-project/", async (req, res) => {
  try {
    const { project } = req.body;
    console.log(project);
    if ("_id" in project) {
      return res.status(200).json({ result: false, error: "Such project already is" });
    }
    const newProject = new Project(project);
    await newProject.save();
    const projects = await Project.find();
    return res.status(200).json({ result: true, projects });
  } catch (e) {
    console.log(e);
    return res.status(501).end();
  }
});

router.get("/api/get-projects", async (req, res) => {
  try {
    const projects = await Project.find();
    return res.status(200).json({ result: true, projects });
  } catch (e) {
    console.log(e);
    return res.status(501).end();
  }
});
router.delete("/api/delete-project/:_id", async (req, res) => {
  try {
    const user = await Project.deleteOne({ _id: req.params._id });
    if (user) {
      res.status(200).send({ result: true });
    } else {
      res.status(501).send({ result: false });
    }
  } catch (e) {
    console.error(e);
    res.status(501).send({ result: false });
  }
});

module.exports = router;
