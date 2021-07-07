const { Router } = require("express");
const Project = require("../models/project");
const router = Router();
const multer = require("multer");
const path = require("path");
const createHash = require("hash-generator");
const fs = require("fs");

const pathToContent = path.join(__dirname, "./../../files");

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

// add item
router.post("/api/add-item/:projectId/:id", upload.single("item"), async (req, res) => {
  try {
    const { id, projectId } = req.params;
    const { type, link } = req.body;
    const { fileName } = req;
    const item = !link
      ? {
          id,
          projectId,
          type,
          fileName,
        }
      : {
          id,
          projectId,
          type,
          link,
        };

    const project = await Project.findById(projectId);
    project.items.push(item);
    await Project.findByIdAndUpdate(projectId, { $set: { items: project.items } }, { new: true });
    const projects = await Project.find();
    return res.status(200).json({ result: true, projects });
  } catch (e) {
    return res.status(501).end();
  }
});

// update item
router.put("/api/update-item/:projectId/:id", upload.single("item"), async (req, res) => {
  try {
    const { id, projectId } = req.params;
    const { link } = req.body;
    const { fileName } = req;

    const project = await Project.findById(projectId);
    const indexItem = project.items.findIndex((item) => item.id === id);
    const oldName = project.items[indexItem].fileName;
    const type = project.items[indexItem].type;
    if (fileName) {
      project.items[indexItem].fileName = fileName;
    }
    if (link) {
      project.items[indexItem].link = link;
    }

    if ((oldName && type === "video") || type === "image") {
      fs.unlink(path.join(__dirname, "./../../files", oldName), (err) => err && console.log(err));
    }
    await Project.findByIdAndUpdate(projectId, { $set: { items: project.items } }, { new: true });
    const projects = await Project.find();
    return res.status(200).json({ result: true, projects });
  } catch (e) {
    console.log(e);
    return res.status(501).end();
  }
});

//remove item
router.delete("/api/remove-item/:projectId/:id", async (req, res) => {
  try {
    const { id, projectId } = req.params;
    const project = await Project.findById(projectId);
    const indexItem = project.items.findIndex((item) => item.id === id);
    const { type, fileName } = project.items[indexItem];
    if (type === "video" || type === "image") {
      fs.unlink(path.join(__dirname, "./../../files", fileName), (err) => err && console.log(err));
    }
    project.items.splice(indexItem, 1);
    await Project.findByIdAndUpdate(projectId, { $set: { items: project.items } }, { new: true });
    const projects = await Project.find();
    return res.status(200).json({ result: true, projects });
  } catch (e) {
    console.log(e);
    return res.status(501).end();
  }
});

router.use(multer().array());

router.post("/api/create-project/", async (req, res) => {
  try {
    const { project } = req.body;
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
    fs.readdir(pathToContent, (err, files) => {
      if (err) return console.log(err)
      files.forEach(fileName => {
        if (fileName.includes(req.params._id)) {
          const file = path.join(pathToContent, fileName)
          fs.unlink(file, err => err && console.log(err))
        }
      })
    })
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
